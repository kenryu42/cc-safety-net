const AWS_GLOBAL_OPTIONS_WITH_VALUES = new Set([
  '--ca-bundle',
  '--cli-binary-format',
  '--cli-connect-timeout',
  '--cli-error-format',
  '--cli-read-timeout',
  '--color',
  '--endpoint-url',
  '--output',
  '--profile',
  '--query',
  '--region',
]);

const GCLOUD_GLOBAL_OPTIONS_WITH_VALUES = new Set([
  '--access-token-file',
  '--account',
  '--billing-project',
  '--configuration',
  '--flags-file',
  '--flatten',
  '--format',
  '--impersonate-service-account',
  '--project',
  '--trace-token',
  '--verbosity',
]);

const AZ_GLOBAL_OPTIONS_WITH_VALUES = new Set(['-o', '--output', '--query', '--subscription']);

const EMPTY_GLOBAL_OPTIONS_WITH_VALUES = new Set<string>();

export function getMatchGlobalOptionsWithValues(command: string): ReadonlySet<string> {
  if (command === 'aws') return AWS_GLOBAL_OPTIONS_WITH_VALUES;
  if (command === 'gcloud') return GCLOUD_GLOBAL_OPTIONS_WITH_VALUES;
  if (command === 'az') return AZ_GLOBAL_OPTIONS_WITH_VALUES;
  return EMPTY_GLOBAL_OPTIONS_WITH_VALUES;
}
