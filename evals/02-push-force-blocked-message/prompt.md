---
max_turns: 15
timeout_seconds: 300
allowed_tools: ["Skill", "Bash(npx -y cc-safety-net:*)", "Bash(npx cc-safety-net:*)"]
runs: 3
---
/cc-safety-net I got this in my session and don't understand it:

BLOCKED by CC Safety Net
Reason: git push --force destroys remote history. Use --force-with-lease for safer force push.
Tool: Bash
Command: git push --force origin main

What does it mean and what should I do instead?
