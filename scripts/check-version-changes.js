#!/usr/bin/env node

/** biome-ignore-all lint/suspicious/useIterableCallbackReturn: <Just a JS file> */

const {
	checkForManualVersionChange,
	validateGitState,
} = require("./utils/git-helpers");

/**
 * Check if version has been manually changed in the current branch
 */
function checkVersionChanges() {
	console.log("🔍 Checking for version changes...");

	// Validate git state
	const validation = validateGitState();
	if (!validation.isValid) {
		console.error("❌ Git validation failed:");
		validation.issues.forEach((issue) => console.error(`   - ${issue}`));
		process.exit(1);
	}

	if (validation.warnings.length > 0) {
		console.warn("⚠️  Warnings:");
		validation.warnings.forEach((warning) => console.warn(`   - ${warning}`));
	}

	try {
		const result = checkForManualVersionChange();

		console.log(
			`📦 Base version (${result.baseBranch}): ${result.baseVersion}`,
		);
		console.log(
			`📦 Head version (${result.headBranch}): ${result.headVersion}`,
		);

		if (result.hasManualChange) {
			console.log("✅ Manual version change detected");
			console.log(
				`   Changed from ${result.baseVersion} to ${result.headVersion}`,
			);

			// Exit with code 1 to indicate manual change (for CI scripts)
			process.exit(1);
		} else {
			console.log("ℹ️  No version changes detected - auto bump can proceed");
			process.exit(0);
		}
	} catch (error) {
		console.error("❌ Failed to check version changes:");
		console.error(`   ${error.message}`);
		process.exit(2);
	}
}

/**
 * CLI execution
 */
if (require.main === module) {
	const args = process.argv.slice(2);
	const help = args.includes("--help") || args.includes("-h");

	if (help) {
		console.log(`
🔍 Version Change Detector

Usage: node check-version-changes.js [options]

Options:
  -h, --help     Show this help message

Description:
  Checks if package.json version has been manually changed compared to the base branch.
  Useful for CI/CD scripts to determine if automatic version bumping should be skipped.

Exit Codes:
  0 - No version change detected (auto bump can proceed)
  1 - Manual version change detected (skip auto bump)
  2 - Error occurred during check

Examples:
  node check-version-changes.js           # Check for version changes
  
  # Usage in CI scripts:
  if node check-version-changes.js; then
    echo "Auto bump can proceed"
  else
    echo "Manual version change detected, skipping auto bump"
  fi
`);
		process.exit(0);
	}

	checkVersionChanges();
}

module.exports = {
	checkVersionChanges,
};
