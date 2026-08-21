#!/bin/bash
# Deploy this repo to roy.deliberatelearners.com over rsync/SSH.
#
# Usage:
#   ./deploy.sh            deploy for real
#   ./deploy.sh --dry-run  show what would change, without uploading or deleting anything
#
# First-time setup (recommended, avoids typing your password every run):
#   ssh-copy-id -p 65002 u484085192@195.35.15.248

set -euo pipefail

SSH_HOST="195.35.15.248"
SSH_PORT="65002"
SSH_USER="u484085192"
REMOTE_PATH="/home/u484085192/domains/roy.deliberatelearners.com/public_html/"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCAL_PATH="${SCRIPT_DIR}/"

RSYNC_FLAGS=(-avz --delete)

if [[ "${1:-}" == "--dry-run" || "${1:-}" == "-n" ]]; then
  RSYNC_FLAGS+=(--dry-run)
  echo "== DRY RUN: no files will be uploaded or deleted =="
fi

rsync "${RSYNC_FLAGS[@]}" \
  -e "ssh -p ${SSH_PORT}" \
  --exclude='.git/' \
  --exclude='.gitignore' \
  --exclude='deploy.sh' \
  --exclude='documentation/' \
  --exclude='color_chooser.py' \
  --exclude='color_sucker.py' \
  --exclude='colors.txt' \
  --exclude='optimization-guide.md' \
  --exclude='optimization-progress.md' \
  --exclude='.vscode/' \
  --exclude='claude_resume_command.txt' \
  "${LOCAL_PATH}" "${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}"

echo "Done -- https://roy.deliberatelearners.com"
