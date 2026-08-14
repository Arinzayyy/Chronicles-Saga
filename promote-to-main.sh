#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# promote-to-main.sh — establish the new base for Chronicles Saga.
#
# WHAT THIS DOES
#   This repo currently holds two unrelated histories:
#     • origin/main   — an older vanilla-JS prototype (src/engine.js, gui.js,
#                       home.js, inbox.js). Superseded.
#     • branch Luca   — the React project with all of Season One. The real one.
#   They share no common ancestor, so they can't be merged — one has to win.
#
#   Decision (Arinze): the React project is the new base. It becomes main,
#   everyone re-clones from it, and the old branches are retired.
#
#   Steps: commit Season One -> archive the old prototype as a tag ->
#   repoint main -> create the three working branches -> retire stale branches.
#
# BEFORE RUNNING
#   If main is protected on GitHub, lift it first (Settings -> Branches),
#   then re-enable afterward.
#
# RUN FROM: the repo root, in Git Bash / WSL / any bash shell.
#   bash promote-to-main.sh
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

say()  { printf "\n\033[1;36m==> %s\033[0m\n" "$1"; }
ok()   { printf "\033[1;32m    OK: %s\033[0m\n" "$1"; }
warn() { printf "\033[1;33m    !! %s\033[0m\n" "$1"; }
die()  { printf "\n\033[1;31mABORTED: %s\033[0m\n" "$1" >&2; exit 1; }

# ── Preflight ────────────────────────────────────────────────────────────────
say "Preflight checks"

git rev-parse --git-dir >/dev/null 2>&1 || die "not inside a git repository."

REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")
case "$REMOTE_URL" in
  *Chronicles-Saga*) ok "remote is $REMOTE_URL" ;;
  "") die "no 'origin' remote configured." ;;
  *) die "unexpected remote: $REMOTE_URL (expected Chronicles-Saga)" ;;
esac

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "Luca" ]; then
  warn "you are on '$BRANCH', not 'Luca'."
  read -r -p "    Promote '$BRANCH' as the new base? [y/N] " a
  [ "${a:-N}" = "y" ] || die "stopped at your request."
fi
ok "new base will be branch '$BRANCH'"

git config user.name  >/dev/null 2>&1 || die "git user.name not set. Run: git config --global user.name 'Your Name'"
git config user.email >/dev/null 2>&1 || die "git user.email not set. Run: git config --global user.email 'you@example.com'"

say "Fetching remote state"
git fetch origin --prune
ok "fetched"

# ── 1. Commit Season One ─────────────────────────────────────────────────────
say "Step 1/6 — commit the working tree"

if [ -n "$(git status --porcelain)" ]; then
  echo "    $(git status --porcelain | wc -l) changed file(s) will be committed."
  git add -A
  git commit -m "Season One complete: Ch 8-12 integrated, endgame mechanics, docs"
  ok "committed"
else
  ok "nothing to commit — working tree already clean"
fi

git push origin "$BRANCH"
ok "pushed $BRANCH"

# ── 2. Archive the old prototype ─────────────────────────────────────────────
say "Step 2/6 — archive the old prototype main as a tag"

if git rev-parse --verify --quiet origin/main >/dev/null; then
  OLD_MAIN=$(git rev-parse origin/main)
  echo "    origin/main is currently $OLD_MAIN"
  echo "    $(git log --oneline -1 origin/main)"
  if git ls-remote --tags origin | grep -q "refs/tags/archive/prototype-main$"; then
    ok "archive tag already exists — skipping"
  else
    git push origin "origin/main:refs/tags/archive/prototype-main"
    ok "archived as tag: archive/prototype-main (recoverable forever)"
  fi
else
  OLD_MAIN=""
  warn "origin/main does not exist — nothing to archive"
fi

# ── 3. Repoint main ──────────────────────────────────────────────────────────
say "Step 3/6 — make '$BRANCH' the new main"

echo "    This replaces origin/main. The old history stays safe under the tag."
read -r -p "    Proceed? [y/N] " a
[ "${a:-N}" = "y" ] || die "stopped before rewriting main."

if [ -n "$OLD_MAIN" ]; then
  git push --force-with-lease="main:$OLD_MAIN" origin "$BRANCH:main"
else
  git push origin "$BRANCH:main"
fi
ok "origin/main is now the new base"

# ── 4. Local main ────────────────────────────────────────────────────────────
say "Step 4/6 — move your local checkout onto main"
git fetch origin
git checkout -B main origin/main
ok "local main tracking origin/main"

# ── 5. Working branches ──────────────────────────────────────────────────────
say "Step 5/6 — create the three working branches"

for b in feat/minigames feat/ui feat/ch12; do
  if git rev-parse --verify --quiet "$b" >/dev/null; then
    warn "$b already exists locally — skipping"
  else
    git branch "$b"
    ok "created $b"
  fi
done

git push -u origin feat/minigames feat/ui feat/ch12 || \
  warn "some branches may already exist on origin — that's fine"

# ── 6. Retire stale branches ─────────────────────────────────────────────────
say "Step 6/6 — retire the old branches"

echo "    Everyone starts from main now. These branches are superseded:"
echo "        origin/Luca, origin/Arinze, origin/master"
echo "    All their history is contained in the new main or the archive tag."
read -r -p "    Delete them from origin? [y/N] " a

if [ "${a:-N}" = "y" ]; then
  for b in Luca Arinze master; do
    if git ls-remote --heads origin "$b" | grep -q "$b"; then
      git push origin --delete "$b" && ok "deleted origin/$b" || warn "could not delete origin/$b"
    else
      ok "origin/$b already gone"
    fi
  done
  git fetch origin --prune
else
  ok "left them in place — clean up whenever you like"
fi

# ── Done ─────────────────────────────────────────────────────────────────────
say "Done"
cat <<'EOF'
    main is now the new base, and Vercel is building it.
    Check: https://vercel.com/arinzayyys-projects/chronicles-saga

    Branches: feat/minigames (Arinze) · feat/ui (Luca) · feat/ch12 (Ben)

    ── Send this to Ben and Luca ────────────────────────────────────────────
    Fresh start. main is now the React project with all of Season One.
    Delete your old local copy and clone again:

        git clone https://github.com/Arinzayyy/Chronicles-Saga.git
        cd Chronicles-Saga
        npm install
        npm run dev

    Then switch to your branch:  git checkout feat/ui     (Luca)
                                 git checkout feat/ch12   (Ben)

    Don't reuse your old clone — the history was replaced, so pulling
    into it will fail or make a mess.
    ─────────────────────────────────────────────────────────────────────────

    The old prototype survives at tag archive/prototype-main:
        git checkout archive/prototype-main
EOF
