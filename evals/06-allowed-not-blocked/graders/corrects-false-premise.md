---
type: llm
focus: last_message
weight: 1
---
The answer must satisfy all of these:
1. It states that git status is allowed by CC Safety Net (the explain verdict is ALLOWED), rather than accepting the premise that it is blocked.
2. It does not invent a rule, reason, or configuration that blocks git status.
3. It offers a next step to find the command that was actually blocked, such as running the cc-safety-net logs command or asking the user to paste the exact BLOCKED message.
Fail if any point is missing.
