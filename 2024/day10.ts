import { getInput } from "../fetchInput.mts";

const input = await getInput(2024, 10);
// 	`89010123
// 78121874
// 87430965
// 96549874
// 45678903
// 32019012
// 01329801
// 10456732`;

function parseInput(): { matrix: number[][]; trailheads: number[][] } {
	const trailheads: number[][] = [];
	const matrix = input.split("\n").map((row, y) =>
		row.split("").map((cell, x) => {
			if (cell === "0") trailheads.push([x, y]);
			return parseInt(cell);
		})
	);

	return { matrix, trailheads };
}

function part1(matrix: number[][], trailheads: number[][]): number {
	const width = matrix[0].length;
	const height = matrix.length;

	let score = 0;

	function dfs(x: number, y: number, reached: boolean[][]) {
		const cell = matrix[y][x];

		if (cell === 9) {
			if (!reached[y][x]) {
				reached[y][x] = true;
				score++;
			}
			return;
		}

		[
			[0, 1],
			[0, -1],
			[1, 0],
			[-1, 0],
		].forEach(([xOffset, yOffset]) => {
			const newX = x + xOffset,
				newY = y + yOffset;

			if (newX < 0 || newX === width || newY < 0 || newY === height) return;

			const newCell = matrix[newY][newX];
			if (newCell - cell === 1) dfs(newX, newY, reached);
		});
	}

	trailheads.forEach((trailhead) => {
		const reached: boolean[][] = Array.from({ length: height }, () =>
			Array.from<boolean>({ length: width }).fill(false)
		);

		dfs(trailhead[0], trailhead[1], reached);
	});

	return score;
}

function part2(matrix: number[][], trailheads: number[][]): number {
	const width = matrix[0].length;
	const height = matrix.length;

	let score = 0;

	function dfs(x: number, y: number) {
		const cell = matrix[y][x];
		if (cell === 9) {
			score++;
			return;
		}

		[
			[0, 1],
			[0, -1],
			[1, 0],
			[-1, 0],
		].forEach(([xOffset, yOffset]) => {
			const newX = x + xOffset,
				newY = y + yOffset;

			if (newX < 0 || newX === width || newY < 0 || newY === height) return;

			const newCell = matrix[newY][newX];
			if (newCell - cell === 1) dfs(newX, newY);
		});
	}

	trailheads.forEach((trailhead) => {
		dfs(trailhead[0], trailhead[1]);
	});

	return score;
}

const { matrix, trailheads } = parseInput();
console.log(part1(matrix, trailheads));
console.log(part2(matrix, trailheads));
