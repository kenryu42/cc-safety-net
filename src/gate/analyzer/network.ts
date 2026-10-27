import { isInterpreterCommand } from '@/core/policy/transparent-wrappers';
import { REQUEST_CLIENT_COMMANDS } from '@/core/rules/constants';
import { destructiveCommandMatch } from '@/core/rules/destructive';
import type { DestructiveCommandRuleMatch } from '@/core/rules/types';
import { getBasename, normalizeCommandToken } from '@/core/shell/tokens';

const REASON_CLOUD_METADATA =
  'This reaches a cloud metadata endpoint, which hands out instance credentials. Ask the user to run metadata requests manually if they are needed.';

const REASON_UPLOAD_REMOTE =
  'This uploads data to a remote host, which can send local files or secrets off the machine. Send it to localhost instead, or ask the user to run the upload manually if it is needed.';

const CLOUD_METADATA_HOST =
  /(?<![\w.-])(?:169\.254\.169\.254|169\.254\.170\.23|169\.254\.170\.2|100\.100\.100\.200|metadata\.google\.internal|metadata\.goog)(?![\w-]|\.[\w-])|(?<![\w:])fd00:ec2::(?:254|23)(?![\w:])/i;

const COMMAND_LAUNCHERS = new Set(['xargs', 'find']);

type OptionRole = 'data' | 'upload' | 'url' | 'source' | 'local' | 'value' | 'get';

const optionRoles = (entries: Partial<Record<OptionRole, string[]>>) =>
  new Map(
    Object.entries(entries).flatMap(([role, names]) =>
      names.map((name) => [name, role as OptionRole] as const),
    ),
  );

const UPLOAD_CLIENT_OPTIONS = new Map([
  [
    'curl',
    optionRoles({
      data: [
        '-d',
        '--data',
        '--data-ascii',
        '--data-binary',
        '--data-raw',
        '--data-urlencode',
        '--json',
      ],
      upload: ['-F', '--form', '--form-string', '-T', '--upload-file'],
      url: ['--url', '-x', '--proxy', '--preproxy'],
      source: ['-K', '--config'],
      local: ['--unix-socket', '--abstract-unix-socket'],
      get: ['-G', '--get'],
      value: [
        ...'ACDEHPQUXYbcehmortuwyz'.split('').map((letter) => `-${letter}`),
        '--output',
        '--output-dir',
        '--header',
        '--proxy-header',
        '--request',
        '--user-agent',
        '--user',
        '--proxy-user',
        '--max-time',
        '--connect-timeout',
        '--write-out',
        '--cookie',
        '--cookie-jar',
        '--referer',
        '--retry',
        '--retry-delay',
        '--retry-max-time',
        '--cert',
        '--key',
        '--cacert',
        '--capath',
        '--range',
        '--resolve',
        '--connect-to',
        '--limit-rate',
        '--oauth2-bearer',
        '--dump-header',
        '--continue-at',
        '--time-cond',
        '--interface',
        '--max-filesize',
        '--max-redirs',
        '--noproxy',
        '--url-query',
        '--aws-sigv4',
        '--variable',
        '--stderr',
        '--trace',
        '--trace-ascii',
      ],
    }),
  ],
  [
    'wget',
    optionRoles({
      upload: ['--post-data', '--post-file', '--body-data', '--body-file'],
      source: ['-i', '--input-file'],
      value: [
        ...'ABDIOPQRTUXaelotw'.split('').map((letter) => `-${letter}`),
        '--output-document',
        '--output-file',
        '--append-output',
        '--header',
        '--user-agent',
        '--method',
        '--timeout',
        '--tries',
        '--user',
        '--password',
        '--directory-prefix',
        '--execute',
        '--wait',
        '--referer',
        '--load-cookies',
        '--save-cookies',
        '--ca-certificate',
        '--certificate',
        '--private-key',
      ],
    }),
  ],
]);

const LOOPBACK_HOST =
  /^(?:localhost|[a-z\d-]+(?:\.[a-z\d-]+)*\.localhost|127(?:\.\d{1,3}){3}|0\.0\.0\.0|\[::1\])$/;

