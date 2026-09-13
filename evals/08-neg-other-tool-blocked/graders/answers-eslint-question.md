---
type: llm
focus: last_message
weight: 1
---
The answer must address the ESLint no-unused-vars error with at least one concrete fix: remove or use the unused variable, prefix it with an underscore and configure the ignore pattern, use ignoreRestSiblings for destructuring, or add a targeted eslint-disable comment as a last resort. It may mention that a pre-commit hook is what ran ESLint. Saying it cannot see the user's code and asking for the error text is acceptable as long as concrete general fixes are still given. It must not discuss CC Safety Net, blocked shell commands, or command safety tooling at all. Fail only if it wanders into safety-tool territory or gives no concrete fix.
