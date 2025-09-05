#!/usr/bin/env node

const {
	readPackageJson,
	parseVersion,
	incrementPatchVersion,
} = require("./bump-version");

/**
 * Preview what the version would be after bumping
 */
function previewVersionBump() {
	console.log("🔮 Version Bump Preview");
	console.log("=".repeat(40));

	try {
		const packageData = readPackageJson();
		const currentVersion = packageData.version;

		if (!currentVersion) {
			throw new Error("No version field found in package.json");
		}

		console.log(`📦 Current version: ${currentVersion}`);

		// Validate current version format
		const parsed = parseVersion(currentVersion);
		console.log(
			`   Components: ${parsed.major}.${parsed.minor}.${parsed.patch}`,
		);

		// Calculate what the new version would be
		const newVersion = incrementPatchVersion(currentVersion);
		console.log(`⬆️  Next version: ${newVersion}`);

		console.log("\n✨ Preview completed - no changes made to package.json");

		return {
			currentVersion,
			newVersion,
			parsed,
		};
	} catch (error) {
		console.error("❌ Preview failed:");
		console.error(`   ${error.message}`);
		process.exit(1);
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
🔮 Version Bump Preview Tool

Usage: node preview-version-bump.js [options]

Options:
  -h, --help     Show this help message

Description:
  Shows what the version would be after an automatic patch bump without making any changes.
  Useful for previewing version changes before applying them.

Exit Codes:
  0 - Success
  1 - Error (invalid version, file not found, etc.)

Examples:
  node preview-version-bump.js     # Preview next version
`);
		process.exit(0);
	}

	previewVersionBump();
}

module.exports = {
	previewVersionBump,
};
