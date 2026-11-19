import { findSuspectEntries } from '@/audit/display';
import { DEFAULT_AUDIT_RETENTION_DAYS } from '@/core/policy/audit-retention-days';
import {
  activityFiltersFromParams,
  activityHash,
  type Decision,
  initialActivityFilters,
  visibleEntries,
} from '../activity-filter';
import {
  formatClockTime,
  formatCount,
  formatDateTime,
  formatDayHeading,
  formatRelativeTime,
  t,
} from '../i18n';
import { buildReportRequest, reportTitle, scrubReportPaths } from '../report';
import type { ActivityFeed, FeedEntry } from '../types';
import {
  agentLabels,
  copyText,
  errorText,
  escapeHtml,
  icons,
  notify,
  on,
  qs,
  requestJson,
  runRefresh,
  shared,
  showPath,
} from '../ui';
import { loadOverview } from './overview';

const filters = initialActivityFilters();
let activity: ActivityFeed | null = null;
let suspects = new Set<FeedEntry>();
let renderedEntries: FeedEntry[] = [];
let queryTimer: number | undefined;

const syncHash = () => {
  if (document.body.dataset.view === 'activity')
    history.replaceState(null, '', `#${activityHash(filters)}`);
};

export const retentionDays = () =>
  shared.policy?.policy.audit.retention_days ?? DEFAULT_AUDIT_RETENTION_DAYS;

const knownRuleIds = () =>
  new Set(
    [
      ...(shared.policy?.destructiveCommandRules ?? []),
      ...(shared.policy?.secretPatterns ?? []),
    ].map((rule) => rule.id),
  );

const decisionLabel = (entry: FeedEntry) =>
  entry.failureStage
    ? t.decisionError
    : entry.decision === 'allow'
      ? t.decisionAllowed
      : t.decisionBlocked;

const reportFieldNames: Record<string, string> = {
  title: t.reportNameTitle,
  expected: t.reportNameExpected,
  command: t.reportNameCommand,
  entry: t.reportNameEntry,
};

const ruleLink = (ruleId: string) =>
  ruleId.startsWith('custom.')
    ? `<a class="rule-id" href="#rules?focus=${encodeURIComponent(ruleId)}" title="${escapeHtml(t.showCustomRule)}">${escapeHtml(ruleId)}</a>`
    : knownRuleIds().has(ruleId)
      ? `<a class="rule-id" href="#policy?q=${encodeURIComponent(ruleId)}" title="${escapeHtml(t.showProtection)}">${escapeHtml(ruleId)}</a> · <a href="#policy?q=${encodeURIComponent(ruleId)}&message=1">${escapeHtml(t.customizeMessage)}</a>`
      : `<code class="rule-id">${escapeHtml(ruleId)}</code>`;

const entryCommand = (entry: FeedEntry) => entry.segment || entry.command || '';

