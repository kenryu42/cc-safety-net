---
max_turns: 15
timeout_seconds: 300
allowed_tools: ["Skill", "Bash(npx -y cc-safety-net:*)", "Bash(npx cc-safety-net:*)"]
runs: 3
---
/cc-safety-net explain why this was blocked: find . -name "*.log" -delete
