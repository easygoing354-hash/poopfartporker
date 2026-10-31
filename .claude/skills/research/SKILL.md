---
name: research
description: Research any topic with the research-helper agent. Usage - /research <topic>
argument-hint: <topic to research>
context: fork
agent: research-helper
disable-model-invocation: true
---

Research this topic: $ARGUMENTS

If no topic was given, reply only: "What should I research? Try /research <topic>."
