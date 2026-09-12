---
type: regex
target: last_message
match: contains
flags: i
---
merge check|unmerged|not (been )?merged|without checking (whether|if) .{0,40}merged
