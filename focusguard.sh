#!/bin/zsh
# Starts the FocusGuard AI backend and frontend together. Ctrl+C stops both.

PROJECT_DIR="${0:A:h}"
cd "$PROJECT_DIR" || exit 1

# PostgreSQL
if ! pg_isready -q; then
  echo "Starting PostgreSQL..."
  brew services start postgresql@17 >/dev/null
  for i in {1..15}; do pg_isready -q && break; sleep 1; done
  pg_isready -q || { echo "PostgreSQL did not start."; exit 1; }
fi

# Ports
for port in 8000 5173; do
  if lsof -iTCP:$port -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Port $port is already in use. Is FocusGuard already running?"
    exit 1
  fi
done

# Backend
echo "Starting backend on http://127.0.0.1:8000 ..."
./venv/bin/uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
trap 'echo "\nStopping FocusGuard..."; kill $BACKEND_PID 2>/dev/null; wait $BACKEND_PID 2>/dev/null' EXIT INT TERM

for i in {1..30}; do curl -s -o /dev/null http://127.0.0.1:8000/ && break; sleep 1; done

# Frontend (opens the browser)
echo "Starting frontend on http://localhost:5173 ..."
cd focusguard-ui && npm run dev -- --port 5173 --open
