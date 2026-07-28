# Assignment 1A — AI Seekho Bootcamp

## Student Information

| Field | Details |
|-------|---------|
| **Course** | AI SEEKHO – 8-Week AI Learning Initiative |
| **Assignment** | Assignment 1A |
| **Student** | Mohtashim Shahid |
| **Student ID** | F2024376504 |
| **Program** | BS Artificial Intelligence |
| **University** | University of Management and Technology (UMT) |

---

## Assignment Overview

This assignment has two parts focused on **agentic coding tools** and **prompt engineering**.

### Part 1 — Agentic IDE Research

Read the official documentation of the following 5 agentic coding tools and study each one in detail. These are the leading agentic IDEs / coding agents currently shaping how developers craft software with AI assistance.

**Tools to research:**
1. Cursor
2. Claude Code
3. Antigravity (Google)
4. Codex (OpenAI)
5. Windsurf (Codeium)

### Part 2 — Prompt Engineering: Real-Life Scenarios

Below are 5 given real-life scenarios. For each one, craft a complete prompt broken into the **4 parts** — **Role**, **Context**, **Main**, and **Conclusion** — that would get an AI to actually help accomplish the task.

---

# Part 1 — Agentic IDE Research

Read the official documentation of the following 5 agentic coding tools and study each one in detail. These are the leading agentic IDEs / coding agents currently shaping how developers craft software with AI assistance.

## Tools to Research

- 1. Cursor
- 2. Claude Code
- 3. Antigravity (Google)
- 4. Codex (OpenAI)
- 5. Windsurf (Codeium)

---

## 1. Cursor

### What It Is & Who Built It
- **Built by:** Anysphere (San Francisco–based startup)
- **What it is:** An AI-first code editor — a fork of VS Code redesigned around agentic workflows, not just a plugin

### Core Features
- **Agent Mode** — Autonomous loop: reads codebase, edits files, runs terminal commands, iterates until done
- **Composer** — Multi-file editing with diff review for tighter, controlled changes
- **Tab completions** — Predictive inline code suggestions
- **Background / Cloud Agents** — Run tasks in sandboxes while you work on something else
- **BugBot** — Automated PR review (team add-on)
- **Terminal access** — Full shell integration inside the agent loop
- **Multi-file edits** — Coordinated changes across the whole project
- **Skills, hooks, and rules** — Customizable agent behavior and automation

### Codebase Integration
- **Indexing** — Deep codebase awareness for context-aware suggestions
- **MCP support** — Native Model Context Protocol for external tools (databases, APIs, docs)
- **VS Code extensions** — Compatible with most VS Code extensions
- **Multi-model picker** — Claude, GPT, Gemini, and Cursor’s own Composer model

### Pricing / Tiers
| Plan | Price | Notes |
|------|-------|-------|
| Hobby | Free | Limited agent requests, evaluation only |
| Pro | $20/mo | Credit pool, unlimited Composer/Auto on paid plans |
| Pro+ | $60/mo | 3× usage for heavy daily agent users |
| Ultra | $200/mo | 20× usage, priority access |
| Teams | $40/user/mo | Central billing, BugBot, team rules |
| Enterprise | Custom | Pooled usage, SSO, audit logs, MCP controls |

### Key Differentiator
- **Cursor 3 Agents Window** — Manage parallel agents across local machines, worktrees, cloud sandboxes, and remote SSH from one pane

### My Take
- **Strengths:** Most polished all-in-one agentic IDE; strong MCP ecosystem; Composer model offers frontier performance at lower cost
- **Limitations:** Credit-based billing can be confusing; best value requires learning which models to use when
- **Best use case:** Full-time developers who want a daily-driver AI IDE with parallel agents and deep codebase integration

---

## 2. Claude Code

### What It Is & Who Built It
- **Built by:** Anthropic
- **What it is:** An agentic coding tool that runs in the terminal, IDE, desktop app, and browser — focused on deep codebase understanding

### Core Features
- **Terminal-first CLI** — Edit files, run commands, and manage projects from the shell
- **Agentic search** — Maps entire codebases without manual file selection
- **Multi-file edits** — Coordinated changes across multiple files
- **IDE extensions** — VS Code and JetBrains integration
- **Parallel subagents** — Can dispatch dozens to hundreds of subagents for complex tasks
- **Git integration** — Reads issues, crafts code, runs tests, submits PRs
- **No autocomplete** — Focus is on agentic workflows, not inline tab completion

