# Git Command Cheat Sheet — playtanchanmay

Repository: `https://github.com/dwd-area/playtanchanmay`

## 1. Initial Setup

```powershell
# Navigate to project
cd "D:\222\DucT04\10011010\_special\ace_t12\playtanchanmay"

# Check current Git identity
git config user.name
git config user.email

# Configure identity for this repository only
git config user.name "dwd-area"
git config user.email "duongduc4w@gmail.com"

# Check remote repository
git remote -v
```

## 2. Daily Workflow

```powershell
# Check changed files
git status

# View changes
git diff

# Stage all changes
git add .

# Commit changes
git commit -m "Describe your changes"

# Push changes to GitHub
git push
```

## 3. Pull Latest Changes

```powershell
# Download and integrate latest changes
git pull

# Fetch changes without merging
git fetch

# View recent commits
git log --oneline -10
```

## 4. Branch Management

```powershell
# List local branches
git branch

# Create a new branch
git branch feature-name

# Create and switch to a new branch
git switch -c feature-name

# Switch branches
git switch main

# Push a new branch to GitHub
git push -u origin feature-name

# Delete a local branch
git branch -d feature-name

# Delete a remote branch
git push origin --delete feature-name
```

## 5. Undo Changes

```powershell
# Discard changes in one unstaged file
git restore filename

# Unstage a file
git restore --staged filename

# Undo the latest commit but keep changes staged
git reset --soft HEAD~1

# Undo the latest commit but keep changes unstaged
git reset HEAD~1

# Safely reverse a previous commit
git revert COMMIT_ID
```

**Warning:** `git reset --hard` permanently discards uncommitted changes. Use it only when you are certain.

## 6. Inspect History and Changes

```powershell
# Show commit history
git log --oneline

# Show detailed commit history
git log --oneline --graph --all

# Show changes in the latest commit
git show

# Compare working directory with latest commit
git diff

# Compare staged changes
git diff --cached
```

## 7. Remote Repository Management

```powershell
# Check remote URLs
git remote -v

# Add remote
git remote add origin https://github.com/dwd-area/playtanchanmay.git

# Change remote URL
git remote set-url origin https://github.com/dwd-area/playtanchanmay.git

# Fetch remote information
git fetch origin

# Push main branch
git push -u origin main
```

## 8. GitHub Authentication

```powershell
# Check Git Credential Manager version
git credential-manager --version

# Clear saved GitHub HTTPS credentials
"protocol=https`nhost=github.com`n" | git credential-manager erase

# Trigger authentication when accessing GitHub
git fetch origin
```

Git commit identity (`user.name`, `user.email`) and GitHub authentication are separate.

## 9. Recommended Daily Routine

Use this sequence whenever you finish working:

```powershell
git status
git add .
git commit -m "Your commit message"
git pull --rebase origin main
git push
```

If you have already pulled the latest changes before working, you can usually just commit and push.

## 10. Useful Commit Message Examples

```text
feat: add multiplayer game room
feat: implement user authentication
fix: resolve room synchronization issue
fix: correct game scoring logic
refactor: reorganize game components
style: improve responsive UI
docs: update README
chore: update dependencies
```

## Important Notes

- Always check `git status` before committing.
- Never commit `.env` files containing secrets.
- Keep `node_modules/` out of Git.
- Pull remote changes before pushing if other contributors are working on the repository.
- Avoid `git push --force` on shared branches.
- Commit small, logically grouped changes.
- Use `main` as the stable branch.