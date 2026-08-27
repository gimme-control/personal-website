#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

if [ ! -d scripts/node_modules ]; then
    echo "Installing dependencies (first time only)..."
    (cd scripts && npm install --silent)
fi

echo "Building blog from posts/..."
(cd scripts && npm run build)

PORT="${PORT:-8000}"
echo ""
echo "Site running at http://localhost:${PORT}"
echo "  Home:  http://localhost:${PORT}/"
echo "  Blog:  http://localhost:${PORT}/blog/"
echo ""
echo "Press Ctrl+C to stop."
python3 -m http.server "$PORT"
