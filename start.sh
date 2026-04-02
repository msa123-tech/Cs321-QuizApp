#!/usr/bin/env bash
# start.sh – Launch both the backend and frontend servers in one go.
# Run this from the project root: ./start.sh

set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  echo ""
  echo "Stopping servers..."
  [ -n "$BACKEND_PID" ] && kill "$BACKEND_PID" 2>/dev/null || true
  [ -n "$FRONTEND_PID" ] && kill "$FRONTEND_PID" 2>/dev/null || true
  exit 0
}
trap cleanup INT TERM

echo "================================================"
echo "  CS 321 Quiz Platform – Starting Both Servers"
echo "================================================"
echo ""

# ── Backend ──────────────────────────────────────────────────────────────────
echo "▶ Starting Spring Boot backend on http://localhost:8080 ..."
cd "$ROOT_DIR/backend"
mvn spring-boot:run &
BACKEND_PID=$!

# ── Frontend ─────────────────────────────────────────────────────────────────
echo "▶ Installing frontend dependencies (if needed) ..."
cd "$ROOT_DIR/frontend"
npm install --silent

echo "▶ Starting React/Vite frontend on http://localhost:5173 ..."
npm run dev &
FRONTEND_PID=$!

# ── Info ─────────────────────────────────────────────────────────────────────
echo ""
echo "✅ Both servers are starting up!"
echo "   Frontend → http://localhost:5173"
echo "   Backend  → http://localhost:8080"
echo "   H2 DB    → http://localhost:8080/h2-console"
echo ""
echo "Press Ctrl+C to stop both servers."
echo ""

# Monitor both processes; exit if either one dies unexpectedly
while true; do
  if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo "Backend process exited. Stopping frontend..."
    [ -n "$FRONTEND_PID" ] && kill "$FRONTEND_PID" 2>/dev/null || true
    exit 1
  fi
  if ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
    echo "Frontend process exited. Stopping backend..."
    [ -n "$BACKEND_PID" ] && kill "$BACKEND_PID" 2>/dev/null || true
    exit 1
  fi
  sleep 2
done
