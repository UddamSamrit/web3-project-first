# 🔒 Branch Protection Guide

This guide explains how to protect your `main` branch and set up pre-commit hooks.

## 🛡️ Pre-Commit Hooks (Already Set Up)

Pre-commit hooks automatically run checks before you commit code.

### What Runs on Pre-Commit:
- ✅ **Tests**: Runs `npm test` (Hardhat tests)
- ✅ **Compilation**: Compiles all Solidity contracts
- ❌ **Blocks commit** if tests fail or contracts don't compile

### How It Works:
```bash
git add .
git commit -m "Your message"
# Pre-commit hook runs automatically
# If tests pass → commit succeeds
# If tests fail → commit is blocked
```

### To Skip Hooks (Not Recommended):
```bash
git commit --no-verify -m "Skip hooks"
```

---

## 🚫 Pre-Push Protection

Pre-push hook prevents direct pushes to `main` branch.

### What It Does:
- ✅ Allows pushes to other branches (feature branches)
- ❌ **Blocks direct pushes to `main`**
- 💡 Forces you to use Pull Requests

### How It Works:
```bash
# ✅ This works (feature branch)
git checkout -b feature/new-contract
git push origin feature/new-contract

# ❌ This is blocked (main branch)
git checkout main
git push origin main
# Error: Direct pushes to 'main' are not allowed!
```

---

## 🔐 Protecting Main Branch on GitHub

### Step 1: Go to Repository Settings
1. Open your repository on GitHub
2. Click **Settings** → **Branches**

### Step 2: Add Branch Protection Rule
1. Click **Add rule** or **Add branch protection rule**
2. In **Branch name pattern**, enter: `main`

### Step 3: Configure Protection Rules

#### Required Settings:
- ✅ **Require a pull request before merging**
  - ✅ Require approvals: `1` (or more)
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  
- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Add status checks: (optional, if you have CI/CD)

- ✅ **Require conversation resolution before merging**

- ✅ **Do not allow bypassing the above settings**
  - ✅ Even for administrators

#### Optional but Recommended:
- ✅ **Require linear history** (prevents merge commits)
- ✅ **Include administrators** (applies to everyone)
- ✅ **Restrict who can push to matching branches** (optional)

### Step 4: Save Changes
Click **Create** or **Save changes**

---

## 🔐 Protecting Main Branch on GitLab

### Step 1: Go to Repository Settings
1. Open your repository on GitLab
2. Go to **Settings** → **Repository** → **Protected branches**

### Step 2: Protect Main Branch
1. Select `main` from the branch dropdown
2. Under **Allowed to merge**, select roles (e.g., Maintainer, Developer)
3. Under **Allowed to push**, select roles (or leave empty to prevent direct pushes)
4. Click **Protect**

---

## 🔐 Protecting Main Branch on Bitbucket

### Step 1: Go to Repository Settings
1. Open your repository on Bitbucket
2. Go to **Repository settings** → **Branch permissions**

### Step 2: Add Branch Permission
1. Click **Add a restriction**
2. Select **Restrict pushes**
3. Branch pattern: `main`
4. Select who can push (or leave empty to prevent all direct pushes)
5. Click **Save**

---

## 📋 Recommended Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/add-new-contract
```

### 2. Make Changes
```bash
# Edit files
git add .
git commit -m "Add new contract"
# Pre-commit hooks run automatically
```

### 3. Push Feature Branch
```bash
git push origin feature/add-new-contract
# Pre-push hook allows this
```

### 4. Create Pull Request
- Go to GitHub/GitLab
- Create Pull Request from `feature/add-new-contract` to `main`
- Get code review
- Merge when approved

### 5. Main Branch is Protected
- ✅ No direct pushes to main
- ✅ Requires Pull Request
- ✅ Requires approval
- ✅ Tests must pass

---

## 🛠️ Manual Setup (If Needed)

### Install Husky
```bash
npm install --save-dev husky
```

### Initialize Husky
```bash
npx husky install
```

### Make Hooks Executable
```bash
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

---

## ✅ Verification

### Test Pre-Commit Hook:
```bash
# Make a change that breaks tests
# Try to commit
git add .
git commit -m "Test pre-commit"
# Should fail if tests don't pass
```

### Test Pre-Push Hook:
```bash
# Try to push to main
git checkout main
git push origin main
# Should be blocked
```

---

## 🔧 Troubleshooting

### Hooks Not Running?
```bash
# Reinstall husky
npm install --save-dev husky
npx husky install
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

### Want to Skip Hooks Temporarily?
```bash
# Skip pre-commit
git commit --no-verify -m "Skip hooks"

# Skip pre-push
git push --no-verify origin main
```

### Remove Protection?
```bash
# Remove husky hooks
rm -rf .husky
```

---

## 📚 Additional Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [GitLab Protected Branches](https://docs.gitlab.com/ee/user/project/protected_branches.html)

---

## 🎯 Summary

✅ **Pre-commit hooks**: Run tests before every commit  
✅ **Pre-push hooks**: Block direct pushes to main  
✅ **GitHub/GitLab protection**: Require Pull Requests  
✅ **Safe workflow**: Feature branches → PR → Review → Merge  

Your `main` branch is now protected! 🛡️

