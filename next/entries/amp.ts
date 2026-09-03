import type { PluginAPI } from '@ampcode/plugin';
import { handleAmpToolCall } from '@next/hosts/amp/tool-call';

export default function ccSafetyNetAmpPlugin(amp: PluginAPI): void {
  amp.on('tool.call', (event) => handleAmpToolCall(event, amp));
}
