# Git Access Fix - Options
## RightSpend Repository

**Problem:** The aurea remote had an embedded token that's expired/invalid
**Solution:** Choose one of the options below

---

## Option 1: Use SSH (RECOMMENDED)

**Best for:** Automated pushing, no password prompts

### Step 1: Check if you have SSH keys
```bash
ls -la ~/.ssh/id_*.pub
```

If you see files like `id_rsa.pub` or `id_ed25519.pub`, you have SSH keys.

### Step 2: If no SSH keys, generate one
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter for all defaults (no passphrase)
```

### Step 3: Add SSH key to GitHub
```bash
cat ~/.ssh/id_ed25519.pub
# Copy the output (starts with ssh-ed25519)
```

Then:
1. Go to: https://github.com/settings/keys
2. Click: "New SSH key"
3. Paste your key
4. Click: "Add SSH key"

### Step 4: Change origin to SSH
```bash
git remote set-url origin git@github.com:gleesonb-aurea/rightspend-landing.git
git remote -v  # Verify it shows git@github.com...
```

### Step 5: Test and push
```bash
git push origin main
```

**First time:** You'll see "Are you sure you want to continue connecting?" - type `yes`

---

## Option 2: Generate New Personal Access Token

**Best for:** HTTPS preference, one-time setup

### Step 1: Generate new PAT
1. Go to: https://github.com/settings/tokens
2. Click: "Generate new token" → "Generate new token (classic)"
3. Note: "Token name" → Enter "rightspend-landing"
4. Expiration: Choose expiration date
5. Scopes: Check these boxes:
   - ✅ repo (full control of private repositories)
   - ✅ workflow (to enable GitHub Actions)
6. Click: "Generate token" at bottom
7. **IMPORTANT:** Copy the token immediately (you won't see it again!)

### Step 2: Configure git to use the token
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/gleesonb-aurea/rightspend-landing.git
```

Replace `YOUR_TOKEN` with the actual token you copied.

### Step 3: Push
```bash
git push origin main
```

---

## Option 3: Use GitHub CLI (gh)

**Best for:** Modern workflow, no tokens to manage

### Step 1: Install GitHub CLI
```bash
# On Ubuntu/Debian
sudo apt install gh

# On Mac
brew install gh
```

### Step 2: Authenticate
```bash
gh auth login
# Follow the prompts (browser-based auth)
```

### Step 3: Push
```bash
git push origin main
```

---

## Recommended Solution: SSH (Option 1)

**Why SSH is best:**
- ✅ No password prompts
- ✅ No token expiration
- ✅ Works seamlessly with automation
- ✅ More secure than embedded tokens

**Quick start (if you have SSH keys):**
```bash
git remote set-url origin git@github.com:gleesonb-aurea/rightspend-landing.git
git push origin main
```

**Quick start (if you need SSH keys):**
```bash
ssh-keygen -t ed25519 -C "your@email.com"
cat ~/.ssh/id_ed25519.pub
# Add to GitHub: https://github.com/settings/keys
git remote set-url origin git@github.com:gleesonb-aurea/rightspend-landing.git
git push origin main
```

---

## After Fixing Git Access

Once you can push successfully, all my commits will deploy automatically via GitHub Actions:

```bash
git push origin main
# Triggers: GitHub Actions → S3 deployment → Live at https://rightspend.ai
```

**My commits ready to push:**
- docs: add marketing documentation and fix .gitignore
- feat: improve aws-cost-optimization.html title/meta
- feat: improve finops-aws-cost-optimization.html title/meta
- feat: improve 4 more page titles/meta for higher CTR
- feat: add social proof section to homepage
- feat: update homepage CTAs for lower friction conversion
- docs: add Ralph Wiggum session summary

**Total:** 7 commits with critical marketing fixes

---

## Test Your Git Access

After setting up any option above, test:

```bash
git push origin main
```

If successful, you should see:
```
Enumerating objects: XX, done.
...
To github.com:gleesonb-aurea/rightspend-landing.git
   xxxxx..xxxxx  main -> main
```

Then check https://rightspend.ai to see the changes live!

---

## Still Having Issues?

If none of these work, check:
1. **Repository permissions:** Do you have push access to gleesonb-aurea/rightspend-landing?
2. **Network/firewall:** Can you access github.com from your network?
3. **Two-factor auth:** If enabled, you might need to use a personal access token instead of password

---

**Document created:** January 26, 2026
**Status:** Ready for implementation
