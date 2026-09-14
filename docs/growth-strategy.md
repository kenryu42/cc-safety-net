# Growth strategy

Research date: 2026-09-14. Baseline version: v2.4.1.
A formatted version of this report, with the charts, is at [`growth-strategy.html`](./growth-strategy.html).

This report answers one question: why did growth stall after January 2026, and what should a
solo maintainer with roughly ten hours a week do about it.

Every claim below carries its source. Figures come from the GitHub API, the npm registry, the
repository, and the public web on 2026-09-14. Where a number could not be verified from this
machine it is marked unverified.

---

## 1. Executive summary

**The diagnosis.** The product is not the problem. Between 2026-08-10 and 2026-09-14 the project
shipped 23 releases, the highest velocity in its life, and gained 86 stars. Release days move the
star count by 0 to 6. Growth stalled because the project stopped explaining why it exists, is
absent or stale in every registry the host CLIs point users to, and does not appear in search for
any of the problems it solves. Sixty percent of all stars arrived in the first six weeks, on a wave
driven by one French blog post and a Show HN posted on New Year's Day, neither of which was ever
followed up.

**Three highest-value moves, in order.**

1. **Put the argument back above the fold.** A sourced "Why this exists" section was written on
   2026-08-31 and deleted on 2026-09-01. It contained the two claims no competitor can make. Every
   other channel in this plan links back to that paragraph, so it goes first.
2. **Run the registry sweep.** Anthropic's community marketplace, the store behind Claude Code's
   own `/plugin` discovery, ships a build pinned to June 2026: version 1.0.6, two majors old,
   under the former repository name. Copilot CLI pre-registers two marketplaces and the project is
   in neither. Three awesome-lists totalling roughly 66,000 stars still carry the old name. Most of
   these are ten-minute fixes whose reach is a host's entire user base.
3. **Occupy the search intent nobody owns.** For six problem-shaped queries such as "claude code
   deleted my files", the results are GitHub issues from people it happened to. No product appears.
   Incident-explainer pages and per-host landing pages put one there.

**The thing that makes all three measurable.** There is no telemetry by design, no analytics on the
docs site, and no snapshot of GitHub traffic, which expires every 14 days. A daily metrics
snapshot is a one-hour job and it gates the credibility of everything after it.

**The thing that will decide the next twelve months.** Claude Code's auto mode now blocks the
headline commands by default. The pitch "blocks `rm -rf`" is being commoditized. The defensible
pitch is one deterministic policy, shared through git, enforced identically across thirteen agent
CLIs, on Windows too. Say that before a host release forces the conversation.

---

## 2. Where the project stands

| Signal | Value | Source |
|---|---:|---|
| GitHub stars | 1,539 | GitHub API, 2026-09-14 |
| Forks / watchers | 76 / 10 | GitHub API |
| Star run-rate, trailing 12 weeks | ~13 per week | 1,539 stargazer timestamps, weekly buckets |
| npm downloads | 4,192 weekly · 25,909 monthly | `registry.npmjs.org/-/v1/search`, 2026-09-14 |
| npm dependents / GitHub "Used by" | 1 / 0 | npm registry; repository dependents page |
| Releases | 47 total, 23 since 2026-08-10 | GitHub releases API |
| Issues | 36 total, 0 open | GitHub issues API |
| External pull requests merged | 2 of ~21, from 1 of 13 authors | GitHub pull requests API |
| Supported host CLIs | 13 | `README.md` |
| First-party registries listing it | 1 of 8 checked, and that one is stale | Marketplace manifests, 2026-09-14 |
| OS package managers | none: no Homebrew, winget, nix, scoop, Docker or Action | Registry searches |
| Docs languages | English, 简体中文, 日本語 | `ccsafetynet.com` sitemap, 120 URLs |

### Star history against shipping activity

| Month | New stars | Cumulative | Releases | Issues opened |
|---|---:|---:|---:|---:|
| 2025-12 | 329 | 329 | 2 | 3 |
| 2026-01 | 595 | 924 | 11 | 9 |
| 2026-02 | 146 | 1,070 | 0 | 0 |
| 2026-03 | 124 | 1,194 | 3 | 3 |
| 2026-04 | 77 | 1,271 | 0 | 2 |
| 2026-05 | 75 | 1,346 | 1 | 3 |
| 2026-06 | 58 | 1,404 | 7 | 4 |
| 2026-07 | 49 | 1,453 | 0 | 1 |
| 2026-08 | 61 | 1,514 | 17 | 7 |
| 2026-09 (to 14th) | 25 | 1,539 | 6 | 4 |

