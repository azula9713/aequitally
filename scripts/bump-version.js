#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

/**
 * Parse semantic version string into components
 * @param {string} version - Version string (e.g., "1.2.3")
 * @returns {Object} - {major, minor, patch}
 */
function parseVersion(version) {
	const cleanVersion = version.replace(/^v/, ""); // Remove 'v' prefix if present
	const parts = cleanVersion.split(".");

	if (parts.length !== 3) {
		throw new Error(
			`Invalid version format: ${version}. Expected format: x.y.z`,
		);
	}

	const [major, minor, patch] = parts.map((part) => {
		const num = parseInt(part, 10);
		if (Number.isNaN(num) || num < 0) {
			throw new Error(
				`Invalid version component: ${part}. Must be a non-negative integer.`,
			);
		}
		return num;
	});

	return { major, minor, patch };
}

/**
 * Format version components into semantic version string
 * @param {Object} version - {major, minor, patch}
 * @returns {string} - Formatted version string
 */
function formatVersion({ major, minor, patch }) {
	return `${major}.${minor}.${patch}`;
}

/**
 * Increment patch version
 * @param {string} currentVersion - Current version string
 * @returns {string} - New version string with incremented patch
 */
function incrementPatchVersion(currentVersion) {
	const parsed = parseVersion(currentVersion);
	parsed.patch += 1;
	return formatVersion(parsed);
}

/**
 * Read package.json and return parsed content
 * @returns {Object} - Parsed package.json content
 */
function readPackageJson() {
	const packageJsonPath = path.join(process.cwd(), "package.json");

	if (!fs.existsSync(packageJsonPath)) {
		throw new Error("package.json not found in current directory");
	}

	try {
		const content = fs.readFileSync(packageJsonPath, "utf8");
		return JSON.parse(content);
	} catch (error) {
		throw new Error(`Failed to read or parse package.json: ${error.message}`);
	}
}

/**
 * Write updated package.json content
 * @param {Object} packageData - Updated package.json content
 */
function writePackageJson(packageData) {
	const packageJsonPath = path.join(process.cwd(), "package.json");

	try {
		const content = `${JSON.stringify(packageData, null, 2)}\n`;
		fs.writeFileSync(packageJsonPath, content, "utf8");
	} catch (error) {
		throw new Error(`Failed to write package.json: ${error.message}`);
	}
}

/**
 * Main function to bump version
 */
function bumpVersion() {
	try {
		console.log("🚀 Starting automatic version bump...");

		// Read current package.json
		const packageData = readPackageJson();
		const currentVersion = packageData.version;

		if (!currentVersion) {
			throw new Error("No version field found in package.json");
		}

		console.log(`📦 Current version: ${currentVersion}`);

		// Validate current version format
		parseVersion(currentVersion); // This will throw if invalid

		// Calculate new version
		const newVersion = incrementPatchVersion(currentVersion);
		console.log(`⬆️  Bumping to: ${newVersion}`);

		// Update package.json
		packageData.version = newVersion;
		writePackageJson(packageData);

		console.log("✅ Version bump completed successfully!");
		console.log(`📊 Version changed: ${currentVersion} → ${newVersion}`);

		// Return success for programmatic usage
		return {
			success: true,
			previousVersion: currentVersion,
			newVersion: newVersion,
		};
	} catch (error) {
		console.error("❌ Version bump failed:");
		console.error(`   ${error.message}`);

		// Exit with error code for CI/CD
		process.exit(1);
	}
}

/**
 * CLI execution
 */
if (require.main === module) {
	// Parse command line arguments
	const args = process.argv.slice(2);
	const help = args.includes("--help") || args.includes("-h");

	if (help) {
		console.log(`
📦 Automatic Version Bump Tool

Usage: node bump-version.js [options]

Options:
  -h, --help     Show this help message
  --dry-run      Show what would be changed without making changes
  --preview      Alias for --dry-run

Description:
  Automatically increments the patch version (x.y.z → x.y.z+1) in package.json.
  Follows semantic versioning standards and validates version format.

Examples:
  node bump-version.js           # Bump patch version
  node bump-version.js --dry-run # Preview changes without applying
  
Exit Codes:
  0 - Success
  1 - Error (invalid version, file not found, etc.)
`);
		process.exit(0);
	}

	const dryRun = args.includes("--dry-run") || args.includes("--preview");

	if (dryRun) {
		try {
			const packageData = readPackageJson();
			const currentVersion = packageData.version;
			const newVersion = incrementPatchVersion(currentVersion);

			console.log("🔍 Dry run mode - no changes will be made");
			console.log(`📦 Current version: ${currentVersion}`);
			console.log(`⬆️  Would bump to: ${newVersion}`);
			console.log("✅ Dry run completed");
		} catch (error) {
			console.error("❌ Dry run failed:");
			console.error(`   ${error.message}`);
			process.exit(1);
		}
	} else {
		bumpVersion();
	}
}

// Export functions for testing and programmatic usage
module.exports = {
	parseVersion,
	formatVersion,
	incrementPatchVersion,
	bumpVersion,
	readPackageJson,
	writePackageJson,
};
