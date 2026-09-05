/**
 * Entry point for the explain command module.
 * Re-exports analysis function and formatting utilities.
 */

// Flag parsing
export { parseExplainFlags } from '@next/cli/explain/flags';
// Formatting utilities
export { formatTraceHuman, formatTraceJson } from '@next/cli/explain/format';
// Core analysis logic
export { explainCommand } from '@next/gate/explain';