The ten best days in the project's history all fall between 2025-12-26 and 2026-01-08. The peak is
2026-01-06 at 110 stars. Nothing since has come close: the best organic seven-day window after
February was 35 stars in March 2026, with no release in that window. Effort and attention have been
decoupled since February.

### What actually caused the launch wave

Two of the five peak days now have an identified cause, and they are both instructive.

| Day | Stars | Cause |
|---|---:|---|
| 2025-12-27 | 68 | A feature on Korben.info, a high-traffic French tech blog, published 2025-12-26 |
| 2025-12-30 | 104 | **Unidentified** |
| 2026-01-01 | 68 | A Show HN, posted on New Year's Day |
| 2026-01-06 | 110 | **Unidentified** |
| 2026-01-07 | 73 | Tail of the 01-06 event |

Three things follow. First, the single largest identified driver was one blog post by one writer,
who has never been contacted since; that is a warm contact, not a cold pitch. Second, the project's
one Hacker News attempt was posted on New Year's Day, the lowest-traffic day of the year, and
returned 68 stars, so the channel has effectively never been tested. Third, the two biggest days
remain unexplained; the two-day decay shape of 110 then 73 looks like a newsletter or aggregator
placement, and GitHub Trending was ruled out against a dated archive. The maintainer can probably
settle this in one minute from GitHub's traffic referrers for that week, if any record survives.

The detail that matters most: the README of that era carried an origin story, that Claude Code had
silently wiped out hours of work and that soft rules cannot replace hard technical constraints.
That is the framing Korben quoted. It is not in the README today.

---

## 3. The nine findings that matter most

**1. The strongest version of the pitch was written and then deleted.**
Commit `6e0d788` (2026-08-31) added a "Why this exists" section arguing that no major coding CLI
deterministically blocks destructive git commands inside the workspace you handed it, quoting
Codex's own security documentation, an independent Codex analysis, and CVE-2026-25725. Commit
`0521197` (2026-09-01), titled "chore: simplify readme", removed that section, the "Why not just
use a sandbox?" comparison, and the capability table. An independent evaluator had specifically
praised those tables as "unusually candid". The README now contains no reason to care.

**2. The README sells the wrong thing above the fold.**
The order today is logo, four engineering badges, a screenshot of the policy dashboard, then a
27-line table of 13 CLI logos. The install command sits roughly 40% of the way down. There is no
demo, no GIF, no asciinema, no social proof, and no comparison. The product's own block message,
which is the most persuasive artifact it has, appears nowhere.

**3. The category's ground has moved under the old pitch.**
Claude Code's auto mode is now the default on Pro, Max and Team plans, and its classifier blocks
`git reset --hard`, `git checkout -- .`, `git clean -fd`, `git stash drop`, force pushes, and `rm`
on critical paths by default. The changelog shows a steady march: `sandbox.credentials` blocking
credential reads, `**/.env` deny rules that renaming cannot bypass, and dangerous-`rm` prompts that
now see inside `sh -c`. Anthropic's own documentation supplies the counter-argument as well: Bash
deny rules are string matches that miss `/bin/rm` and `bash -c` and are "not a security boundary",
the sandbox has "no built-in credential deny list", and "native Windows is not supported".

**4. The project is invisible for its own problem.**
Six problem-intent queries were run on 2026-09-14: "claude code deleted my files", "claude code git
reset --hard lost work", "claude code rm -rf blocked hook", "claude code hooks block dangerous
commands PreToolUse", "claude code protect .env", and "prevent ai coding agent from deleting
files". cc-safety-net appeared in zero results across roughly 45 URLs. The results are incident
issues in `anthropics/claude-code`, Anthropic's own hooks docs, and blog tutorials teaching a
ten-line regex hook. A six-star competitor ranks second for the git-reset query with a recovery
gist that funnels to its own product.

**5. The registry situation is worse than absence: one listing actively ships an obsolete build.**
Anthropic's community marketplace, the store behind Claude Code's own `/plugin` discovery, lists
the plugin as `safety-net` pointing at `kenryu42/claude-code-safety-net.git` pinned to SHA
`9fa3c5bd` from 2026-06-30. That commit is **v1.0.6**, two major versions old: it predates
rulebooks, the policy GUI, and six of the thirteen supported CLIs, and its `src/hosts/` directory
does not exist. Every install from Claude Code's built-in discovery surface today is a bad first
impression attributed to this project.