### Codebase Integration
- **Agentic search** — Understands project structure and dependencies automatically
- **MCP support** — Connect external tools and data sources
- **GitHub / GitLab** — Full workflow integration from terminal
- **SDK & GitHub Actions** — Programmable for CI/CD pipelines

### Pricing / Tiers
| Plan | Price | Notes |
|------|-------|-------|
| Pro | $20/mo | Included with Claude Pro; shared usage pool |
| Max 5x | $100/mo | 5× usage for larger codebases |
| Max 20x | $200/mo | 20× usage, Agent Teams, all-day coding |
| Team | $25–150/seat | Admin controls, SSO |
| API | Pay-as-you-go | Separate from subscription for automation |

### Key Differentiator
- **Terminal-native philosophy** — Lives where real dev work happens (shell, Git, deploy tools) instead of forcing you into a new editor

### My Take
- **Strengths:** Excellent codebase mapping; strong for engineers who live in the terminal; Claude Opus models excel at reasoning-heavy tasks
- **Limitations:** No inline autocomplete; usage limits shared across all Claude products
- **Best use case:** Senior developers and DevOps engineers who prefer CLI-driven, terminal-centric agentic coding

---

## 3. Antigravity (Google)

### What It Is & Who Built It
- **Built by:** Google (DeepMind / Google Developers)
- **What it is:** An agentic development platform — evolved from an AI-powered IDE into a full ecosystem with IDE, CLI, SDK, and standalone desktop app (Antigravity 2.0)

### Core Features
- **Editor View** — Familiar AI IDE with tab completions and inline commands
- **Agent Manager / Mission Control** — Orchestrate multiple agents asynchronously across workspaces
- **Artifacts system** — Human-verifiable outputs (task lists, plans, screenshots, browser recordings) instead of raw logs
- **Browser-in-the-loop** — Agents test UI in a real browser
- **Terminal access** — Full command execution across editor, terminal, and browser
- **Multi-agent orchestration** — Spawn and observe parallel agents on different tasks
- **Scheduled tasks & hooks** — Automate recurring agent workflows

### Codebase Integration
- **Deep codebase understanding** — Agents plan and execute across full projects
- **Model optionality** — Gemini 3.x, Claude Sonnet, OpenAI GPT-OSS within one platform
- **Antigravity CLI** — Terminal-first lightweight agent surface
- **Antigravity SDK** — Python SDK for custom agent applications
- **Gemini Enterprise integration** — Available for enterprise deployments

### Pricing / Tiers
| Plan | Price | Notes |
|------|-------|-------|
| Individual (Preview) | Free | Generous Gemini rate limits during public preview |
| Enterprise | Custom | Powered by latest Gemini models, org controls |

### Key Differentiator
- **Artifacts + Agent Manager** — Trust-building through verifiable deliverables and async multi-agent orchestration, not just chat in a sidebar

### My Take
- **Strengths:** Best-in-class async agent management; browser testing built in; strong Gemini model integration; free during preview
- **Limitations:** Rapidly evolving product (IDE vs 2.0 desktop split); enterprise pricing not yet public
- **Best use case:** Developers who want to delegate end-to-end tasks (code + test + verify in browser) to autonomous agents

---

## 4. Codex (OpenAI)

### What It Is & Who Built It
- **Built by:** OpenAI
- **What it is:** A multi-surface coding agent — cloud agent (Codex Web), open-source CLI, IDE extension, desktop app, and GitHub integration

### Core Features
- **Codex CLI** — Open-source terminal agent (`npm install -g @openai/codex`)
- **Codex Web (Cloud)** — Parallel cloud sandboxes; each task runs in an isolated environment with your repo
- **Multi-file edits** — Read, edit files, run tests, linters, and type checkers
- **Subagents** — Delegate independent work to parallel subagent threads
- **Image attachments** — Share screenshots, wireframes, and diagrams for context
- **To-do tracking** — Progress tracking for complex multi-step tasks
- **Sandbox modes** — Configurable approval levels (read-only, auto, full access)
- **GPT-5-Codex model** — Optimized for agentic coding and code review

### Codebase Integration
- **GitHub integration** — Opens PRs directly from agent tasks
- **IDE extension** — Works in VS Code, Cursor, Windsurf
- **MCP support** — Connect external systems and tools
- **Web search** — Built-in for up-to-date documentation lookup
- **AGENTS.md / skills** — Project-level agent instructions

