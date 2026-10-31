"""
A tiny AI agent you can read in one sitting.

An "agent" is just a loop:
  1. Send the conversation + a list of tools to Claude.
  2. If Claude asks to use a tool, run it and send the result back.
  3. Repeat until Claude answers without asking for a tool.

This one is a personal notes assistant. It can do math, tell the time,
and read/write text notes in a local ./notes folder.

Run:  python agent.py
"""

import ast
import datetime
import operator
import pathlib

import anthropic

MODEL = "claude-opus-5-5"
NOTES_DIR = pathlib.Path(__file__).parent / "notes"
SYSTEM_PROMPT = (
    "You are a helpful personal notes assistant. Use the tools to manage the "
    "user's notes, do arithmetic, and check the date. Keep replies short."
)

# ---------------------------------------------------------------------------
# 1. TOOLS: plain Python functions the agent is allowed to call.
# ---------------------------------------------------------------------------

_OPS = {
    ast.Add: operator.add, ast.Sub: operator.sub, ast.Mult: operator.mul,
    ast.Div: operator.truediv, ast.Pow: operator.pow, ast.Mod: operator.mod,
    ast.USub: operator.neg, ast.UAdd: operator.pos,
}


def calculator(expression: str) -> str:
    """Safely evaluate arithmetic like '2 * (3 + 4)'. No eval() on purpose."""
    def ev(node):
        if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
            return node.value
        if isinstance(node, ast.BinOp) and type(node.op) in _OPS:
            return _OPS[type(node.op)](ev(node.left), ev(node.right))
        if isinstance(node, ast.UnaryOp) and type(node.op) in _OPS:
            return _OPS[type(node.op)](ev(node.operand))
        raise ValueError("only numbers and + - * / ** % are allowed")
    return str(ev(ast.parse(expression, mode="eval").body))


def get_current_time() -> str:
    return datetime.datetime.now().astimezone().isoformat(timespec="seconds")


def _note_path(name: str) -> pathlib.Path:
    # Keep the agent inside ./notes - never let it touch other files.
    safe = "".join(c for c in name if c.isalnum() or c in "-_ ").strip()
    if not safe:
        raise ValueError("invalid note name")
    return NOTES_DIR / f"{safe}.txt"


def list_notes() -> str:
    NOTES_DIR.mkdir(exist_ok=True)
    names = sorted(p.stem for p in NOTES_DIR.glob("*.txt"))
    return "\n".join(names) if names else "(no notes yet)"


def read_note(name: str) -> str:
    path = _note_path(name)
    if not path.exists():
        raise FileNotFoundError(f"no note called '{name}'")
    return path.read_text()


def write_note(name: str, content: str) -> str:
    NOTES_DIR.mkdir(exist_ok=True)
    _note_path(name).write_text(content)
    return f"saved note '{name}'"


TOOL_FUNCTIONS = {
    "calculator": calculator,
    "get_current_time": get_current_time,
    "list_notes": list_notes,
    "read_note": read_note,
    "write_note": write_note,
}

# ---------------------------------------------------------------------------
# 2. TOOL DESCRIPTIONS: what Claude sees. Name + description + JSON schema.
#    Claude never runs your code - it just asks *you* to run it.
# ---------------------------------------------------------------------------


def _schema(props: dict | None = None) -> dict:
    props = props or {}
    return {"type": "object", "properties": props,
            "required": list(props), "additionalProperties": False}


TOOLS = [
    {"name": "calculator", "description": "Evaluate an arithmetic expression.",
     "input_schema": _schema({"expression": {"type": "string"}})},
    {"name": "get_current_time", "description": "Get the current local date and time.",
     "input_schema": _schema()},
    {"name": "list_notes", "description": "List the names of all saved notes.",
     "input_schema": _schema()},
    {"name": "read_note", "description": "Read a note by name.",
     "input_schema": _schema({"name": {"type": "string"}})},
    {"name": "write_note", "description": "Create or overwrite a note.",
     "input_schema": _schema({"name": {"type": "string"},
                              "content": {"type": "string"}})},
]


def run_tool(name: str, tool_input: dict) -> tuple[str, bool]:
    """Run one tool. Returns (result_text, is_error)."""
    try:
        return TOOL_FUNCTIONS[name](**tool_input), False
    except Exception as e:  # tell Claude what went wrong so it can recover
        return f"Error: {e}", True


# ---------------------------------------------------------------------------
# 3. THE AGENT LOOP
# ---------------------------------------------------------------------------


def agent_turn(client, messages: list, max_steps: int = 10) -> str:
    """Run the loop for one user message. Mutates `messages` (the memory)."""
    for _ in range(max_steps):
        response = client.beta.messages.create(
            model=MODEL,
            max_tokens=16000,
            system=SYSTEM_PROMPT,
            tools=TOOLS,
            messages=messages,
            output_config={"effort": "medium"},
            # If a safety check declines, the API retries on a suitable model.
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
        )
        # Always store Claude's full reply - it's part of the conversation.
        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "tool_use":
            results = []
            for block in response.content:
                if block.type == "tool_use":
                    print(f"  🔧 {block.name}({block.input})")
                    output, is_error = run_tool(block.name, block.input)
                    print(f"     → {output[:200]}")
                    results.append({"type": "tool_result", "tool_use_id": block.id,
                                    "content": output, "is_error": is_error})
            # All results go back together in one "user" message.
            messages.append({"role": "user", "content": results})
            continue

        if response.stop_reason == "pause_turn":
            continue  # server asked us to resend so it can keep going
        if response.stop_reason == "refusal":
            return "(Claude declined this request.)"

        text = "".join(b.text for b in response.content if b.type == "text")
        if response.stop_reason == "max_tokens":
            text += "\n(reply was cut off)"
        return text

    return "(stopped: too many steps)"


def main():
    client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY
    messages = []  # the agent's memory for this session
    print("Notes agent ready. Try: 'save a note called groceries: eggs, milk'. "
          "Ctrl+C to quit.")
    while True:
        try:
            user_input = input("\nyou> ").strip()
        except (EOFError, KeyboardInterrupt):
            break
        if not user_input:
            continue
        start = len(messages)  # so we can undo this turn if it fails
        messages.append({"role": "user", "content": user_input})
        try:
            print(f"agent> {agent_turn(client, messages)}")
        except anthropic.AuthenticationError:
            print("Bad or missing ANTHROPIC_API_KEY.")
            break
        except anthropic.RateLimitError:
            print("Rate limited - wait a moment and try again.")
            del messages[start:]
        except anthropic.APIStatusError as e:
            print(f"API error {e.status_code}: {e.message}")
            del messages[start:]
        except anthropic.APIConnectionError:
            print("Network problem - check your connection.")
            del messages[start:]


if __name__ == "__main__":
    main()
