import { getInput } from "../fetchInput.mts";

const input = await getInput(2024, 4);

function getMatrix(): string[][] {
	const matrix: string[][] = input.split("\n").map((line) => {
		const row = line.split("").map((char) => char);
		return row;
	});

	return matrix;
}

function part1(): number {
	const XMAS = "XMAS";
	const LEN = "XMAS".length;

	const matrix = getMatrix();
	const width = matrix[0].length;
	const height = matrix.length;

	function checkHorizontal(x: number, y: number): boolean {
		const word = matrix[y].slice(x, Math.min(width, x + LEN));
		const forward = word.join("");
		const reverse = [...word].reverse().join("");

		return forward === XMAS || reverse === XMAS;
	}

	function checkVertical(x: number, y: number): boolean {
		const word = matrix
			.map((row) => row[x])
			.slice(y, Math.min(height, y + LEN));
		const forward = word.join("");
		const reverse = [...word].reverse().join("");

		return forward === XMAS || reverse === XMAS;
	}

	function checkDiagonalRight(x: number, y: number): boolean {
		const word = matrix
			.map(
				(row, r) =>
					row.filter((_, c) => {
						return r - c === y - x;
					})[0]
			)
			.slice(y, Math.min(height, y + LEN));
		const forward = word.join("");
		const reverse = [...word].reverse().join("");

		return forward === XMAS || reverse === XMAS;
	}

	function checkDiagonalLeft(x: number, y: number): boolean {
		const word = matrix
			.map(
				(row, r) =>
					row.filter((_, c) => {
						return r + c === x + y;
					})[0]
			)
			.slice(y, Math.min(height, y + LEN));
		const forward = word.join("");
		const reverse = [...word].reverse().join("");

		return forward === XMAS || reverse === XMAS;
	}

	const checks = [
		checkHorizontal,
		checkVertical,
		checkDiagonalRight,
		checkDiagonalLeft,
	];
	let count = 0;

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			for (const check of checks) {
				if (check(x, y)) count++;
			}
		}
	}

	return count;
}

function part2() {
	const MAS = "MAS";

	const matrix = getMatrix();
	const width = matrix[0].length;
	const height = matrix.length;

	function check(x: number, y: number): boolean {
		if (x < 1 || y < 1 || x > width - 2 || y > height - 2) return false;

		const word1 = [matrix[y - 1][x - 1], matrix[y][x], matrix[y + 1][x + 1]];
		const word2 = [matrix[y - 1][x + 1], matrix[y][x], matrix[y + 1][x - 1]];

		return (
			(word1.join("") === MAS || [...word1].reverse().join("") === MAS) &&
			(word2.join("") === MAS || [...word2].reverse().join("") === MAS)
		);
	}

	let count = 0;

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (check(x, y)) count++;
		}
	}

	return count;
}

console.log(part1());
console.log(part2());