export function analyzeNetworkCommandMatch(
  head: string,
  tokens: readonly string[],
): DestructiveCommandRuleMatch | null {
  if (reachesCloudMetadata(head, tokens)) {
    return destructiveCommandMatch('network.cloud-metadata', REASON_CLOUD_METADATA);
  }
  return uploadsToRemoteHost(head, tokens)
    ? destructiveCommandMatch('network.upload-remote', REASON_UPLOAD_REMOTE)
    : null;
}

function reachesCloudMetadata(head: string, tokens: readonly string[]): boolean {
  const launchesRequest = COMMAND_LAUNCHERS.has(head)
    ? tokens.slice(1).some(isRequestCapableCommand)
    : isRequestCapableCommand(head);
  return (
    launchesRequest &&
    tokens.some(
      (token, index) =>
        !isNoProxyValue(tokens[index - 1], token) && CLOUD_METADATA_HOST.test(token),
    )
  );
}

function isRequestCapableCommand(token: string): boolean {
  const command = commandName(token);
  return REQUEST_CLIENT_COMMANDS.has(command) || isInterpreterCommand(command);
}

function isNoProxyValue(previous: string | undefined, token: string): boolean {
  return previous === '--noproxy' || token.startsWith('--noproxy=');
}

function uploadsToRemoteHost(head: string, tokens: readonly string[]): boolean {
  const start = COMMAND_LAUNCHERS.has(head)
    ? tokens.findIndex((token, index) => index > 0 && UPLOAD_CLIENT_OPTIONS.has(commandName(token)))
    : 0;
  const options = UPLOAD_CLIENT_OPTIONS.get(commandName(tokens[start] ?? head));
  if (start < 0 || options === undefined) return false;
  const launched = tokens.slice(start + 1);
  const end = launched.findIndex((token) => token === ';' || token === '+');
  const argv = end < 0 || !COMMAND_LAUNCHERS.has(head) ? launched : launched.slice(0, end);
  const roles = new Set<OptionRole>();
  const urls: string[] = [];
  const record = (role: OptionRole, value: string) => {
    roles.add(role);
    if (role === 'url' && value !== '') urls.push(value);
    if (role === 'source') urls.push('');
  };
  let index = 0;
  let operandsOnly = false;
  while (index < argv.length) {
    const token = argv[index] ?? '';
    index++;
    if (operandsOnly || !token.startsWith('-') || token === '-') {
      urls.push(token);
      continue;
    }
    if (token === '--') {
      operandsOnly = true;
      continue;
    }
    if (token.startsWith('--')) {
      const equals = token.indexOf('=');
      const role = options.get(equals < 0 ? token : token.slice(0, equals));
      if (role === undefined) continue;
      const takesValue = role !== 'get';
      const value = equals >= 0 ? token.slice(equals + 1) : takesValue ? (argv[index] ?? '') : '';
      if (takesValue && equals < 0) index++;
      record(role, value);
      continue;
    }
    const letters = token.slice(1).split('');
    const valueAt = letters.findIndex((letter) => {
      const role = options.get(`-${letter}`);
      return role !== undefined && role !== 'get';
    });
    if (
      (valueAt < 0 ? letters : letters.slice(0, valueAt)).some(
        (letter) => options.get(`-${letter}`) === 'get',
      )
    ) {
      roles.add('get');
    }
    if (valueAt < 0) continue;
    const role = options.get(`-${token[valueAt + 1]}`) ?? 'value';
    const attached = token.slice(valueAt + 2);
    if (attached === '') index++;
    record(role, attached === '' ? (argv[index - 1] ?? '') : attached);
  }
  const sendsBody = roles.has('upload') || (roles.has('data') && !roles.has('get'));
  return sendsBody && !roles.has('local') && !(urls.length > 0 && urls.every(isLoopbackUrl));
}

function commandName(token: string): string {
  return normalizeCommandToken(getBasename(token));
}

function isLoopbackUrl(url: string): boolean {
  const authority = url.replace(/^[a-z][a-z\d+.-]*:\/\//i, '').split(/[/?#]/)[0] ?? '';
  const host = authority.slice(authority.lastIndexOf('@') + 1).toLowerCase();
  const name = host.startsWith('[') ? host.slice(0, host.indexOf(']') + 1) : host.split(':')[0];
  return LOOPBACK_HOST.test(name ?? '');
}
