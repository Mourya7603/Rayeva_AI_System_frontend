# Rayeva AI System

> An intelligent, prompt-driven application built on a React frontend with a modular AI orchestration layer.

🔗 **Live Demo:** [rayeva-ai-system-frontend.vercel.app](https://rayeva-ai-system-frontend.vercel.app)
---

## Overview

Rayeva is an AI-powered system designed to [describe core purpose — e.g., "assist users in evaluating candidates", "automate document workflows", "provide intelligent search and recommendations"]. It combines a modern React frontend with a structured AI prompt layer to deliver consistent, high-quality responses across user interactions.

---

## Architecture Overview

### System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                     │
│                                                         │
│   ┌─────────────┐    ┌──────────────┐    ┌──────────┐  │
│   │  React UI   │───▶│  State Mgmt  │───▶│  Router  │  │
│   │  Components │    │  (Context /  │    │  (Pages) │  │
│   └─────────────┘    │   Zustand)   │    └──────────┘  │
│                       └──────┬───────┘                  │
└──────────────────────────────┼──────────────────────────┘
                               │ HTTP / WebSocket
                               ▼
┌─────────────────────────────────────────────────────────┐
│                    API Gateway / BFF                     │
│              (Next.js API Routes / Express)             │
│                                                         │
│   ┌──────────────┐    ┌──────────────┐                  │
│   │  Auth / JWT  │    │  Rate Limit  │                  │
│   └──────────────┘    └──────────────┘                  │
└──────────────────────────────┬──────────────────────────┘
                               │
              ┌────────────────┼─────────────────┐
              ▼                ▼                 ▼
┌─────────────────┐  ┌──────────────────┐  ┌──────────┐
│  AI Orchestrator│  │  Business Logic  │  │  DB /    │
│                 │  │  Services        │  │  Storage │
│  ┌───────────┐  │  └──────────────────┘  └──────────┘
│  │  Prompt   │  │
│  │  Builder  │  │
│  └─────┬─────┘  │
│        │        │
│  ┌─────▼─────┐  │
│  │  LLM API  │  │
│  │(Anthropic/│  │
│  │  OpenAI)  │  │
│  └───────────┘  │
└─────────────────┘
```

---

### Frontend Layer

The frontend is a **React single-page application** deployed on Vercel.

| Concern | Approach |
|---|---|
| Framework | React (Create React App / Next.js) |
| Styling | Tailwind CSS / CSS Modules |
| State | React Context or Zustand |
| API Communication | `fetch` / `axios` with async/await |
| Streaming Responses | `ReadableStream` / Server-Sent Events |
| Deployment | Vercel (automatic CI/CD from `main`) |

**Component Architecture:**

```
src/
├── components/
│   ├── chat/           # Conversation UI, message bubbles, input
│   ├── layout/         # Shell, sidebar, header
│   └── shared/         # Buttons, modals, loaders
├── pages/              # Route-level components
├── hooks/              # useChat, useStream, useSession
├── services/           # API client wrappers
├── prompts/            # Prompt templates (if client-side)
└── utils/              # Formatters, parsers, helpers
```

---

### AI Orchestration Layer

The AI orchestration layer sits server-side and is responsible for:

1. **Prompt assembly** — combining system instructions, user context, and conversation history into a well-formed request
2. **Model routing** — selecting the appropriate model (e.g., Claude Sonnet for speed, Opus for complex reasoning)
3. **Response parsing** — extracting structured data or streaming text back to the client
4. **Memory management** — summarizing or truncating conversation history to stay within context limits

```
Incoming Request
      │
      ▼
┌─────────────────────────────┐
│       Prompt Builder        │
│  ┌─────────────────────┐    │
│  │  System Prompt      │    │
│  │  + User Context     │    │
│  │  + History (trimmed)│    │
│  │  + Current Input    │    │
│  └─────────────────────┘    │
└────────────┬────────────────┘
             │
             ▼
      LLM API Call
             │
             ▼
┌─────────────────────────────┐
│     Response Handler        │
│  • Stream to client, OR     │
│  • Parse JSON output, OR    │
│  • Route to tool/function   │
└─────────────────────────────┘
```

---

### Backend & Data Layer

| Component | Purpose |
|---|---|
| API Routes | Thin request handlers; delegate to services |
| Session Store | Redis or DB-backed conversation history |
| Vector Store | (Optional) Semantic search for RAG patterns |
| Database | User data, preferences, audit logs |
| Object Storage | File uploads, documents fed to AI context |

---

## AI Prompt Design

### Prompt Philosophy

Rayeva's prompt design follows three core principles:

1. **Specificity over generality** — Every system prompt defines a clear role, output format, and behavioral boundaries. Vague instructions produce vague outputs.
2. **Context before instruction** — Relevant user data and session context is injected *before* the task instruction, so the model reasons with full information.
3. **Constrained output format** — Where structured data is needed, the model is explicitly instructed to return JSON with a defined schema — never free-form prose.

---

### Prompt Structure

Every prompt in Rayeva follows this layered structure:

```
┌─────────────────────────────────────────┐
│  LAYER 1 — SYSTEM PROMPT                │
│  Role definition, tone, constraints,    │
│  output format instructions             │
├─────────────────────────────────────────┤
│  LAYER 2 — CONTEXT INJECTION            │
│  User profile, session data,            │
│  retrieved documents (RAG), history     │
├─────────────────────────────────────────┤
│  LAYER 3 — TASK INSTRUCTION             │
│  The specific action for this turn      │
│  ("Summarize X", "Extract Y", etc.)     │
├─────────────────────────────────────────┤
│  LAYER 4 — OUTPUT CONSTRAINTS           │
│  "Respond only in JSON.", format spec,  │
│  length limits, language requirements   │
└─────────────────────────────────────────┘
```

---

### System Prompt Template

```
You are Rayeva, an AI assistant for [product domain].

## Role
[Describe what the assistant does and for whom.]

## Behavior
- Be concise and direct. Avoid filler phrases.
- Ask clarifying questions only when critical information is missing.
- Never make assumptions about [sensitive domain-specific data].
- If you cannot complete a task, explain clearly why and suggest an alternative.

## Output Format
[Describe expected format: plain text / markdown / JSON schema]

## Boundaries
- Do not discuss topics outside of [defined scope].
- Do not speculate about [restricted areas].
- If asked for personal opinions on [topic], redirect professionally.

## Tone
[Professional / Friendly / Neutral / Technical] — adapt to the user's level of expertise.
```

---

### Context Injection Pattern

User context is injected dynamically per request using a builder function:

```javascript
function buildPrompt({ systemPrompt, userProfile, history, documents, userMessage }) {
  const contextBlock = [
    userProfile ? `## User Context\n${formatProfile(userProfile)}` : '',
    documents?.length ? `## Relevant Documents\n${documents.map(d => d.content).join('\n\n')}` : '',
    history?.length ? `## Conversation History\n${formatHistory(history)}` : '',
  ].filter(Boolean).join('\n\n');

  return [
    { role: 'system', content: `${systemPrompt}\n\n${contextBlock}` },
    { role: 'user', content: userMessage },
  ];
}
```

**History truncation** — To avoid exceeding context limits, conversation history is trimmed with a token budget:

```javascript
function trimHistory(history, maxTokens = 4000) {
  let total = 0;
  const trimmed = [];
  for (const msg of [...history].reverse()) {
    const tokens = estimateTokens(msg.content);
    if (total + tokens > maxTokens) break;
    trimmed.unshift(msg);
    total += tokens;
  }
  return trimmed;
}
```

---

### Guardrails & Safety

| Risk | Mitigation |
|---|---|
| Prompt injection from user input | User input is always in the `user` role, never interpolated into `system` |
| Runaway verbosity | `max_tokens` cap enforced on every API call |
| Hallucinated facts | Ground responses with retrieved documents (RAG); instruct model to cite sources |
| Sensitive data leakage | PII stripped from logs; context cleared on session end |
| Off-topic responses | System prompt defines explicit scope; out-of-scope queries trigger a canned redirect |

---

## Key Design Decisions

### Why a server-side prompt builder?
Keeping prompt assembly server-side means:
- API keys are never exposed to the client
- Prompt templates can be updated without a frontend deploy
- User input is safely sandboxed in the `user` message role

### Why stream responses?
Streaming (`ReadableStream` / SSE) dramatically improves perceived responsiveness for long AI outputs. Users see tokens appear in real time rather than waiting for a full response.

### Why structured JSON output for some flows?
For flows that require downstream logic (e.g., routing, form-filling, data extraction), instructing the model to output JSON allows the application to parse and act on the result programmatically — not just display text.

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/your-org/rayeva-ai-system.git
cd rayeva-ai-system

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Add your LLM API key and other config to .env

# Run locally
npm run dev
```


---

*README generated for Rayeva AI System · Update sections marked with `[brackets]` to match your specific implementation.*
