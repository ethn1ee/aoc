import { getInput } from "./get-input";

const input = await getInput(2024, 12);

function parseInput() {
	const matrix = input.split("\n").map((line) => line.split(""));

	return matrix;
}

function part1(matrix: string[][]) {
	const width = matrix[0].length;
	const height = matrix.length;
	const visited = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => false)
	);

	function bfs(x: number, y: number): number {
		const plant = matrix[y][x];
		const q: number[][] = [];
		let area = 0;
		let perimeter = 0;

		q.push([x, y]);
		visited[y][x] = true;

		while (q.length !== 0) {
			const [currX, currY] = q.shift()!;

			let neighbors = 0;
			area++;

			[-1, 0, 1].forEach((yOffset) => {
				[-1, 0, 1].forEach((xOffset) => {
					if (Math.abs(xOffset + yOffset) !== 1) return; // skip if the new cell is diagonal or itself
					const newX = currX + xOffset,
						newY = currY + yOffset;

					if (
						newX >= 0 &&
						newX < width &&
						newY >= 0 &&
						newY < height &&
						matrix[newY][newX] === plant
					) {
						if (!visited[newY][newX]) {
							q.push([newX, newY]);
							visited[newY][newX] = true;
						}
						neighbors++;
					}
				});
			});

			perimeter += 4 - neighbors;
		}

		return perimeter * area;
	}

	let price = 0;

	matrix.forEach((row, y) => {
		row.forEach((_, x) => {
			if (visited[y][x]) return;
			const currPrice = bfs(x, y);
			price += currPrice;
		});
	});

	return price;
}

function part2(matrix: string[][]) {
	const width = matrix[0].length;
	const height = matrix.length;
	const visited = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => false)
	);

	function bfs(x: number, y: number): number {
		const q: number[][] = [];
		const plant = matrix[y][x];
		let area = 0;

		const currRegion = Array.from({ length: height }, () =>
			Array.from({ length: width }, () => false)
		);

		q.push([x, y]);
		visited[y][x] = true;
		currRegion[y][x] = true;

		while (q.length !== 0) {
			const [currX, currY] = q.shift()!;
			area++;

			[-1, 0, 1].forEach((yOffset) => {
				[-1, 0, 1].forEach((xOffset) => {
					if (Math.abs(xOffset + yOffset) !== 1) return; // skip if the new cell is diagonal or itself
					const newX = currX + xOffset,
						newY = currY + yOffset;

					if (
						newX >= 0 &&
						newX < width &&
						newY >= 0 &&
						newY < height &&
						matrix[newY][newX] === plant
					) {
						if (!visited[newY][newX]) {
							q.push([newX, newY]);
							visited[newY][newX] = true;
							currRegion[newY][newX] = true;
						}
					}
				});
			});
		}

		const sides: number[][][] = Array.from({ length: height }, () =>
			Array.from({ length: width }, () => [])
		);
		let numSides = 0;
		const [UP, DOWN, LEFT, RIGHT] = [1, 2, 3, 4];

		for (let c = 0; c < width; c++) {
			for (let r = 0; r < height; r++) {
				if (!currRegion[r][c]) continue;

				// up
				if (r === 0 || !currRegion[r - 1][c]) {
					if (c === 0 || !sides[r][c - 1].includes(UP)) numSides++;
					sides[r][c].push(UP);
				}

				// down
				if (r === height - 1 || !currRegion[r + 1][c]) {
					if (c === 0 || !sides[r][c - 1].includes(DOWN)) numSides++;
					sides[r][c].push(DOWN);
				}

				// left
				if (c === 0 || !currRegion[r][c - 1]) {
					if (r === 0 || !sides[r - 1][c].includes(LEFT)) numSides++;
					sides[r][c].push(LEFT);
				}

				// right
				if (c === width - 1 || !currRegion[r][c + 1]) {
					if (r === 0 || !sides[r - 1][c].includes(RIGHT)) numSides++;
					sides[r][c].push(RIGHT);
				}
			}
		}

		return numSides * area;
	}

	let price = 0;

	matrix.forEach((row, y) => {
		row.forEach((_, x) => {
			if (visited[y][x]) return;
			const currPrice = bfs(x, y);
			price += currPrice;
		});
	});

	return price;
}

const matrix = parseInput();
console.log(part1(matrix));
console.log(part2(matrix));