Around it, the pattern repeats. Anthropic's curated directory has 296 plugins and 18 tagged
security, every one a vendor scanner and not one a pre-execution guard, so the category slot is
empty. Copilot CLI pre-registers two marketplaces by default and the project is in neither. xAI's
Grok Build marketplace has 27 plugins and no security entry at all. OpenCode's ecosystem page
invites pull requests and lists no command guard. Hermes Agent's catalog carries an official-tier
vendor entry and no guard. The Gemini extension repository carries its manifest but not the
`gemini-cli-extension` topic the gallery crawls. Three awesome-lists totalling roughly 66,000 stars
still carry the old name, the old URL, and a seven-CLI description that omits secret protection
entirely; one of them, read only by OpenCode users, calls it "A Claude Code plugin". And the
project's own `.claude-plugin/marketplace.json`, which Claude Code, Copilot CLI and Antigravity all
read, is named `cc-safety-net-dev` and describes itself as a "Development marketplace".

**6. False positives are the churn driver, and the relief users ask for was declined.**
Eleven of 36 issues report a safe command being blocked, and users describe the effect as breaking
autonomy, not as a nuisance: "defeats the purpose of autonomous agents", "the agent gives up".
Pull request #45 implemented an ask-instead-of-deny mode with manual test evidence, sat for 82
days, and was closed with no maintainer comment. Claude Code has since changed its semantics so a
hook `ask` decision floors at a prompt, which removes the original technical objection.

**7. The contributor funnel is closed, and one closure became a competitor.**
Two of roughly 21 external pull requests merged, both from the same author. Several were closed
with no human message. Two contributors were told "you're banned" inside the pull request thread
with no stated reason; one of them now ships a competing tool and writes critical content that
ranks in search. Meanwhile issue handling is genuinely excellent: 36 of 36 closed, with false
positives fixed and released inside one or two days.

**8. The project publishes nothing, anywhere.**
There is no Reddit footprint under either name. There is exactly one human-written third-party
article about the project in nine months, the Korben feature that caused its best early day. There
is no Japanese or Chinese post despite shipping documentation in both languages, while the Japanese
ecosystem publishes steadily on this exact problem and hand-rolls a Python script every time.
Everything else that mentions the project anywhere is a scraped directory listing. Meanwhile a
rival reached 2,000 stars in five weeks using one Chinese developer forum and nothing else.

**9. The project has rare credibility material and publishes none of it.**
The repository holds a 15-family residual-risk registry with a dated adjudication process, a
SECURITY.md that draws an explicit "a bypass is a public bug, not a vulnerability" line that
gitleaks, semgrep and trivy do not draw, and a hand-edited 6,964-row verdict corpus. None of it
appears on the docs site. Competitors publish unrefereed comparison tables about cc-safety-net with
incorrect claims, and no shared corpus exists for anyone to check them against.

---

## 4. Who this is for

Five personas already use the project in public. The README speaks to the first one only.

| Persona | Evidence they exist | What they need that is missing |
|---|---|---|
| Solo developer running an agent | Personal dotfiles repositories, fish and nix configurations | A reason to care in the first ten lines, and proof it fired |
| Team lead standardizing a repo | `.cc-safety-net/` committed in a handful of repositories | A copy-pasteable committed hook block, not per-machine install |
| Platform team rolling out agents | A Copilot CLI contributor asked to recommend it for an organizational rollout | A rollout guide, a managed-settings path, a license statement |
| Starter-kit and distro author | A 151-star Japanese starter kit installs it by default; a 160-star guide recommends it | Current copy to quote; today they quote a stale "pattern matching" description |
| Agent builder embedding the library | Two public consumers, one calling `checkCommand`, one shelling out to `explain --json` | A visible list of embedders and an invitation to join it |

The words users reach for are worth copying verbatim: *safety net*, *guardrail*, *footgun guard*,
*hard guardrails*, *fail-closed*, *catches it before it executes*. For the pain: *destroyed*,
*lost hours*, *silently*, *without asking*, *irreversible*, *terrified*.

---

## 5. The competitive picture

| Category | Who | Traction | What they do not do |
|---|---|---:|---|
| Platform-native | Claude Code auto mode, deny rules, sandbox | Default for Pro/Max/Team | Deterministic guarantee; wrapped commands in deny rules; native Windows; default credential denylist |
| Platform-native | Codex sandbox and execpolicy | All Codex users | Preview status; exact first-token prefixes; no documented wrapper handling |
| Platform-native | Gemini CLI policy engine | All Gemini users | Regex, not semantic; no destructive-git defaults |
| Open source | failproofai | 3,275 stars | Semantic shell parsing |
| Open source | Cupcake (EQTY Lab) | 292 stars | Blocking defaults; Windows; Nix-only install |
| Open source | agentjail | 93 stars | `git reset --hard` by default; only three hosts |
| Isolation | vibekit, sandbox-runtime, OpenSandbox | 1.8k / 5.2k / 7k+ | In-workspace destructive git |
| Recovery | revertly, checkpoint hooks, Claude Code `/rewind` | Small, but the argument travels | Prevention of the irreversible |
| Commercial | Snyk Evo Agent Guard, Backslash, Noma, Railguard | Vendor-backed | Open source, local-only, 13 hosts |

