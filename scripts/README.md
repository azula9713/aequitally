# Automated Version Bumping System

This directory contains scripts and utilities for automatically managing version numbers in the Aequitally project.

## Overview

The system automatically increments the patch version (`x.x.1`) in `package.json` whenever a pull request is merged into the main branch, while respecting manual version changes and preventing double deployments.

## How It Works

### 🔄 Workflow Process

1. **PR Created/Updated**: When a PR targeting main is opened or updated
2. **Version Check**: The system checks if `package.json` version was manually changed
3. **Auto Bump**: If no manual change is detected, it increments the patch version
4. **Commit to PR**: The version change is committed directly to the PR branch
5. **Single Deployment**: When the PR merges, it deploys once with the updated version

### 🎯 Key Benefits

- **No Double Deployments**: Version changes happen in PRs, not after merge
- **Manual Override**: Respects intentional version changes (minor/major bumps)
- **Automatic Tracking**: Every merge gets a unique version number
- **Transparent Process**: Version changes are visible in PR reviews

## Scripts

### 📦 `bump-version.js`

Main script that handles version incrementing.

```bash
# Bump patch version automatically
pnpm version:bump

# Preview what would change (dry run)
node scripts/bump-version.js --dry-run

# Show help
node scripts/bump-version.js --help
```

**Features:**
- Semantic version parsing and validation
- Automatic patch increment (`1.2.3` → `1.2.4`)
- Error handling and validation
- Dry run mode for testing

### 🔍 `check-version-changes.js`

Detects if version has been manually changed in a PR.

```bash
# Check for manual version changes
pnpm version:check

# Use in scripts (exit codes)
if pnpm version:check; then
  echo "Auto bump can proceed"
else
  echo "Manual change detected"
fi
```

**Exit Codes:**
- `0`: No manual changes (auto bump can proceed)
- `1`: Manual version change detected (skip auto bump)
- `2`: Error occurred during check

### 🔮 `preview-version-bump.js`

Shows what the next version would be without making changes.

```bash
# Preview next version
pnpm version:preview
```

**Output Example:**
```
🔮 Version Bump Preview
========================================
📦 Current version: 0.1.0
   Components: 0.1.0
⬆️  Next version: 0.1.1

✨ Preview completed - no changes made to package.json
```

### 🛠️ `utils/git-helpers.js`

Utility functions for git operations and version detection.

**Key Functions:**
- `checkForManualVersionChange()`: Compare versions between branches
- `getVersionFromRef()`: Extract version from package.json at any git reference
- `execGitCommand()`: Safe git command execution
- `validateGitState()`: Repository state validation

## GitHub Actions Integration

### Workflow File

The `.github/workflows/version-bump.yml` workflow automatically:

1. **Triggers** on PR events (opened, synchronize, reopened) targeting main
2. **Checks** for manual version changes in the PR
3. **Bumps** version if no manual changes detected
4. **Commits** the change back to the PR branch
5. **Labels** the PR with appropriate tags
6. **Comments** on the PR with version change information

### Workflow Features

- **Smart Detection**: Only runs when needed
- **Conflict Avoidance**: Respects manual version changes
- **Transparency**: Clear PR comments and labels
- **Security**: Uses GitHub's built-in tokens with minimal permissions

## Usage Examples

### 🚀 Normal Development Workflow

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make your changes and commit them
3. Create PR targeting main
4. **Automatic**: GitHub Actions detects no version change and bumps patch version
5. Review PR (now includes version bump)
6. Merge PR → Single deployment with new version

### 📈 Manual Version Bumping

For significant changes requiring minor/major version bumps:

1. Create feature branch: `git checkout -b release/v1.1.0`
2. Make your changes
3. **Manually update** package.json version: `0.1.5` → `1.1.0`
4. Commit version change
5. Create PR targeting main
6. **Automatic**: GitHub Actions detects manual change and skips auto bump
7. Merge PR → Single deployment with your chosen version

### 🧪 Testing Version Changes Locally

```bash
# Preview what next version would be
pnpm version:preview

# Check if current branch has manual version changes
pnpm version:check

# Test version bump (dry run)
node scripts/bump-version.js --dry-run

# Apply version bump locally (for testing)
pnmp version:bump
```

## Troubleshooting

### Common Issues

**1. "Not in a git repository"**
- Ensure you're in the project root directory
- Check that `.git` directory exists

**2. "Invalid version format"**
- Verify package.json has a valid semver version (e.g., "1.2.3")
- No prefixes like "v1.2.3" are allowed

**3. "Could not get version from package.json"**
- Ensure package.json exists and has a "version" field
- Check that the file is valid JSON

**4. GitHub Actions workflow not triggering**
- Verify the workflow file is in `.github/workflows/`
- Check that PR targets the main branch
- Ensure repository has Actions enabled

### 🐛 Debugging

Enable verbose output:

```bash
# Check git state
node -e "console.log(require('./scripts/utils/git-helpers').validateGitState())"

# Test version parsing
node -e "console.log(require('./scripts/bump-version').parseVersion('1.2.3'))"

# Check current branch version detection
pnpm version:check
```

## Configuration

### Environment Variables (GitHub Actions)

The workflow uses these automatically provided variables:
- `GITHUB_TOKEN`: For repository access
- `GITHUB_HEAD_REF`: PR branch name
- `GITHUB_BASE_REF`: Target branch name

### Customization

To modify the version bumping behavior:

1. **Change increment type**: Edit `incrementPatchVersion()` in `bump-version.js`
2. **Modify workflow triggers**: Update `.github/workflows/version-bump.yml`
3. **Add validation rules**: Extend `validateGitState()` in `git-helpers.js`

### Labels

The system automatically adds these labels to PRs:
- `auto-version-bump`: Applied when version was automatically bumped
- `manual-version-change`: Applied when manual version change detected

## Security Considerations

- Uses GitHub's built-in `GITHUB_TOKEN` with minimal required permissions
- No external dependencies or secrets required
- All git operations are read-only except for the version bump commit
- Automated commits are clearly identifiable in git history

## Best Practices

### For Developers

1. **Regular Features**: Let the system auto-bump patch versions
2. **Breaking Changes**: Manually bump major version (`1.x.x` → `2.0.0`)
3. **New Features**: Manually bump minor version (`1.1.x` → `1.2.0`)
4. **Review PRs**: Check that version bumps make sense in context

### For Maintainers

1. **Monitor Workflow**: Check Actions tab for any failures
2. **Label Management**: Use labels to track version change patterns
3. **Release Planning**: Use manual version bumps for planned releases
4. **Rollback Strategy**: Each version bump is a distinct commit for easy rollback

## Support

If you encounter issues with the version bumping system:

1. Check the GitHub Actions logs in the repository
2. Run local diagnostic commands shown in troubleshooting
3. Verify your git and package.json setup
4. Review recent changes to the workflow files

For system modifications or improvements, update the scripts in the `/scripts` directory and test thoroughly with the preview and dry-run modes.