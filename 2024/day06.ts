import { getInput } from "./get-input";

const input = await getInput(2024, 6);

type Guard = { x: number; y: number; direction: string };

const OBSTRUCTION = -1;
const NEUTRAL = 0;
const GUARD = 1;

function parseInput(): {
	matrix: number[][];
	guard: Guard;
} {
	const guard: Guard = {
		x: 0,
		y: 0,
		direction: "up",
	};

	const matrix = input.split("\n").map((line, y) => {
		return line.split("").map((char, x) => {
			if (char === "#") {
				return OBSTRUCTION;
			}
			if (char === "^") {
				guard.x = x;
				guard.y = y;
				return GUARD;
			}
			return NEUTRAL;
		});
	});

	return { matrix, guard };
}

function part1(ogMatrix: number[][], ogGuard: Guard): number {
	const matrix = ogMatrix.map((row) => [...row]);
	const guard = { ...ogGuard };
	const width = matrix[0].length;
	const height = matrix.length;

	function move(): boolean {
		switch (guard.direction) {
			case "up":
				if (guard.y === 0) return false;
				if (matrix[guard.y - 1][guard.x] !== OBSTRUCTION) {
					guard.y--;
					break;
				}
				guard.direction = "right";
				return move();
			case "right":
				if (guard.x === width - 1) return false;
				if (matrix[guard.y][guard.x + 1] !== OBSTRUCTION) {
					guard.x++;
					break;
				}
				guard.direction = "down";
				return move();
			case "down":
				if (guard.y === height - 1) return false;
				if (matrix[guard.y + 1][guard.x] !== OBSTRUCTION) {
					guard.y++;
					break;
				}
				guard.direction = "left";
				return move();
			case "left":
				if (guard.x === 0) return false;
				if (matrix[guard.y][guard.x - 1] !== OBSTRUCTION) {
					guard.x--;
					break;
				}
				guard.direction = "up";
				return move();
			default:
				break;
		}

		return true;
	}

	while (move()) {
		matrix[guard.y][guard.x] = GUARD;
	}

	let path = 0;

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (matrix[y][x] === GUARD) path++;
		}
	}

	return path;
}

function part2(ogMatrix: number[][], ogGuard: Guard): number {
	const width = ogMatrix[0].length;
	const height = ogMatrix.length;

	function move(guard: Guard, matrix: number[][]): boolean {
		switch (guard.direction) {
			case "up":
				if (guard.y === 0) return false;
				if (matrix[guard.y - 1][guard.x] !== OBSTRUCTION) {
					guard.y--;
					break;
				}
				guard.direction = "right";
				return move(guard, matrix);
			case "right":
				if (guard.x === width - 1) return false;
				if (matrix[guard.y][guard.x + 1] !== OBSTRUCTION) {
					guard.x++;
					break;
				}
				guard.direction = "down";
				return move(guard, matrix);
			case "down":
				if (guard.y === height - 1) return false;
				if (matrix[guard.y + 1][guard.x] !== OBSTRUCTION) {
					guard.y++;
					break;
				}
				guard.direction = "left";
				return move(guard, matrix);
			case "left":
				if (guard.x === 0) return false;
				if (matrix[guard.y][guard.x - 1] !== OBSTRUCTION) {
					guard.x--;
					break;
				}
				guard.direction = "up";
				return move(guard, matrix);
			default:
				break;
		}

		return true;
	}

	let loopCount = 0;

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (ogMatrix[y][x] === OBSTRUCTION || ogMatrix[y][x] === GUARD) continue;

			const matrix = ogMatrix.map((row) => [...row]);
			const guard = { ...ogGuard };
			const path: string[][][] = matrix.map((row) => row.map(() => []));

			matrix[y][x] = OBSTRUCTION;

			while (move(guard, matrix)) {
				if (path[guard.y][guard.x].includes(guard.direction)) {
					loopCount++;
					break;
				}
				path[guard.y][guard.x].push(guard.direction);
			}
		}
	}

	return loopCount;
}

const { matrix, guard } = parseInput();
console.log(part1(matrix, guard));
console.log(part2(matrix, guard));
