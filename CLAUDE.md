# Project instructions

## Research
- When the user asks to research, look into, compare, or fact-check anything, use the `research` skill
  (it runs the `research-helper` agent). The user explicitly wants this; it counts as asking for the agent.
- Use Firecrawl directly only for quick one-fact lookups.

## Keeping changes
- Each cloud session starts from `main`. Anything meant for future sessions (skills, agents, this file)
  must be pushed and merged to `main`, or other sessions won't see it.
