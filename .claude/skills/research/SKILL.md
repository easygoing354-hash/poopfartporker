---
name: research
description: Research any topic (companies, stocks, money, health, tech, products, people, places, anything) and return a short, sourced summary. Use whenever the user asks to research, look into, find out about, compare, or fact-check something.
argument-hint: <topic to research>
context: fork
agent: research-helper
---

Research this topic: $ARGUMENTS

If no topic was given, reply only: "What should I research? Try /research <topic>."
Otherwise follow your output format. Keep it short and cite every fact.