At 1,539 stars cc-safety-net is the largest single-purpose guard in open source, roughly five times
the next one. It is not a challenger in its category; it is the leader with a distribution problem.

**The three differentiators worth defending.** Deterministic semantic parsing that Anthropic's own
documentation admits its deny rules lack. Breadth: thirteen hosts including native Windows and
PowerShell, where the built-in sandbox is not supported. An auditable posture, with a published
residual-risk registry that no rival offers.

**The three substitution risks.** Auto mode already blocks the headline commands, so "why add a
hook" becomes the default question. failproofai bundles blocking with observability and a free
cloud tier, winning the one-install buyer. Isolation products own the phrase "safety layer" and the
star counts, and recovery tools attack the premise of blocking altogether.

**A cautionary data point.** A multi-host hook guard created on 2026-08-11 reached roughly 1,980
stars in five weeks with a memorable name, a story-first README written in the second person,
Chinese-first documentation, and eighteen public reproducible test cases. In that same window
cc-safety-net gained 86 stars while shipping 23 releases. Narrative beat breadth.

---

## 6. The plan

Seven pillars. Each bet names what to do, why, the first step, and how it is measured.
Effort and impact are the author's estimates; `now` means this week or next.

### Pillar 1 — Put the argument back

*Nothing else works until a visitor understands the problem in ten seconds.*

| Bet | Effort | Impact | When |
|---|---|---|---|
| Restore the deleted "Why this exists", trimmed to ~120 words | low | high | now |
| Replace the dashboard screenshot with a terminal block demo | low | high | now |
| Adopt one tagline and use it verbatim on all six surfaces | low | high | now |
| Publish "What your CLI already does, and what this adds" | low | high | now |
| Move Quick start above the 13-logo grid | low | medium | now |
| Surface the social proof that already exists | low | medium | now |

**Restore the "Why".** `git show 6e0d788 -- README.md` recovers it. Keep the opening paragraph and
three bullets, anchored on the two claims rivals cannot make: no major CLI deterministically blocks
in-workspace git destruction, and the sandbox has no built-in credential deny list. *Measure:* the
README diff exists and is linked from every subsequent post.

**Swap the hero.** Record a ten-second GIF of an agent running `git reset --hard` and the
`BLOCKED by CC Safety Net` message with its reason line. One caveat found during research: the
headline shape `rm -rf "$HOME"` currently reports the policy-protection rule rather than the
home-deletion rule, which reads wrong on camera. Use `git reset --hard` for the demo, or fix the
rule precedence first. *Measure:* time on the README page once analytics exist.

**One tagline.** Today the GitHub About, npm description, and three plugin manifests each say
something different and none names the reader's situation. Pick one sentence, then change
`package.json`, the three manifests, and the repository description in a single commit.

**The comparison page.** One table, one row per host, quoting the host's own documentation for what
it already blocks, then the delta: one policy, shared through git, identical across thirteen hosts,
deterministic, on Windows. This is the page every listing and post should link to. Write it before
the next host release makes it reactive.

### Pillar 2 — Fix the distribution plumbing

*The highest reach per hour of maintainer time in this entire plan.*

| Bet | Effort | Impact | When |
|---|---|---|---|
| Resubmit to the Anthropic plugin directory to unpin the v1.0.6 build | low | high | now |
| Rename the repository's own marketplace manifest and advertise it | low | medium | now |
| Correct the three stale awesome-list entries (~66,000 stars) | low | medium | now |
| Add the `gemini-cli-extension` topic to the Gemini extension repository | low | medium | now |
| Pull request OpenCode's ecosystem page | low | medium | now |
| Propose a curated Kimi Code marketplace entry | low | high | now |
| Fix the npm surface: funding field, host keywords, download badge | low | medium | now |
| Get into `github/awesome-copilot`, pre-registered in Copilot CLI | medium | high | 30d |
| Claim the empty security slot in xAI's Grok Build marketplace | medium | medium | 30d |
| Apply to Anthropic's curated directory, where the slot is empty | medium | high | 30d |
| Submit a Hermes Agent plugin-catalog entry | medium | medium | 30d |
| Publish to ClawHub as an OpenClaw package | medium | medium | 30d |
| List in the large cross-agent skills lists | low | medium | 30d |
| Ship copy-paste recipes for CI and cloud agent runners | medium | medium | 30d |

