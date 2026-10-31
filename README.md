# poopfartporker

A tiny AI agent for learning: a notes assistant built on the Claude API.

## Run it

```bash
pip install -r requirements.txt
```

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

```bash
python agent.py
```

Try: `save a note called groceries: eggs, milk`, then `what's in my groceries note?`, then `what is 17% of 240?`.

## How it works (read `agent.py` top to bottom)

1. **Tools**: ordinary Python functions (calculator, clock, read/write/list notes).
2. **Tool descriptions**: a name, a description and a JSON schema for each tool. Claude reads these to decide what to call. Claude never runs your code itself; it asks you to run it.
3. **The loop** (`agent_turn`): send messages and tools to Claude. If `stop_reason == "tool_use"`, run the tools and send the results back. Repeat until Claude replies with plain text.
4. **Memory**: the `messages` list. Everything said and every tool result stays there, so the agent remembers earlier turns.

## Ideas to try next

- Add a tool, for example `delete_note` or `search_notes`. Write the function, add a schema, and register it in `TOOL_FUNCTIONS`.
- Change `SYSTEM_PROMPT` and see how the agent's behaviour changes.
- Ask the agent to confirm before it overwrites a note.
- Run the offline tests with `python -m pytest test_agent.py`.
