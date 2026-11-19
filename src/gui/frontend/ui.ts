import { integrationDisplayNames } from '@/hosts/catalog';
import { guiData } from './gui-data';
import { t } from './i18n';
import type { PreferenceUpdate } from './preferences';
import type { PolicyState } from './types';

export const agentLabels: Record<string, string> = integrationDisplayNames;

export const shared = {
  policy: undefined as PolicyState | undefined,
  dirty: false,
  drafting: false,
};
export const emit = (name: 'policy' | 'dirty' | 'integrations') =>
  document.dispatchEvent(new Event(`ccsn:${name}`));
export const on = (name: 'policy' | 'dirty' | 'integrations', listener: () => void) =>
  document.addEventListener(`ccsn:${name}`, listener);

export const qs = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T;

type ApiRequestInit = Omit<RequestInit, 'headers'> & { headers?: Record<string, string> };
export const requestJson = async (path: string, init: ApiRequestInit = {}) => {
  const token = guiData.token;
  try {
    const response = await fetch(
      `${path}${path.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`,
      {
        ...init,
        headers: {
          'content-type': 'application/json',
          'x-cc-safety-net-token': token,
          ...init.headers,
        },
      },
    );
    const text = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      data: text ? JSON.parse(text) : {},
      error: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: undefined,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
export type RequestResult = Awaited<ReturnType<typeof requestJson>>;
export const errorText = (result: RequestResult) =>
  result.error ??
  (Array.isArray(result.data?.errors) && result.data.errors.length
    ? result.data.errors.join('\n')
    : null) ??
  result.data?.error ??
  t.requestFailed(result.status);
export const isWriteSuccess = (result: RequestResult) =>
  result.ok && !(Array.isArray(result.data?.errors) && result.data.errors.length > 0);

export const escapeHtml = (value: unknown) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char] ?? char,
  );
let notifyTimer: number | undefined;
export const notify = (title: string, kind: 'info' | 'ok' | 'error' = 'info', detail = '') => {
  clearTimeout(notifyTimer);
  qs('toast').hidden = title === '';
  qs('toast').className = `toast ${kind}`;
  qs('toast-title').textContent = title;
  qs('toast-detail').textContent = detail;
  qs('toast-detail').hidden = detail === '';
  if (kind === 'ok') notifyTimer = setTimeout(() => notify(''), 4000);
};

export const savePreference = async (update: PreferenceUpdate) => {
  const result = await requestJson('/api/preferences', {
    method: 'POST',
    body: JSON.stringify(update),
  });
  const saved = isWriteSuccess(result);
  if (!saved) notify(t.preferenceSaveFailed, 'error', errorText(result));
  return saved;
};

export const icons = {
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2"></path></svg>',
  check:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>',
  remove:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"></path></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8h.01"></path></svg>',
  message:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 5h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-7l-4 3.5V17H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"></path><path d="M8 9.5h8M8 13h5"></path></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>',
};

const showingCopied = new WeakSet<HTMLElement>();
export const copyText = async (button: HTMLElement, text: string) => {
  const copied = await navigator.clipboard.writeText(text).then(
    () => true,
    () => false,
  );
  if (!copied) {
    notify(t.copyFailed, 'error');
    return;
  }
  if (showingCopied.has(button)) return;
  showingCopied.add(button);
  const label = button.innerHTML;
  button.innerHTML = `${icons.check}<span>${escapeHtml(t.copied)}</span>`;
  setTimeout(() => {
    button.innerHTML = label;
    showingCopied.delete(button);
  }, 1500);
};

export const showPath = (id: string, path: string, suffix = '') => {
  const element = qs(id);
  element.dataset.path = path;
  element.innerHTML =
    path
      .split(/(?<=[\\/])/)
      .map((part) => `<span class="path-part">${escapeHtml(part)}</span>`)
      .join('') + escapeHtml(suffix);
  document.querySelector(`[data-copy-path="${id}"]`)?.toggleAttribute('hidden', path === '');
};

export const runRefresh = async (button: HTMLButtonElement, reload: () => Promise<unknown>) => {
  if (button.disabled) return;
  button.disabled = true;
  await reload();
  button.disabled = false;
};

type ConfirmOptions = {
  title: string;
  body: string;
  detail?: string;
  confirmLabel: string;
  confirmClass?: string;
  rowsHtml?: string;
};
let resolvePendingConfirm: ((confirmed: boolean) => void) | null = null;
export const initConfirmDialog = () => {
  const dialog = qs<HTMLDialogElement>('confirm-dialog');
  dialog.addEventListener('close', () => {
    if (!resolvePendingConfirm) return;
    resolvePendingConfirm(dialog.returnValue === 'confirm');
    resolvePendingConfirm = null;
  });
  dialog.addEventListener('cancel', () => {
    dialog.returnValue = 'cancel';
  });
};
export const confirmDialog = (options: ConfirmOptions) =>
  new Promise<boolean>((resolve) => {
    if (resolvePendingConfirm) {
      resolve(false);
      return;
    }
    const dialog = qs<HTMLDialogElement>('confirm-dialog');
    const confirm = qs<HTMLButtonElement>('confirm-dialog-confirm');
    qs('confirm-dialog-title').textContent = options.title;
    qs('confirm-dialog-body').textContent = options.body;
    qs('confirm-dialog-detail').textContent = options.detail ?? '';
    (qs('confirm-dialog-detail').parentElement as HTMLElement).hidden = !options.detail;
    qs('confirm-dialog-rows').innerHTML = options.rowsHtml ?? '';
    qs('confirm-dialog-rows').hidden = !options.rowsHtml;
    confirm.textContent = options.confirmLabel;
    confirm.className = options.confirmClass ?? 'danger';
    dialog.returnValue = 'cancel';
    resolvePendingConfirm = resolve;
    dialog.showModal();
    qs('confirm-dialog-cancel').focus();
  });