**Fix the Anthropic listing first.** It is the only place where a broken entry is actively
distributing an obsolete build to real users, and it sits on the highest-intent discovery surface
the project touches. Submission is a form at `clau.de/plugin-directory-submission`; direct pull
requests to the mirror repository are closed automatically. Keep the published slug: Anthropic's own
guidance is that a published plugin name must not change, and the maintainer's separate marketplace
repository already encodes the `safety-net` to `cc-safety-net` rename. Run `claude plugin validate`
first, which the submission expects. In the same pass, apply to the curated directory: 18 of its
296 plugins are tagged security and every one is a vendor scanner, so a pre-execution guard is an
uncontested slot rather than a crowded one.

**The self-owned surface needs no one's approval.** Claude Code, Copilot CLI and Antigravity all
read `.claude-plugin/marketplace.json`, and this repository's copy is named `cc-safety-net-dev` and
calls itself a development marketplace. Rename it, fold in the rename mapping, and add one README
line documenting `/plugin marketplace add`. The README today mentions no marketplace path at all.

**Copilot CLI is the biggest missed default.** It pre-registers two marketplaces, and the project
is absent from both, despite Copilot CLI support having been contributed by a user who wanted to
recommend it for an organizational rollout. The larger of the two has roughly 39,000 stars and a
documented review workflow; direct pull requests adding an external plugin are rejected, so use the
workflow.

**Two thin catalogs are worth claiming early.** xAI's Grok Build marketplace has 27 plugins, all
commercial vendor integrations, and no guardrail of any kind; it takes an ordinary pull request
with a pinned SHA. Kimi Code has six entries, no guard, a Chinese-first audience, a README that
advertises hooks which "gate risky tool calls", and a plugin manifest that already ships here.
Being the only safety plugin in a first-party catalog is durable positioning, not just a backlink.

**Two caveats.** A pinned-SHA listing goes stale exactly the way the Anthropic one did, so automate
the bump in the release workflow or it becomes the same bug in a new place. And the largest Codex
plugin list gates entry on running a third-party scanner action in CI; the organization behind it
is also the one whose unsolicited "dofollow backlink" listing pitch was correctly marked spam on
this repository. Weigh that against the project's own supply-chain posture before adding the
action, and pin it by SHA if it goes in at all.

### Pillar 3 — Occupy the problem in search

*The queries are unoccupied. The people typing them have the problem right now.*

| Bet | Effort | Impact | When |
|---|---|---|---|
| Incident-explainer pages, one per recurring failure | low | high | now |
| Comparison pages using the product names people search | low | medium | now |
| Split the 3,400-word install page into 13 per-host pages | medium | high | 30d |
| An FAQ page whose headings are literal questions | low | medium | 30d |
| Align README, About text, topics and npm keywords with searched phrases | low | medium | now |
| Resolve the duplicate documentation host and verify in Search Console | low | medium | now |
| Turn the release stream into indexable content | low | low | 60d |

Every docs page title today is product-shaped: "What CC Safety Net does", "Install CC Safety Net
for your coding agent". None can match a head query. The first incident page should be "Claude Code
ran `git reset --hard`: recover your work and block it next time", because that query already
ranks a competitor's recovery gist at position two.

Per-host pages matter twice: they rank for "codex hook block rm -rf" style queries, and they give
each of the thirteen README logos a real destination instead of an anchor into a wall of text.

One piece of hygiene: a preview host at `ccsafetynet.mintlify.app` is indexed separately from the
canonical domain. Confirm it redirects or canonicalizes.

### Pillar 4 — Publish what nobody else can

*The project has a zero organic content footprint: no Reddit hits under either name, one
human-written third-party article in nine months, and no Japanese or Chinese post despite shipping
docs in both. Everything else that mentions it is a scraped directory listing.*

| Bet | Effort | Impact | When |
|---|---|---|---|
| Refresh the bypass research so it matches shipped behaviour | low | high | now |
| Re-launch on Hacker News, on a weekday, led by the bypass disclosure | low | high | 30d |
| Publish an incident ledger with an honest "would it have blocked this" column | medium | high | 30d |
| Enable a standing public bypass challenge with named credit | low | medium | 30d |
| Reddit debut with experience reports, never with the tool | medium | high | 30d |
| Follow up with the one writer who already covered it | low | medium | now |
| Japanese article aimed at the do-it-yourself hook recipes | medium | medium | 60d |
| Chinese post on the forum a rival used to reach 2,000 stars | medium | high | 60d |
| Cross-host research: do hooks actually fire? | high | high | 60d |

