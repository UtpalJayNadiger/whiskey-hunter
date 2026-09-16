#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
read -r -s -p "Exa API key (hidden): " whiskey_exa_key
printf '\n'
if [ -z "$whiskey_exa_key" ]; then echo 'No key supplied.' >&2; exit 1; fi
printf '%s' "$whiskey_exa_key" | npx opencomputer secrets set EXA_API_KEY --value-stdin --environment development
unset whiskey_exa_key
