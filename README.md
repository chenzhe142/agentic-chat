# Agentic Streaming Chat Web UI

A streaming chat web UI for an agentic RAG assistant — renders responses token-by-token over SSE, backed by the [agentic-rag](https://github.com/chenzhe142/agentic-rag) server.

## Getting Started

Start server on [http://localhost:3000](http://localhost:3000)

```bash
pnpm dev
```

## Routes
```
/          - landing page
/chat/[id] - streaming chat UI
```

## To use agentic-rag repo API server

agentic-chat project is specifically built to connect with [agentic-rag](https://github.com/chenzhe142/agentic-rag) repo's API server.

To establish the connection locally, load `qwen2.5:7b` model via `ollama` on your laptop first.
```shell
ollama run qwen2.5:7b
```

You should see something like this in terminal:
```
➜  ~ ollama run qwen2.5:7b
>>> Send a message (/? for help)
```

Next, clone [agentic-rag](https://github.com/chenzhe142/agentic-rag) repo, and launch the following servers locally.

In `agentic-rag/`, run
```shell
# mcp server
uv run -m mcp_server.server

# fastapi streaming chat server
fastapi dev --entrypoint api.server:app --port 8001
```