**Correct the research before publishing it.** `docs/secret-protection-bypass-findings.md` says a
base64-encoded filename bypass "currently works". Run against the shipped CLI it does not: that
shape is now blocked, while character-code reconstruction still passes at standard and strict.
Publishing a stale bypass claim would do more damage than publishing nothing. Re-run every case,
stamp the document with the version it was verified against, then it becomes the best asset here.

**Then re-launch on Hacker News.** Since the New Year's Day post the project renamed, went from
v0.1.0 to v2.4.1, gained a semantic analyzer, twelve more hosts, rulebooks and a GUI. That is a new
Show HN, not a repost. Lead with the bypass disclosure and the residual-risk registry rather than
the feature list, and say plainly what the tool does not stop. Four other Show HN posts in this
exact niche reached the front page between January and June 2026, so the category is not the
problem; New Year's Day was.

**The incident ledger is the evergreen asset.** One page listing every public agent data-loss
incident with its date, host, exact command, what was lost, a source link, and the verdict this
tool gives. The supply refreshes itself: six issues were added to the Claude Code `data-loss` label
in the four days to 2026-09-14. The column that makes it citable rather than promotional is the
honest one. Some incidents it would not have caught, including a September case where the deletion
happened inside a Kotlin library call rather than a shell command, and those rows should link to
the residual-risk registry.

**One research post is worth more than the rest combined.** A Codex issue filed on 2026-09-13
reports that the PreToolUse hook is silently skipped when the session working directory no longer
exists, and the tool call proceeds. That is the mechanism this entire product depends on, failing
open. Check whether cc-safety-net has an equivalent exposure on any of its thirteen hosts before
writing a word: it may be a defect to fix rather than a story to tell. If the matrix holds up, a
cross-host "do hooks actually fire?" benchmark is a genuine contribution nobody else has published.

**Non-English channels are proven and unserved.** The Japanese ecosystem has published multiple
substantial articles on blocking destructive commands with hooks, and every one hand-rolls a Python
script; the honest post is where a regex recipe fails, on `bash -c`, on flag reordering, on
interpreter one-liners. The Chinese channel has a live proof: the rival that reached 2,000 stars in
five weeks did it with a Chinese story-first README and a single developer forum as its only named
channel, with no Hacker News, Reddit or X presence at all.

### Pillar 5 — Make the first five minutes prove it

*A guard that works is invisible. `doctor` says so in as many words: "No blocked commands in the
last 7 days. Tip: This is normal for new installations."*

| Bet | Effort | Impact | When |
|---|---|---|---|
| End install with a self-test, one `explain`, and the host activation step | low | high | now |
| Add a "Verify it works" block and a real GIF to Quick start | low | high | now |
| Add a docs pointer and an `explain` hint to the block message | low | medium | now |
| Ship an opt-in ask decision where the host protocol supports it | medium | high | 30d |
| Publish a false-positive ledger with fix versions | low | medium | 30d |
| Publish a truthful Windows support matrix | medium | medium | 30d |
| Add the upgrade line to every release note | low | medium | now |
| Browser playground for `explain` | high | high | 60d |

**Install must end in proof.** Today a Claude Code install prints "Installed Claude Code
integration" and stops, without mentioning that a plugin installed from the shell does not load
until restart or `/reload-plugins`. Running the existing three-case self-test and one `explain`
turns the last line of install into the first evidence the thing works.

**Ask mode is the highest-value product change in this plan.** It is the most repeated unmet
request, it is the direct relief for the top churn driver, and Claude Code's own change floors a
hook `ask` at a prompt, which removes the objection. Scope it: opt-in, Claude Code and Copilot CLI
only, never in strict or paranoid. Reopen it through the project's own issue-first process and
credit the original pull request.

**The playground is the one high-effort item worth it.** The package has zero runtime dependencies
and the analyzer touches Node only through `node:path`, with filesystem access confined to three
modules. A "paste a command, see the trace" widget with shareable permalinks turns every "why was
this blocked?" argument into a link.

### Pillar 6 — Build the loops

*Every block, every committed config, every rulebook should recruit the next user.*

| Bet | Effort | Impact | When |
|---|---|---|---|
| Stamp the block message with a rule URL | low | medium | now |
| Add a version and docs URL footer to `explain` output | low | low | now |
| Publish the canonical committed-hook block for teams | low | high | now |
| Community rulebook index in the org repository | low | medium | 30d |
| `policy apply --with-hook` writes the committed hook | medium | high | 30d |
| Adopters file and an ecosystem page | low | medium | 30d |
| Credit reporters and researchers in release notes | low | high | now |
| Publish a "what happens to your pull request" contract | low | high | now |
| Enable Discussions with three categories | low | medium | now |
| Seed 8–10 genuine starter tasks on the unused labels | low | medium | now |

