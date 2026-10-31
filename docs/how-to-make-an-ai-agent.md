# How to Make an AI Agent in Claude Code (on GitHub)

A basic, step-by-step sheet. An "agent" here means a **Claude Code subagent**: a helper with one job, its own instructions and its own set of tools. Claude hands work to it when your request matches its description.

## 1. Get set up
- A GitHub repo (this one works).
- Claude Code: on the web at claude.ai/code (connect GitHub and pick the repo), or the CLI / desktop app.

## 2. Pick ONE job
Keep it small and clear, e.g. "check the weather" or "proofread a blog post against our brand guide". One agent = one job.

## 3. Create the agent file
Put it in `.claude/agents/` in your repo, one file per agent:

```
.claude/agents/<agent-name>.md
```

## 4. Write the file
Two parts: a header between `---` lines, then plain-English instructions.

```markdown
---
name: proofreader
description: Proofreads drafts for spelling, grammar and tone. Use when the user asks to proofread, check or polish a draft.
tools: Read, Grep, Glob, Edit
---

You are a proofreader.

1. Read the draft and any style guide the user points to.
2. Fix spelling and grammar. Keep the author's voice.
3. Never invent facts, numbers or quotes.
4. Check your work against the list below before saying "done":
   - [ ] No spelling mistakes
   - [ ] Tone matches the style guide
5. List what you changed.
```

| Field | What it does |
|---|---|
| `name` | Short lowercase name, with hyphens if needed. |
| `description` | **The most important line.** Use the words you'd actually say. This is how Claude knows when to use the agent. |
| `tools` | Optional. List only what it needs. Leave it out to give it every tool. |
| `model` | Optional. E.g. `sonnet`, `opus`, `haiku`, or `inherit`. |

Shortcut: in Claude Code, type `/agents` to create one step by step, or paste the **Agent Designer** prompt (`prompts/agent-designer.md`) and let Claude build it for you.

## 5. Save it to GitHub
```bash
git add .claude/agents/proofreader.md
```
```bash
git commit -m "Add proofreader agent"
```
```bash
git push
```
Or just ask Claude Code: "commit and push this", then merge the pull request.

## 6. Use it
- **Start a new session** so Claude picks up the new agent.
- Ask normally ("proofread this post"), or name it ("use the proofreader agent on…").

## 7. Test and improve
- Try 2–3 real tasks.
- If it does the wrong thing, tighten the instructions. If it isn't used, reword the `description`.
- Commit each improvement.

## Tips
- Plain English beats clever wording.
- Give it a yes/no "done" checklist.
- Tell it when to stop and ask you instead of guessing.
- Fewer tools = safer and more focused.
