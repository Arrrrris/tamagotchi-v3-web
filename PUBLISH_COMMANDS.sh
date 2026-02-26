#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: ./PUBLISH_COMMANDS.sh <github_repo_url>"
  echo "Example: ./PUBLISH_COMMANDS.sh git@github.com:yourname/tamagotchi-v3-web.git"
  exit 1
fi

REPO_URL="$1"

git remote remove origin >/dev/null 2>&1 || true
git remote add origin "$REPO_URL"
git push -u origin main

cat <<'EOF'

Push success.
Now open your GitHub repository:
Settings -> Pages
Build and deployment -> Deploy from a branch
Branch: main, Folder: /(root)

EOF
