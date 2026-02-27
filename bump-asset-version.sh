#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./bump-asset-version.sh
#   ./bump-asset-version.sh 2026.02.27.2
#
# Without argument, uses current local time: YYYY.MM.DD.HHMMSS

VERSION="${1:-$(date '+%Y.%m.%d.%H%M%S')}"
INDEX_FILE="index.html"

if [[ ! -f "$INDEX_FILE" ]]; then
  echo "Error: cannot find ${INDEX_FILE} in current directory."
  exit 1
fi

python3 - "$INDEX_FILE" "$VERSION" <<'PY'
import re
import sys

index_file = sys.argv[1]
version = sys.argv[2]

with open(index_file, "r", encoding="utf-8") as f:
    content = f.read()

updated, count = re.subn(
    r'(<meta\s+name="asset-version"\s+content=")[^"]+(")',
    rf"\g<1>{version}\2",
    content,
    count=1
)

if count != 1:
    print('Error: <meta name="asset-version" ...> not found or duplicated in index.html')
    sys.exit(1)

with open(index_file, "w", encoding="utf-8") as f:
    f.write(updated)

print(f"Updated asset version -> {version}")
PY