### Pricing / Tiers
| Plan | Price | Notes |
|------|-------|-------|
| ChatGPT Plus | $20/mo | Codex access (rolling rollout) |
| ChatGPT Pro | $200/mo | Full cloud agent access |
| Business / Enterprise | Custom | Team deployment |
| API key | Pay-as-you-go | For CLI and programmatic use |

### Key Differentiator
- **Cloud + local hybrid** — Only tool offering true parallel cloud sandboxes (Codex Web) alongside an open-source local CLI

### My Take
- **Strengths:** Open-source CLI; cloud agents handle long tasks in parallel; strong sandbox security model; GitHub-native workflow
- **Limitations:** Cloud tasks take 1–30 minutes; pricing tied to ChatGPT tiers; less IDE-native than Cursor or Windsurf
- **Best use case:** Teams that want to offload long-running coding tasks to cloud sandboxes while keeping local CLI for quick interactive work

---

## 5. Windsurf (Codeium)

### What It Is & Who Built It
- **Built by:** Codeium (now under Cognition AI — Devin team)
- **What it is:** An AI-first code editor (VS Code fork) centered on **Cascade**, a semi-autonomous agentic coding assistant

### Core Features
- **Cascade (Write mode)** — Plans, implements, and iterates across multiple files autonomously
- **Cascade (Chat mode)** — Q&A about codebase without making edits
- **Supercomplete** — Fast inline tab completions
- **Turbo Mode** — Auto-execute terminal commands and browser controls
- **Memories** — Persistent learning about your codebase patterns and preferences
- **Multiple Cascades** — Run several agent sessions in parallel
- **Voice input** — Speech-to-text for agent prompts
- **SWE-1.5 model** — Codeium’s proprietary fast agent model

### Codebase Integration
- **Real-time context awareness** — Cascade sees your live cursor position and recent actions
- **MCP integrations** — Third-party tool connections
- **9+ editor support** — VS Code, JetBrains, Neovim, Vim, and more via plugins
- **Package detection** — Auto-detects and installs missing dependencies

### Pricing / Tiers
| Plan | Price | Notes |
|------|-------|-------|
| Free | $0 | Limited credits (~25/mo), basic models |
| Pro | $15/mo | 500 credits, premium models, SWE-1.5 |
| Teams | $30/user/mo | Admin dashboard, RBAC, shared context |
| Enterprise | Custom | Self-hosted, compliance, dedicated support |

### Key Differentiator
- **Memories + real-time context** — Cascade learns your codebase patterns over time and tracks what you're doing live, not just what files exist

### My Take
- **Strengths:** Most affordable Pro tier ($15/mo); polished Cascade agent; Memories feature is a thoughtful differentiator; strong multi-editor support
- **Limitations:** Free tier is very limited; credit system can run out quickly on heavy agent use; smaller community than Cursor
- **Best use case:** Budget-conscious developers and students who want a capable agentic IDE without paying Cursor-level prices

---

### Part 1 — Quick Comparison

| Tool | Builder | Starting Price | Standout Feature |
|------|---------|----------------|------------------|
| Cursor | Anysphere | Free / $20 Pro | Parallel Agents Window + Composer model |
| Claude Code | Anthropic | $20 Pro | Terminal-native + agentic codebase search |
| Antigravity | Google | Free (preview) | Artifacts + async Agent Manager |
| Codex | OpenAI | $20 Plus | Cloud sandboxes + open-source CLI |
| Windsurf | Codeium | Free / $15 Pro | Cascade + Memories at lowest Pro price |

---

# Part 2 — Prompt Engineering: Real-Life Scenarios

For each scenario below, the prompt is broken into **Role**, **Context**, **Main**, and **Conclusion** — following the 4-part structure from AI Seekho Bootcamp Class 1.

---

## Scenario 1 — Budget Trip

| Part | Prompt |
|------|--------|
| **ROLE** | You are a budget travel planner specializing in affordable domestic trips within Pakistan. |
| **CONTEXT** | I have PKR 15,000 total, 3 free days, and 2 friends joining me. I cannot ask my parents for extra money — the entire trip must stay within budget. |
| **MAIN** | Craft a realistic destination in Pakistan and a day-by-day plan covering transport, stay, and food that all three of us can afford. |
| **CONCLUSION** | Present the output as a day-by-day itinerary table with a full cost breakdown at the end showing per-person and total expenses. |

---

## Scenario 2 — Difficult Message

