# Allocates a "slot" (1..99) per Orca worktree and offsets local ports with it, so several
# worktrees can run servers / docker stacks / tests at the same time.
# The slot is keyed by branch name in a registry shared by entourage-job-back and
# entourage-job-front: same branch name => same slot, so a front and a back worktree talk
# to each other. Set ORCA_PORT_KEY to force the key when the branch names differ.
#
# The block up to the "repo-specific" marker is identical in both repos: keep them in sync.

REGISTRY="${ORCA_PORT_REGISTRY:-$HOME/.entourage-orca-port-slots}"
LOCK="$REGISTRY.lock"

# Main checkout keeps the default ports.
if [ -n "$ORCA_ROOT_PATH" ] && [ "$(pwd -P)" = "$(cd "$ORCA_ROOT_PATH" && pwd -P)" ]; then
  echo "[orca-ports] main checkout: default ports kept"
  exit 0
fi

KEY="${ORCA_PORT_KEY:-$(git rev-parse --abbrev-ref HEAD)}"

# Cross-process lock (mkdir is atomic): lookup + allocation + append must not interleave
# between two worktree setups running at the same time (e.g. front and back together).
tries=0
until mkdir "$LOCK" 2>/dev/null; do
  tries=$((tries + 1))
  if [ "$tries" -gt 100 ]; then
    echo "[orca-ports] lock $LOCK held for 10s: assuming it is stale, taking it over" >&2
    rmdir "$LOCK" 2>/dev/null
    tries=0
  fi
  sleep 0.1
done
trap 'rmdir "$LOCK" 2>/dev/null' EXIT INT TERM

touch "$REGISTRY"
SLOT=$(awk -v k="$KEY" '$1 == k { print $2; exit }' "$REGISTRY")
if [ -z "$SLOT" ]; then
  SLOT=1
  while awk -v s="$SLOT" '$2 == s { found = 1 } END { exit !found }' "$REGISTRY"; do
    SLOT=$((SLOT + 1))
  done
  if [ "$SLOT" -gt 99 ]; then
    echo "[orca-ports] no free slot left in $REGISTRY: remove stale lines" >&2
    exit 1
  fi
  echo "$KEY $SLOT" >> "$REGISTRY"
fi

rmdir "$LOCK" 2>/dev/null
trap - EXIT INT TERM

# set_env KEY VALUE: create or replace KEY in ./.env
set_env() {
  touch .env
  # .env may lack a trailing newline: avoid gluing the new line to the last one
  [ -n "$(tail -c1 .env)" ] && echo >> .env
  if grep -q "^$1=" .env; then
    sed -i.bak "s|^$1=.*|$1=$2|" .env && rm -f .env.bak
  else
    printf '%s=%s\n' "$1" "$2" >> .env
  fi
}

FRONT_PORT=$((4000 + SLOT))
API_PORT=$((5000 + SLOT))
echo "[orca-ports] branch '$KEY' -> slot $SLOT (front $FRONT_PORT, api $API_PORT)"

# --- repo-specific ---------------------------------------------------------------
set_env PORT "$FRONT_PORT"
set_env NEXT_PUBLIC_SERVER_URL "http://localhost:$FRONT_PORT"
set_env NEXT_PUBLIC_API_URL "http://localhost:$API_PORT"