The block message is the most-seen surface the project owns and it carries no link. One appended
line makes every block in a shared session, a pull request transcript, a CI log or a screenshot a
clickable path back.

Committed configuration is the team loop, and it is barely used: zero public repositories carry
`.cc-safety-net/policy.json`, and exactly one commits the hook, behind a hand-written guard. The
guides tell each member to install per machine. Publishing a canonical committed-hook block costs
nothing; making `policy apply` write it makes a repository carry its own protection.

On the community side, three changes are cheap and matter more than their size suggests. Credit
reporters by handle in release notes, which the generator currently forbids. Write down what
happens to an external pull request, including a guaranteed human reply and co-author credit on
re-implementation. Retro-thank the pull requests closed in silence, including the two authors told
"you're banned" — one of whom now competes. Keep the strict quality bar; it is an asset. Change the
social layer around it, not the standard.

### Pillar 7 — Instrument, then experiment

*Nothing in this plan can be judged today.*

| Bet | Effort | Impact | When |
|---|---|---|---|
| Daily metrics snapshot Action in a separate repository | low | high | now |
| Turn on privacy-friendly docs analytics | low | high | now |
| Write down the north star and guardrails with baselines | low | high | now |
| Two-week pre-registered experiment log | low | high | now |
| Weekly generated dashboard | low | medium | 30d |
| Release-aware download view | medium | high | 30d |

GitHub traffic data covers only the last 14 days and is visible only with push access, so it is
being discarded every fortnight. A scheduled Action that appends one JSON line a day captures
stars, forks, npm point and range downloads, per-version share, traffic, referrers and popular
paths. It is the only way to tell whether a listing or a post did anything.

**North star: trailing four-week npm downloads**, today 25,909 a month, read together with
per-version share so that release churn is not mistaken for growth. **Ninety-day target: 40,000 a
month**, with weekly new stars rising from 13 to 25. Those are targets, not forecasts; the
registry sweep alone could plausibly carry a third of the gap, and the point of writing them down
is to be wrong in public against a pre-registered number.

**Guardrails.**

| Metric | Why | How to collect |
|---|---|---|
| Weekly new stars vs 13/week median | Awareness corroboration; alarm below 8 for two weeks | Stargazer timestamps, daily snapshot |
| False-positive issues per month | The top churn driver; growth must not outrun quality | Issue title prefix, labeled consistently |
| Median time to fix a false positive | Currently 1–2 days and a genuine strength | Issues API |
| Per-version download share 7 days post-release | Adoption lag without telemetry | npm per-version endpoint, polled weekly |
| Public footprint counts | Real embedded usage, not vanity | GitHub code search, monthly |
| Open-issue age | Solo-maintainer overload signal | Issues API |

Experiment discipline matters because weekly stars have a mean of 12.5 and a standard deviation of
3.8. A two-week window cannot detect anything smaller than roughly a 40% lift. Write the hypothesis
and the expected lift before the experiment runs, or the result is unreadable.

---

## 7. Sequencing

The constraint is ten hours a week. This schedule spends them.

**Week 1 — the free wins.** Restore the "Why". Resubmit to the Anthropic plugin directory so the
v1.0.6 build stops shipping. Rename the repository's own marketplace manifest. Add the Gemini
topic. Fix the npm funding field and keywords. Stand up the metrics snapshot and write down the
baselines. Turn on docs analytics. Most of these are under an hour each.

**Days 1–30.** Refresh the bypass research so it matches shipped behaviour, then re-launch on
Hacker News on a weekday, led by that disclosure. Email the one writer who already covered the
project. Record and ship the demo GIF. Publish the comparison page and the first two incident
pages. Pull request OpenCode's ecosystem page and correct the three stale awesome-list entries.
Open the Kimi Code proposal and the Grok Build pull request. Start the Copilot CLI marketplace
review. Make install end in proof. Stamp the block message with a URL. Publish the pull-request
contract, enable Discussions, and add reporter credit to release notes. Cut the standalone Hermes
plugin release so its two-week pin clock starts.

**Days 31–60.** Publish the incident ledger and open the standing bypass challenge. Make the
Reddit debut with a real audit log behind it. Ask mode for Claude Code and Copilot CLI, through the
issue-first process. Split
the install page into per-host pages. Submit the Hermes catalog entry and publish to ClawHub. Ship
the community rulebook index. Publish the false-positive ledger and the Windows matrix. Apply to
Anthropic's curated directory. List in the large cross-agent skills lists.