| Part | Prompt |
|------|--------|
| **ROLE** | You are a tenant communications expert who helps renters resolve maintenance issues professionally. |
| **CONTEXT** | My water heater has been broken for 2 weeks despite 2 verbal requests to my landlord. Winter is approaching and I need it fixed, but I also want to renew my lease next year. |
| **MAIN** | Craft a firm but respectful WhatsApp message to my landlord, plus a firmer backup message if the first one is ignored again. |
| **CONCLUSION** | Keep both messages short, polite, and professional — no legal threats, no emotional language. Present them as "Message 1" and "Message 2 (Follow-up)." |

---

## Scenario 3 — Impossible Schedule

| Part | Prompt |
|------|--------|
| **ROLE** | You are a productivity coach who designs realistic schedules based on energy levels, not just available hours. |
| **CONTEXT** | I am a 6th-semester BS AI student with 5 courses, a 15 hr/week part-time job, a side-project deadline in 3 weeks, and a goal of going to the gym 4× per week. My energy dips in the afternoon (2–5 PM) and I keep failing schedules that ignore this pattern. |
| **MAIN** | Craft a realistic weekly timetable that places demanding tasks during high-energy windows and lighter tasks during dips. |
| **CONCLUSION** | Present it as a day-by-day table (Mon–Sun) with time blocks, activity labels, and honest notes on what to cut if the week still feels overloaded. |

---

## Scenario 4 — Broke Student Meal Plan

| Part | Prompt |
|------|--------|
| **ROLE** | You are a budget meal planner for students living in Pakistan with minimal kitchen equipment. |
| **CONTEXT** | I have PKR 8,000/month for food. My kitchen has only a stove and a small fridge — no oven, no microwave. I want to stop relying on instant noodles and fast food because it's tanking my energy and focus. |
| **MAIN** | Craft a 7-day meal plan (breakfast, lunch, dinner) and one combined grocery list that fits my budget and equipment. |
| **CONCLUSION** | Format as a day-by-day meal table plus a separate grocery list with item names, quantities, and a total cost that stays within PKR 8,000. |

---

## Scenario 5 — Scholarship Interview

| Part | Prompt |
|------|--------|
| **ROLE** | You are a scholarship interview coach with experience preparing students for high-pressure panel interviews. |
| **CONTEXT** | I have a scholarship interview in 5 days. The panel is known for asking about weaknesses and my 5-year plan. I tend to freeze up and ramble under pressure. |
| **MAIN** | Run a mock interview with me — ask one question at a time, wait for my answer, then give direct feedback before moving to the next question. Cover at least 5 questions including weakness and long-term goals. |
| **CONCLUSION** | After all questions, provide a short bullet-point summary of patterns I need to fix (e.g., rambling, lack of structure, weak examples). |

---

# Conclusion

### What This Assignment Taught Me

**Part 1 — Agentic IDE Research**
- The agentic coding landscape is crowded but each tool has a distinct philosophy: Cursor bets on an all-in-one IDE, Claude Code on the terminal, Google Antigravity on async multi-agent orchestration, OpenAI Codex on cloud sandboxes, and Windsurf on affordability with Cascade.
- All five tools share core capabilities — multi-file edits, terminal access, and codebase awareness — but differ in **pricing**, **integration surface** (IDE vs CLI vs cloud), and **trust model** (diffs vs artifacts vs sandboxes).
- Choosing the right tool depends on workflow: daily IDE users → Cursor or Windsurf; terminal power users → Claude Code or Codex CLI; async delegation → Antigravity or Codex Web.

**Part 2 — Prompt Engineering**
- Breaking prompts into **Role → Context → Main → Conclusion** makes AI outputs far more useful than vague one-liner requests.
- Using **"craft"** instead of "write" or "generate" produces more intentional, structured responses.
- Real-life scenarios (travel, tenant messages, schedules, meal plans, interviews) prove that prompt engineering is not just for coding — it's a life skill for getting reliable help from any LLM.

### Key Takeaways

| # | Takeaway |
|---|----------|
| 1 | Agentic tools are reshaping how software is built — from autocomplete to autonomous multi-file agents |
| 2 | A well-structured prompt (4 parts) saves time and reduces back-and-forth with AI |
| 3 | Context is the most overlooked part — the more specific the constraints, the better the output |
| 4 | Each agentic IDE has trade-offs; no single tool wins on every dimension |
| 5 | Prompt engineering applies beyond code — budgeting, communication, and planning all benefit |

---

*Submitted by Mohtashim Shahid (F2024376504) — BS Artificial Intelligence, UMT*
