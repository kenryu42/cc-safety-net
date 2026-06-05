import { registerBuiltinCommands } from '@/pi/builtin-commands';
import { registerToolUseEvent } from '@/pi/tool-use';
type PiExtensionApi = Parameters<typeof registerBuiltinCommands>[0] & Parameters<typeof registerToolUseEvent>[0];
export default function ccSafetyNetPiExtension(pi: PiExtensionApi): void;
export {};
