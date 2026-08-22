#!/bin/bash
# Deploy this repo to the live site over rsync/SSH.
#
# Usage:
#   ./deploy.sh            deploy for real
#   ./deploy.sh --dry-run  show what would change, without uploading or deleting anything
#
# First-time setup:
#   1. cp deploy.conf.example deploy.conf   (deploy.conf is git-ignored -- fill in your real values)
#   2. ssh-copy-id -p <port> user@host      (recommended, avoids typing your password every run)
#
# What gets uploaded is controlled by deploy-allowlist.txt, not by excluding
# known-bad files -- only what's explicitly listed there ever leaves this
# machine. Add new top-level site content there when you add it to the repo.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/deploy.conf"
ALLOWLIST_FILE="${SCRIPT_DIR}/deploy-allowlist.txt"

if [[ ! -f "${CONFIG_FILE}" ]]; then
  echo "Missing ${CONFIG_FILE}." >&2
  echo "Run: cp deploy.conf.example deploy.conf, then fill in your values." >&2
  exit 1
fi

# shellcheck source=/dev/null
source "${CONFIG_FILE}"

for var in SSH_HOST SSH_PORT SSH_USER REMOTE_PATH; do
  if [[ -z "${!var:-}" ]]; then
    echo "deploy.conf is missing a value for ${var}." >&2
    exit 1
  fi
done

if [[ ! -f "${ALLOWLIST_FILE}" ]]; then
  echo "Missing ${ALLOWLIST_FILE}." >&2
  exit 1
fi

RSYNC_FLAGS=(-avz --delete)

if [[ "${1:-}" == "--dry-run" || "${1:-}" == "-n" ]]; then
  RSYNC_FLAGS+=(--dry-run)
  echo "== DRY RUN: no files will be uploaded or deleted =="
fi

# Build the source list from the allowlist, skipping blank lines and comments.
SOURCES=()
while IFS= read -r line; do
  line="${line%%#*}"                  # strip trailing comments
  line="$(echo -n "${line}" | xargs)"  # trim whitespace
  [[ -z "${line}" ]] && continue
  path="${SCRIPT_DIR}/${line}"
  if [[ ! -e "${path}" ]]; then
    echo "Warning: ${line} is in deploy-allowlist.txt but doesn't exist locally -- skipping." >&2
    continue
  fi
  SOURCES+=("${path}")
done < "${ALLOWLIST_FILE}"

if [[ ${#SOURCES[@]} -eq 0 ]]; then
  echo "Nothing to deploy -- deploy-allowlist.txt resolved to zero existing paths." >&2
  exit 1
fi

rsync "${RSYNC_FLAGS[@]}" \
  -e "ssh -p ${SSH_PORT}" \
  "${SOURCES[@]}" \
  "${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}"

# The server sends a 7-day Cache-Control on css/js, so browsers (and any
# CDN in front of the host) that already fetched css/style.css or
# js/index.js once will keep serving that exact copy for up to a week,
# even after this deploy replaces the file on disk -- unless the URL
# itself changes. Rewrite the ?v= cache-busting query string on every
# deploy so it always changes when the content does; this operates on a
# generated copy, not the git-tracked index.html, so the committed file
# never carries deploy-time cruft.
VERSION="$(cat "${SCRIPT_DIR}/js/index.js" "${SCRIPT_DIR}/css/style.css" | md5sum | cut -c1-10)"
TMP_INDEX="$(mktemp)"
trap 'rm -f "${TMP_INDEX}"' EXIT
sed -E \
  -e "s#\"(css/style\.css)(\?v=[^\"]*)?\"#\"\1?v=${VERSION}\"#g" \
  -e "s#\"(js/index\.js)(\?v=[^\"]*)?\"#\"\1?v=${VERSION}\"#g" \
  "${SCRIPT_DIR}/index.html" > "${TMP_INDEX}"

rsync "${RSYNC_FLAGS[@]}" \
  -e "ssh -p ${SSH_PORT}" \
  "${TMP_INDEX}" \
  "${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}index.html"

echo "Deployed with cache-busting version ${VERSION}"
echo "Done -- https://roy.deliberatelearners.com"
