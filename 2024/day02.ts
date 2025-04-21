import { getInput } from "../fetchInput.mts";

const input = await getInput(2024, 2);

function getReports() {
	const reports: number[][] = [];

	input.split("\n").forEach((line) => {
		reports.push(line.split(" ").map(Number));
	});

	return reports;
}

function part1(reports: number[][]): number {
	function isSafe(report: number[]) {
		const isDecreasing = report[0] > report[1];

		function checkRule(a: number, b: number) {
			return (
				Math.abs(a - b) < 1 ||
				Math.abs(a - b) > 3 ||
				(isDecreasing && a <= b) ||
				(!isDecreasing && a >= b)
			);
		}

		for (let i = 0; i < report.length - 1; i++) {
			if (checkRule(report[i], report[i + 1])) return false;
		}

		return true;
	}

	let safeCount = 0;
	reports.forEach((report) => {
		safeCount += isSafe(report) ? 1 : 0;
	});

	return safeCount;
}

function part2(reports: number[][]): number {
	function isSafe(report: number[]): boolean {
		const isDecreasing = report[0] > report[1];

		function checkRule(a: number, b: number) {
			return (
				Math.abs(a - b) < 1 ||
				Math.abs(a - b) > 3 ||
				(isDecreasing && a <= b) ||
				(!isDecreasing && a >= b)
			);
		}

		let canTolerate = true;

		for (let i = 0; i < report.length - 1; i++) {
			if (checkRule(report[i], report[i + 1])) {
				if (
					canTolerate &&
					(checkRule(report[i - 1], report[i + 1]) ||
						checkRule(report[i], report[i + 2]))
				) {
					canTolerate = false;
				} else {
					return false;
				}
			}
		}

		return true;
	}

	let safeCount = 0;
	reports.forEach((report) => {
		safeCount += isSafe(report) ? 1 : 0;
	});

	return safeCount;
}

const reports = getReports();
console.log("Part 1:", part1(reports));
console.log("Part 2:", part2(reports));
