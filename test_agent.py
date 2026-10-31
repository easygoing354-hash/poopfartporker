"""Offline tests: a fake Claude drives the real loop, no API key needed."""
from types import SimpleNamespace as NS

import agent


def test_tools(tmp_path, monkeypatch):
    monkeypatch.setattr(agent, "NOTES_DIR", tmp_path)
    assert agent.calculator("2 * (3 + 4)") == "14"
    assert agent.run_tool("calculator", {"expression": "__import__('os')"})[1]
    assert agent.write_note("../evil", "x") == "saved note '../evil'"
    assert (tmp_path / "evil.txt").exists()  # path traversal stripped
    assert agent.list_notes() == "evil"
    assert agent.run_tool("read_note", {"name": "missing"})[1]


def test_loop(tmp_path, monkeypatch):
    monkeypatch.setattr(agent, "NOTES_DIR", tmp_path)
    replies = iter([
        NS(stop_reason="tool_use", content=[NS(type="tool_use", id="t1",
           name="write_note", input={"name": "todo", "content": "eat"})]),
        NS(stop_reason="end_turn", content=[NS(type="text", text="Saved!")]),
    ])
    fake = NS(beta=NS(messages=NS(create=lambda **kw: next(replies))))
    messages = [{"role": "user", "content": "save todo: eat"}]
    assert agent.agent_turn(fake, messages) == "Saved!"
    assert (tmp_path / "todo.txt").read_text() == "eat"
    assert messages[2]["content"][0]["tool_use_id"] == "t1"