const feedRowHtml = (entry: FeedEntry, index: number) => {
  const blocked = entry.decision !== 'allow';
  const command = entryCommand(entry);
  const agent =
    entry.agent && entry.agent !== 'unknown' ? (agentLabels[entry.agent] ?? entry.agent) : '';
  const detailRows = [
    entry.command && entry.command !== command
      ? [t.detailFullCommand, `<code class="block">${escapeHtml(entry.command)}</code>`]
      : null,
    entry.reason && entry.reason !== 'allowed' ? [t.detailReason, escapeHtml(entry.reason)] : null,
    entry.ruleId ? [t.detailRule, ruleLink(entry.ruleId)] : null,
    entry.cwd ? [t.detailFolder, `<code>${escapeHtml(entry.cwd)}</code>`] : null,
    [
      t.detailTime,
      `${escapeHtml(formatDateTime(entry.ts))} (${escapeHtml(formatRelativeTime(entry.ts))})`,
    ],
  ].filter((row): row is string[] => row !== null);
  return `<li class="feed-row">
    <button type="button" class="feed-summary" aria-expanded="false" aria-controls="feed-detail-${index}">
      <span class="chevron" aria-hidden="true"></span>
      <time datetime="${escapeHtml(entry.ts)}">${escapeHtml(formatClockTime(entry.ts))}</time>
      <span class="decision ${entry.failureStage ? 'error' : blocked ? 'deny' : 'allow'}">${decisionLabel(entry)}</span>
      <span class="feed-agent">${escapeHtml(agent)}</span>
      <code class="feed-command">${escapeHtml(command || t.noCommandRecorded)}</code>
      <span class="feed-rule">${escapeHtml(entry.ruleId ?? '')}</span>
    </button>
    <div class="feed-detail" id="feed-detail-${index}" hidden>
      <code class="block detail-command">${escapeHtml(command || t.noCommandRecorded)}</code>
      <div class="detail-actions">
        ${blocked ? `<button type="button" class="primary" data-report-fp="${index}">${escapeHtml(t.reportFalsePositive)}</button>` : `<button type="button" class="primary" data-block-future="${index}">${escapeHtml(t.blockInFuture)}</button>`}
        <button type="button" data-log-copy="${index}">${icons.copy}<span>${escapeHtml(t.copyLogEntry)}</span></button>
      </div>
      <dl class="detail-rows">${detailRows.map(([term, value]) => `<div><dt>${escapeHtml(term)}</dt><dd>${value}</dd></div>`).join('')}</dl>
    </div>
  </li>`;
};

const renderControls = () => {
  if (!activity) return;
  const loaded = activity;
  const segment = (value: Decision, label: string, count: number) =>
    `<button type="button" data-activity-decision="${value}" aria-pressed="${filters.decision === value}">${escapeHtml(label)} <span class="count">${formatCount(count)}</span></button>`;
  qs('activity-decision').innerHTML = [
    segment('deny', t.decisionBlocked, loaded.counts.blocked),
    segment('allow', t.decisionAllowed, loaded.counts.allowed),
    ...(loaded.counts.errors > 0 ? [segment('error', t.filterErrors, loaded.counts.errors)] : []),
    ...(suspects.size > 0 ? [segment('suspect', t.filterSuspect, suspects.size)] : []),
    segment('all', t.filterAll, loaded.totalInWindow),
  ].join('');
  const agentNames = Object.keys(loaded.counts.agents)
    .filter((name) => name !== 'unknown')
    .sort();
  qs<HTMLSelectElement>('activity-agent').innerHTML = [
    `<option value="all">${escapeHtml(t.allAgents)}</option>`,
    ...agentNames.map(
      (name) =>
        `<option value="${escapeHtml(name)}">${escapeHtml(agentLabels[name] ?? name)} (${formatCount(loaded.counts.agents[name] ?? 0)})</option>`,
    ),
  ].join('');
  qs<HTMLSelectElement>('activity-agent').value = filters.agent;
  qs('activity-agent').parentElement?.toggleAttribute('hidden', agentNames.length < 2);
  const retained = retentionDays();
  qs('activity-days').innerHTML = [
    ...new Set([...[7, 30, 90, 180, 365].filter((days) => days < retained), retained, loaded.days]),
  ]
    .sort((left, right) => left - right)
    .map((days) => `<option value="${days}">${escapeHtml(t.lastDaysOption(days))}</option>`)
    .join('');
  qs<HTMLSelectElement>('activity-days').value = String(loaded.days);
  qs('activity-command-filter').hidden = !filters.command;
  qs('activity-command-filter').innerHTML = filters.command
    ? `${escapeHtml(t.showingBlocksOf)} <code>${escapeHtml(filters.command)}</code> <button type="button" class="quiet" data-clear-command>${escapeHtml(t.showAllBlocks)}</button>`
    : '';
};

