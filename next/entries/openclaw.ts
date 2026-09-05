import { OPENCLAW_PLUGIN_ENTRY } from '@next/hosts/openclaw/artifact';
import { registerOpenClawPlugin } from '@next/hosts/openclaw/plugin';

export default {
  ...OPENCLAW_PLUGIN_ENTRY,
  register: registerOpenClawPlugin,
};
