// Test file for pre-commit formatting
const test = "unformatted    code";

function badlyFormatted(param1: string, param2: number) {
	return {
		message: test,
		data: param1 + param2,
	};
}

export { badlyFormatted };