**Days 61–90.** The guard benchmark and the cross-host "do hooks actually fire?" research, which
are the credibility assets with the longest shelf life. The browser playground.
`policy apply --with-hook`. The Japanese and Chinese posts, timed to a host release rather than to
the calendar.

**Explicitly deferred.** A hosted central-policy service, until three or more organizations commit
`.cc-safety-net/` and ask for it. The academic preprint. Conference talks, which depend on the
benchmark existing first. Adapters for additional hosts, which should wait until the existing
thirteen convert better.

---

## 8. What not to do

- **Do not rename again.** 369 files already reference the old name and every awesome-list entry
  points at it. Expand the acronym in place instead: "CC Safety Net (Coding CLI Safety Net)".
- **Do not add a star prompt to the CLI.** The dashboard already asks once, tied to a real blocked
  count, which is the tasteful limit. A terminal nudge on every install reads as begging.
- **Do not open a Discord.** A solo maintainer cannot staff synchronous chat, and Discussions are
  indexed by search engines while chat is not.
- **Do not over-claim security.** The project's own CONTRIBUTING says it is not a security
  hardening tool and SECURITY.md says it is not a sandbox or a privilege boundary, while the
  sponsors page calls it "a security tool". Pick the honest sentence and use it everywhere. A
  security-literate audience checks.
- **Do not answer paid-listing solicitations.** One arrived offering a "dofollow backlink" and was
  correctly marked spam.
- **Do not fight comparison tables with comparison tables.** A competitor publishes incorrect
  claims about this project. Publish the reproducible corpus instead and let anyone check.
- **Do not publish the bypass research as it stands.** It claims a base64 bypass "currently works";
  the shipped CLI blocks that shape today. Re-verify every case and stamp the document with the
  version it was checked against before it goes anywhere near Hacker News.
- **Do not publish weaponized payloads.** The existing SECURITY.md line, "report the command shape,
  not a ready-to-paste weaponized prompt-injection payload", is the right boundary for the bypass
  content in this plan.
- **Do not build a schema, registry or dashboard ahead of its first real entry.** The repository's
  own scope rule applies to growth machinery too.
- **Do not localize beyond Chinese and Japanese.** Korean, Portuguese and European mentions are
  currently zero. Revisit if a non-English issue arrives from those regions.

---

## 9. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Hosts ship native equivalents and commoditize the pitch | High, already underway | High | Reposition now as the cross-host policy and audit layer; publish the comparison page before it is reactive |
| False-positive fatigue drives churn | High | High | Ask mode, the public ledger, consistent labeling, and the time-to-fix guardrail |
| Enterprise lockdown silently disables the hook | Medium | High | Ship a managed-settings install path and document it; this also opens the platform-team persona |
| Bus factor of one | Certain | High | Release runbook, one triage collaborator, and the pull-request contract that makes contribution possible |
| Release churn reads as instability | Medium | Medium | Declare a cadence and publish a `stable` dist-tag that lags `latest` |
| Unpinned `npx` in the hook path on nine hosts | Medium | High | Pin the invocation to an installed path, as the Claude Code plugin already does |
| Brand dilution and a squatter repository pushing a zip | Medium | Medium | A "formerly" line, an abuse report, and pointer READMEs on the single-host repositories |
| A new pinned-SHA listing goes stale like the last one | High, if unautomated | Medium | Automate the SHA bump in the release workflow for every catalog that pins |
| Growth work crowds out maintenance | Medium | Medium | Ten hours a week is the cap; the deferred list exists to be honoured |

---

## 10. Method and limits

Fifteen dimensions were researched in parallel: positioning, onboarding, competitors, marketplaces,
content, search, product loops, partnerships, monetization, community, narrative, international,
metrics, user voice, and risk. All fifteen returned findings, roughly 250 in total, each with
evidence and at least one source. Sources were the GitHub API, the npm registry, host CLI
documentation and changelogs, the repository and its history, and the public web.

**Known limits of this research.** The adversarial verification pass that was designed to
fact-check every finding did not complete, so the findings carry their researcher's confidence
rating rather than an independent second read; the highest-stakes numbers in this report were
re-checked by hand. The documentation site and the npm downloads API were unreachable from the
research environment, so docs-site facts come from the public source repository and downloads come
from the registry search endpoint. GitHub traffic insights require push access and were not
readable. Every route to Hacker News was blocked, so the score and comments on the project's one Show HN are
unread and its dates were reconstructed indirectly. Two of the five launch-peak days remain
unexplained. That gap is worth one minute of the maintainer's time: GitHub's traffic referrers for
that week, or any analytics from the docs site, would probably name the channel that produced the
single best day this project has ever had.
