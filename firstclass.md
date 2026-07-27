# AI Seekho Bootcamp — First Class Notes

## What I Learned

### 1. Prompt Crafting Language

When creating prompts for AI, avoid using words like **"write"** or **"generate"**. Instead, use the word **"craft"** — it leads to more intentional and refined outputs.

---

### 2. Four Parts of a Prompt

A well-structured prompt has four key sections:

| Part | Purpose |
|------|---------|
| **ROLE** | Define who the AI should act as (e.g., expert developer, teacher) |
| **CONTEXT** | Provide background information and relevant details |
| **MAIN** | State the core task or question clearly |
| **CONCLUSION** | Specify the desired output format, tone, or next steps |

**Example flow:**
- **ROLE** → You are a senior Python developer.
- **CONTEXT** → I am building a REST API for a todo app.
- **MAIN** → Craft a modular route handler for creating todos.
- **CONCLUSION** → Return clean, commented code with error handling.

---

### 3. LLM: Stateful vs Stateless

- **Stateless** — Each request is independent; the model does not remember previous messages unless history is sent again in the prompt.
- **Stateful** — The model (or application) retains conversation context across turns, so follow-up questions build on earlier exchanges.

Understanding this helps when designing chat apps, agents, and multi-step workflows.

---

### 4. Development Key Points

#### Code Structure & Directories

- Organize code into clear, logical folders (e.g., `src/`, `tests/`, `config/`).
- Keep related files together; separate concerns by feature or layer.
- Use consistent naming so the project is easy to navigate and scale.

#### Modularity

- Break code into small, reusable units (functions, modules, components).
- Each module should have a single, clear responsibility.
- Modular design makes testing, debugging, and collaboration easier.

---

## Summary

| Topic | Takeaway |
|-------|----------|
| Prompt wording | Use **"craft"**, not "write" or "generate" |
| Prompt structure | **ROLE → Context → MAIN → Conclusion** |
| LLM behavior | Know the difference between **stateful** and **stateless** |
| Development | Focus on **structure**, **directories**, and **modularity** |
