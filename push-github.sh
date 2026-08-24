#!/bin/bash
# Publish HEAD to the public `github` remote, with paths listed in
# .githubignore stripped out of the pushed tree.
#
# This never touches your working files or your real staging area, and it
# never touches `origin` (gitbox) -- origin always gets the full repo via a
# plain `git push origin main`. This script only changes what the public
# GitHub repo sees.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXCLUDE_FILE="${SCRIPT_DIR}/.githubignore"
REMOTE="github"
BRANCH="main"

git fetch -q "${REMOTE}" "${BRANCH}" || true
PARENT="$(git rev-parse "${REMOTE}/${BRANCH}" 2>/dev/null || true)"

TMP_INDEX="$(mktemp)"
trap 'rm -f "${TMP_INDEX}"' EXIT
export GIT_INDEX_FILE="${TMP_INDEX}"

git read-tree HEAD

EXCLUDED=()
if [[ -f "${EXCLUDE_FILE}" ]]; then
  while IFS= read -r line; do
    line="${line%%#*}"
    path="$(echo -n "${line}" | xargs)"
    [[ -z "${path}" ]] && continue
    git rm -r --cached --ignore-unmatch -q -- "${path}"
    EXCLUDED+=("${path}")
  done < "${EXCLUDE_FILE}"
fi

TREE="$(git write-tree)"
unset GIT_INDEX_FILE

MSG="$(git log -1 --pretty=%B HEAD)"
if [[ -n "${PARENT}" ]]; then
  COMMIT="$(git commit-tree "${TREE}" -p "${PARENT}" -m "${MSG}")"
else
  COMMIT="$(git commit-tree "${TREE}" -m "${MSG}")"
fi

git push "${REMOTE}" "${COMMIT}:${BRANCH}"
echo "Published to ${REMOTE}/${BRANCH} -- excluded: ${EXCLUDED[*]:-none}"
