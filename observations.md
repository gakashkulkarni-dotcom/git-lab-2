# Problem 1

## Query 1.1

| Query | Commits returned | Interpretation |
|---|---|---|
| main..feature-reporting | (none) | Every commit on feature-reporting is already reachable from main |
| feature-reporting..main | 7 commits: 879d678, 0eb96eb, 928f53e, 3087b30, 83cbf31, b4b93a0, 0bfe269 | main has continued to evolve after the reporting branch was merged |

Answer: An empty result from `main..feature-reporting` confirms that every commit reachable from feature-reporting is also reachable from main. The branch has been fully incorporated into main through the merge commit 928f53e, so it has no commits that main lacks. The reverse query returns 7 commits because main gained two commits before the merge (0bfe269, b4b93a0), the two feature-billing commits (83cbf31, 3087b30), both merge commits, and the .env commit (879d678).

## Query 1.2

Merge commit SHA: 928f53e (Merge branch 'feature-reporting')

| Parent | SHA | Commit message |
|---|---|---|
| ^ (first parent) | b4b93a0 | Increase export timeout |
| ^2 (second parent) | 8423755 | Add report export endpoint |

Answer: `~` always follows the first parent, which is the branch that was checked out when the merge was performed (main). From HEAD, the path is 879d678 → 0eb96eb → 928f53e → b4b93a0, so `HEAD~3` resolves to b4b93a0, the same commit as `928f53e^`. It never enters feature-reporting, because reaching the second parent requires `^2` explicitly (for example, `HEAD~2^2` resolves to 8423755).

## Query 1.3

| File | Change type (added/modified) |
|---|---|
| .env | added |
| src/billing.js | modified |
| src/cli.js | modified |
| src/export.js | modified |

Also modified: src/metrics.js, src/notifications.js, src/reports.js, test.js. Total: 8 files changed, 116 insertions(+), 28 deletions(-).

Answer: No. `git diff release-1.0 release-1.1` compares the two snapshots directly, not the commits between them. There are 13 commits separating the releases, including two merges, but the diff shows only the cumulative net difference between the two trees. The output would be identical if the same changes had been made in a single commit.

## Query 1.4

| SHA | Commit message | What changed with EXPORT_TIMEOUT |
|---|---|---|
| be2e61e | Add analytics verification test | test.js created with a check against `notifications.EXPORT_TIMEOUT !== 3000` |
| 01e32f2 | Add notification configuration | notifications.js created with `const EXPORT_TIMEOUT = 3000`; cli.js prints the value |

Answer: `-S` searches each commit's diff and returns commits where the number of occurrences of the string changes. `--grep` searches commit messages only. `git log --grep="EXPORT_TIMEOUT"` returned nothing because no commit message contains the string; it appears only in code. Commit b4b93a0 (Increase export timeout) is absent from the `-S` results because it changed the value from 3000 to 5000 without changing how many times `EXPORT_TIMEOUT` appears.

## Query 1.5

| SHA | Commit message | Author |
|---|---|---|
| 8423755 | Add report export endpoint | abh-r-27 |

Answer: Commit 8423755 introduced exportReport. `-G` matched it because its patch contains added lines that match the pattern. Running `git show 8423755` verifies this: the diff adds `function exportReport(metrics)` to src/export.js, exports it alongside exportCSV, and uses it in src/cli.js and test.js.

## Query 1.6

| Remote | Fetch refspec | What it maps |
|---|---|---|
| origin | `+refs/heads/*:refs/remotes/origin/*` | Every branch on the fork to a local remote-tracking ref `origin/<branch>` |
| upstream | `+refs/heads/*:refs/remotes/upstream/*` | Every branch on icampai/git-lab-2 to a local remote-tracking ref `upstream/<branch>` |

Answer (what the `:` separates): The `:` separates the source from the destination. In `feature-reporting:release-reporting`, the left side is the local ref being pushed (refs/heads/feature-reporting) and the right side is the ref to update on the remote (refs/heads/release-reporting).

Answer (what happened on the remote): The remote created a new branch, release-reporting (`* [new branch] feature-reporting -> release-reporting`), pointing at 8423755, the same commit as feature-reporting. No objects were transferred (`Total 0`) because the remote already had every commit. `git remote show origin` now lists release-reporting under Remote branches.

Answer (why Git doesn't sync automatically): Git updates a remote ref only when a push command or configured refspec names it. The local feature-reporting branch is configured to push to feature-reporting only, as `git remote show origin` shows under "Local refs configured for 'git push'". No configuration maps anything to release-reporting, and no local branch named release-reporting exists, so later pushes will not update it unless the refspec is given explicitly again.

# Problem 2

## Step 1

`git log --all --oneline -- .env` returned one commit: 879d678 (Placeholder env-file added). This is the commit that introduced .env, and it was the tip of both main and release-1.1.

`git show HEAD:.env` printed: `API_KEY=analytics-production-secret`

The secret was also present in dde0563 (the Problem 1 observations commit), because that commit inherited the file from its parent. `git log -- .env` lists only commits that changed the path, so it shows 879d678 alone.

## Step 2

HEAD before rewrite: dde05639fdde9d78e33120d08d17d5a7dfd2f9d8

## Step 3

filter-branch processed all 21 commits and reported 11 refs as rewritten: the 5 local branches (main, release-1.0, release-1.1, feature-billing, feature-reporting) and 6 remote-tracking refs (origin/main, origin/release-1.0, origin/release-1.1, origin/feature-billing, origin/feature-reporting, origin/release-reporting).

One warning, `Ref 'refs/remotes/origin/main' is unchanged`, appeared because origin/HEAD is a symbolic ref to origin/main. filter-branch reached origin/main a second time after it had already been rewritten.

filter-branch also saved the old refs as 11 backups under refs/original/. These still pointed to the history containing .env, so they were deleted with `git update-ref -d`. Otherwise `git log --all` would still find the secret.

Every commit SHA changed, including commits that never contained .env: the root commit went from 6845d08 to 802c0f8, and release-1.0 from be2e61e to bb1016e. filter-branch recreates each commit object, and because every commit embeds its parent's SHA, a new root commit cascades new SHAs through every descendant.

## Step 4

- `git log --all --oneline -- .env`: no output
- `git rev-parse HEAD`: 6d0d8ae18aeaf7d00d72d8ddf850964671606fc3 (differs from dde0563 in Step 2)
- `git show HEAD:.env`: `fatal: path '.env' does not exist in 'HEAD'`
- `ls -la`: no .env in the working tree (only .git, observations.md, package.json, README.md, src, test.js)

## Step 5

`git push origin --all --force` force-updated 5 branches:

- feature-billing: 3087b30 → 49796e5
- feature-reporting: 8423755 → bd27b51
- main: dde0563 → 6d0d8ae
- release-1.0: be2e61e → bb1016e
- release-1.1: 879d678 → 3b406b4

`git push origin --tags --force` printed `Everything up-to-date` (the repository has no tags).

`--all` pushes only local branches, so release-reporting (which exists only on the remote) was not updated. It was force-pushed separately with `git push origin feature-reporting:release-reporting --force` (8423755 → bd27b51).

A force-push was required because the rewritten commits are not descendants of the commits the remote held, so a normal push would be rejected as non-fast-forward.

## Step 6

- `git log --all --oneline -- .env`: no output
- `git show HEAD:.env`: `fatal: path '.env' does not exist in 'HEAD'`
- `ls -la`: no .env
- `git remote show origin`: all 6 branches present (feature-billing, feature-reporting, main, release-1.0, release-1.1, release-reporting)
