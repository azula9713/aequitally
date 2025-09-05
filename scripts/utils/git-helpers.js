#!/usr/bin/env node

const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

/**
 * Execute git command and return output
 * @param {string} command - Git command to execute
 * @param {Object} options - Execution options
 * @returns {string} - Command output
 */
function execGitCommand(command, options = {}) {
	try {
		const result = execSync(command, {
			encoding: "utf8",
			stdio: "pipe",
			cwd: process.cwd(),
			...options,
		});
		return result.trim();
	} catch (error) {
		throw new Error(`Git command failed: ${command}\nError: ${error.message}`);
	}
}

/**
 * Check if we're in a git repository
 * @returns {boolean}
 */
function isGitRepository() {
	try {
		execGitCommand("git rev-parse --git-dir");
		return true;
	} catch {
		return false;
	}
}

/**
 * Get current git branch name
 * @returns {string}
 */
function getCurrentBranch() {
	return execGitCommand("git rev-parse --abbrev-ref HEAD");
}

/**
 * Get the latest commit SHA
 * @param {string} branch - Branch name (optional, defaults to current)
 * @returns {string}
 */
function getLatestCommitSha(branch = "HEAD") {
	return execGitCommand(`git rev-parse ${branch}`);
}

/**
 * Get files changed between two commits/branches
 * @param {string} base - Base commit/branch
 * @param {string} head - Head commit/branch
 * @returns {Array<string>} - Array of changed file paths
 */
function getChangedFiles(base, head = "HEAD") {
	const output = execGitCommand(`git diff --name-only ${base}...${head}`);
	return output ? output.split("\n").filter(Boolean) : [];
}

/**
 * Get file content from a specific commit/branch
 * @param {string} filePath - Path to file
 * @param {string} ref - Git reference (commit, branch, tag)
 * @returns {string} - File content
 */
function getFileContent(filePath, ref = "HEAD") {
	try {
		return execGitCommand(`git show ${ref}:${filePath}`);
	} catch (error) {
		throw new Error(
			`Failed to get file content for ${filePath} at ${ref}: ${error.message}`,
		);
	}
}

/**
 * Check if file exists in a specific commit/branch
 * @param {string} filePath - Path to file
 * @param {string} ref - Git reference
 * @returns {boolean}
 */
function fileExistsInRef(filePath, ref) {
	try {
		execGitCommand(`git cat-file -e ${ref}:${filePath}`);
		return true;
	} catch {
		return false;
	}
}

/**
 * Get version from package.json at a specific git reference
 * @param {string} ref - Git reference (branch, commit, tag)
 * @returns {string|null} - Version string or null if not found
 */
function getVersionFromRef(ref = "HEAD") {
	try {
		const packageJsonContent = getFileContent("package.json", ref);
		const packageData = JSON.parse(packageJsonContent);
		return packageData.version || null;
	} catch (error) {
		console.warn(
			`Could not get version from package.json at ${ref}: ${error.message}`,
		);
		return null;
	}
}

/**
 * Check if package.json version has been manually changed in PR
 * @param {string} baseBranch - Base branch (usually 'main')
 * @param {string} headBranch - PR head branch (optional, defaults to current)
 * @returns {Object} - {hasManualChange, baseVersion, headVersion}
 */
function checkForManualVersionChange(
	baseBranch = "origin/main",
	headBranch = "HEAD",
) {
	if (!isGitRepository()) {
		throw new Error("Not in a git repository");
	}

	const baseVersion = getVersionFromRef(baseBranch);
	const headVersion = getVersionFromRef(headBranch);

	if (!baseVersion) {
		throw new Error(`Could not find version in package.json at ${baseBranch}`);
	}

	if (!headVersion) {
		throw new Error(`Could not find version in package.json at ${headBranch}`);
	}

	const hasManualChange = baseVersion !== headVersion;

	return {
		hasManualChange,
		baseVersion,
		headVersion,
		baseBranch,
		headBranch,
	};
}

/**
 * Check if there are uncommitted changes
 * @returns {boolean}
 */
function hasUncommittedChanges() {
	try {
		const status = execGitCommand("git status --porcelain");
		return status.length > 0;
	} catch {
		return false;
	}
}

/**
 * Stage and commit changes
 * @param {Array<string>} files - Files to stage
 * @param {string} message - Commit message
 * @param {Object} options - Additional options
 */
function stageAndCommit(files, message, options = {}) {
	if (!Array.isArray(files) || files.length === 0) {
		throw new Error("Must provide at least one file to stage");
	}

	if (!message || typeof message !== "string") {
		throw new Error("Commit message is required");
	}

	try {
		// Stage files
		const fileList = files.join(" ");
		execGitCommand(`git add ${fileList}`);

		// Commit with message
		let commitCommand = `git commit -m "${message}"`;
		if (options.allowEmpty) {
			commitCommand += " --allow-empty";
		}

		execGitCommand(commitCommand);

		console.log(`✅ Committed changes: ${message}`);
		return true;
	} catch (error) {
		throw new Error(`Failed to stage and commit: ${error.message}`);
	}
}

/**
 * Push changes to remote
 * @param {string} remote - Remote name (default: origin)
 * @param {string} branch - Branch name (default: current branch)
 */
function pushToRemote(remote = "origin", branch = null) {
	if (!branch) {
		branch = getCurrentBranch();
	}

	try {
		execGitCommand(`git push ${remote} ${branch}`);
		console.log(`✅ Pushed changes to ${remote}/${branch}`);
		return true;
	} catch (error) {
		throw new Error(`Failed to push to ${remote}/${branch}: ${error.message}`);
	}
}

/**
 * Get commit information
 * @param {string} ref - Git reference
 * @returns {Object} - Commit info {sha, message, author, date}
 */
function getCommitInfo(ref = "HEAD") {
	try {
		const sha = execGitCommand(`git rev-parse ${ref}`);
		const message = execGitCommand(`git log -1 --pretty=format:%s ${ref}`);
		const author = execGitCommand(`git log -1 --pretty=format:%an ${ref}`);
		const date = execGitCommand(`git log -1 --pretty=format:%ci ${ref}`);

		return {
			sha,
			message,
			author,
			date: new Date(date),
		};
	} catch (error) {
		throw new Error(`Failed to get commit info for ${ref}: ${error.message}`);
	}
}

/**
 * Validate git repository state for version bumping
 * @returns {Object} - Validation result
 */
function validateGitState() {
	const issues = [];
	const warnings = [];

	// Check if in git repository
	if (!isGitRepository()) {
		issues.push("Not in a git repository");
	} else {
		// Check for uncommitted changes
		if (hasUncommittedChanges()) {
			warnings.push("There are uncommitted changes in the repository");
		}

		// Check if package.json exists
		if (!fs.existsSync(path.join(process.cwd(), "package.json"))) {
			issues.push("package.json not found in current directory");
		}
	}

	return {
		isValid: issues.length === 0,
		issues,
		warnings,
	};
}

module.exports = {
	execGitCommand,
	isGitRepository,
	getCurrentBranch,
	getLatestCommitSha,
	getChangedFiles,
	getFileContent,
	fileExistsInRef,
	getVersionFromRef,
	checkForManualVersionChange,
	hasUncommittedChanges,
	stageAndCommit,
	pushToRemote,
	getCommitInfo,
	validateGitState,
};