const emptyMessage = () => {
  if (filters.query || filters.command || filters.agent !== 'all')
    return escapeHtml(t.noFilterMatch);
  if (filters.decision === 'deny')
    return `${escapeHtml(t.nothingBlocked(activity?.days ?? filters.days))} <button type="button" class="quiet" data-activity-decision="all">${escapeHtml(t.showAllActivity)}</button>`;
  return escapeHtml(t.noLogEntries);
};

const renderFeed = () => {
  if (!activity) return;
  const entries = visibleEntries(activity.entries, filters, suspects);
  renderedEntries = entries;
  qs('activity-feed').innerHTML =
    entries.length === 0
      ? `<p class="empty">${emptyMessage()}</p>`
      : entries
          .map((entry, index) => {
            const label = formatDayHeading(entry.ts);
            const previous = entries[index - 1];
            const heading =
              previous && formatDayHeading(previous.ts) === label
                ? ''
                : `${index === 0 ? '' : '</ul>'}<h4 class="day-heading">${escapeHtml(label)}</h4><ul class="feed-list">`;
            return heading + feedRowHtml(entry, index);
          })
          .join('') + '</ul>';
  qs('activity-count').textContent = [
    t.showingEntries(entries.length, activity.totalInWindow, activity.days),
    activity.truncated ? t.activityTruncated : '',
    activity.unreadable > 0 ? t.unreadableLogs(activity.unreadable) : '',
  ]
    .filter(Boolean)
    .join(' ');
};

export const loadActivity = async () => {
  const result = await requestJson(`/api/activity?days=${filters.days}`);
  if (!result.ok || !result.data) {
    qs('activity-feed').innerHTML =
      `<p class="empty">${escapeHtml(t.couldNotLoadActivity(errorText(result)))}</p>`;
    qs('activity-count').textContent = '';
    return;
  }
  activity = result.data as ActivityFeed;
  suspects = findSuspectEntries(activity.entries);
  showPath('logs-path', activity.logsDir ?? '', activity.logsDir ? '' : t.notAvailable);
  if (filters.agent !== 'all' && !(filters.agent in activity.counts.agents)) filters.agent = 'all';
  if (filters.decision === 'error' && activity.counts.errors === 0) filters.decision = 'deny';
  if (filters.decision === 'suspect' && suspects.size === 0) filters.decision = 'deny';
  renderControls();
  renderFeed();
  syncHash();
};

export const limitActivityDays = (days: number) => {
  filters.days = Math.min(filters.days, days);
};

const rerender = () => {
  renderControls();
  renderFeed();
  syncHash();
};

export const showActivity = (params: URLSearchParams) => {
  const next = activityFiltersFromParams(params);
  if (shared.policy) next.days = Math.min(next.days, retentionDays());
  if (activityHash(next) === activityHash(filters)) return;
  const reload = next.days !== filters.days;
  Object.assign(filters, next);
  qs<HTMLInputElement>('activity-search').value = filters.query;
  if (reload && activity) {
    void loadActivity();
    return;
  }
  rerender();
};

const openReportDialog = (entry: FeedEntry) => {
  const scrub = (text: string) => scrubReportPaths(text, entry.cwd, activity?.homeDir);
  qs<HTMLTextAreaElement>('report-command').value = scrub(entry.command || entry.segment || '');
  qs<HTMLInputElement>('report-title').value = reportTitle(
    entry.ruleId,
    scrub(entry.segment || entry.command || ''),
  );
  qs<HTMLTextAreaElement>('report-why').value = '';
  qs<HTMLTextAreaElement>('report-entry').value = JSON.stringify(
    entry,
    (_key, value) => (typeof value === 'string' ? scrub(value) : value),
    2,
  );
  qs<HTMLDialogElement>('report-dialog').returnValue = 'cancel';
  qs<HTMLDialogElement>('report-dialog').showModal();
};

const openFalsePositiveForm = async () => {
  const fields: Record<string, string> = {
    title: qs<HTMLInputElement>('report-title').value,
    expected: qs<HTMLTextAreaElement>('report-why').value.trim(),
    command: qs<HTMLTextAreaElement>('report-command').value,
    entry: qs<HTMLTextAreaElement>('report-entry').value,
  };
  const request = buildReportRequest(fields);
  const copying = request.dropped.length
    ? navigator.clipboard
        .writeText(request.dropped.map((field) => `### ${field}\n${fields[field]}`).join('\n\n'))
        .then(
          () => true,
          () => false,
        )
    : null;
  window.open(request.url, '_blank', 'noopener');
  if (!copying) return;
  const names = request.dropped
    .map((field) => reportFieldNames[field] ?? field)
    .join(t.reportFieldJoiner);
  notify(
    t.reportTooLong,
    'error',
    (await copying)
      ? t.reportFieldCopied(names, request.dropped.length)
      : t.reportFieldLeftOut(names, request.dropped.length),
  );
};

export const initActivity = () => {
  on('policy', () => {
    if (activity) rerender();
  });
  qs('activity-search').addEventListener('input', (event) => {
    filters.query = (event.target as HTMLInputElement).value;
    if (filters.command) {
      filters.command = '';
      renderControls();
    }
    clearTimeout(queryTimer);
    queryTimer = setTimeout(() => {
      renderFeed();
      syncHash();
    }, 120);
  });
  qs('activity-agent').addEventListener('change', (event) => {
    filters.agent = (event.target as HTMLSelectElement).value;
    renderFeed();
    syncHash();
  });
  qs('activity-days').addEventListener('change', (event) => {
    filters.days = Number((event.target as HTMLSelectElement).value);
    void loadActivity();
  });
  qs('activity-refresh').addEventListener('click', (event) => {
    void runRefresh(event.currentTarget as HTMLButtonElement, () =>
      Promise.all([loadOverview(), loadActivity()]),
    );
  });
  qs<HTMLDialogElement>('report-dialog').addEventListener('close', () => {
    if (qs<HTMLDialogElement>('report-dialog').returnValue === 'report')
      void openFalsePositiveForm();
  });
  qs('activity-command-filter').addEventListener('click', (event) => {
    if (!(event.target as Element).closest('[data-clear-command]')) return;
    filters.command = '';
    rerender();
  });
  qs('activity-decision').addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLElement>('[data-activity-decision]');
    if (!button) return;
    filters.decision = button.dataset.activityDecision as Decision;
    filters.command = '';
    rerender();
  });
  qs('activity-feed').addEventListener('click', (event) => {
    const target = event.target as Element;
    const showAll = target.closest<HTMLElement>('[data-activity-decision]');
    if (showAll) {
      filters.decision = showAll.dataset.activityDecision as Decision;
      rerender();
      return;
    }
    const summary = target.closest<HTMLElement>('.feed-summary');
    if (summary) {
      const expanded = summary.getAttribute('aria-expanded') !== 'true';
      summary.setAttribute('aria-expanded', String(expanded));
      const detail = qs(summary.getAttribute('aria-controls') ?? '');
      const summaryCommand = summary.querySelector('.feed-command') as HTMLElement;
      (detail.querySelector('.detail-command') as HTMLElement).hidden =
        !summaryCommand.textContent?.includes('\n') &&
        summaryCommand.scrollWidth <= summaryCommand.clientWidth;
      detail.hidden = !expanded;
      return;
    }
    const copy = target.closest<HTMLElement>('[data-log-copy]');
    const copyEntry = renderedEntries[Number(copy?.dataset.logCopy)];
    if (copy && copyEntry) {
      void copyText(copy, JSON.stringify(copyEntry, null, 2));
      return;
    }
    const report =
      renderedEntries[Number(target.closest<HTMLElement>('[data-report-fp]')?.dataset.reportFp)];
    if (report) {
      openReportDialog(report);
      return;
    }
    const block =
      renderedEntries[
        Number(target.closest<HTMLElement>('[data-block-future]')?.dataset.blockFuture)
      ];
    if (block) location.hash = `rules?compose=${encodeURIComponent(entryCommand(block))}`;
  });
};
