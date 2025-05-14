import { getInput } from "../fetchInput.mts";

const input = await getInput(2024, 15);

// 	`##########
// #..O..O.O#
// #......O.#
// #.OO..O.O#
// #..O@..O.#
// #O#..O...#
// #O..O..O.#
// #.OO.O.OO#
// #....O...#
// ##########

// <vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
// vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
// ><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
// <<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
// ^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
// ^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
// >^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
// <><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
// ^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
// v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`;

const WALL = "#",
	BOX = "O",
	ROBOT = "@";

const UP = [0, -1],
	RIGHT = [1, 0],
	DOWN = [0, 1],
	LEFT = [-1, 0];

interface InputProps {
	matrix: string[][];
	moves: number[][];
	pos: [number, number];
}

function parseInput(): InputProps {
	const pos: number[] = [];

	const matrix = input
		.split("\n\n")[0]
		.split("\n")
		.map((line, y) =>
			line.split("").map((cell, x) => {
				if (cell === WALL || cell === BOX) return cell;
				if (cell === ROBOT) {
					pos.push(x, y);
					return ROBOT;
				}
				return "";
			})
		);

	const moves = input
		.split("\n\n")[1]
		.split("\n")
		.flatMap((line) =>
			line.split("").map((cell) => {
				switch (cell) {
					case "^":
						return UP;

					case ">":
						return RIGHT;

					case "v":
						return DOWN;

					case "<":
						return LEFT;

					default:
						throw new Error("Invalid move!");
				}
			})
		);

	return { matrix, moves, pos: [pos[0], pos[1]] };
}

function part1({ matrix: ogMatrix, moves, pos }: InputProps) {
	const matrix = ogMatrix.map((line) => line.map((cell) => cell));

	const WIDTH = matrix[0].length,
		HEIGHT = matrix.length;

	let robotPos = [...pos] as [number, number];

	function move([currX, currY]: typeof pos, direction: typeof UP): boolean {
		const [newX, newY] = [currX + direction[0], currY + direction[1]];

		if (newX < 0 || newY < 0 || newX >= WIDTH || newY >= HEIGHT) return false;

		if (matrix[newY][newX] === WALL) return false;
		if (matrix[newY][newX] === BOX && !move([newX, newY], direction))
			return false;

		if (matrix[currY][currX] === ROBOT) robotPos = [newX, newY];

		matrix[newY][newX] = matrix[currY][currX];
		matrix[currY][currX] = "";

		return true;
	}

	moves.forEach((direction) => {
		move(robotPos, direction);
	});

	const sumGPS = matrix.reduce(
		(totalSum, line, y) =>
			totalSum +
			line.reduce(
				(lineSum, curr, x) =>
					curr === BOX ? lineSum + (100 * y + x) : lineSum,
				0
			),
		0
	);

	return sumGPS;
}

function part2({ matrix, moves, pos }: InputProps) {
	const doubleMatrix = matrix.map((line) =>
		line.flatMap((cell) => {
			switch (cell) {
				case ROBOT:
					return [ROBOT, ""];

				case BOX:
					return ["[", "]"];

				default:
					return [cell, cell];
			}
		})
	);

	const WIDTH = doubleMatrix[0].length,
		HEIGHT = doubleMatrix.length;

	let robotPos = [pos[0] * 2, pos[1]] as [number, number];

	function canMove([currX, currY]: typeof pos, direction: typeof UP): boolean {
		const [newX, newY] = [currX + direction[0], currY + direction[1]];
		const newCell = doubleMatrix[newY][newX];

		if (newX < 0 || newY < 0 || newX >= WIDTH || newY >= HEIGHT) return false;

		if (newCell === WALL) return false;

		if (newCell === "[") {
			if (direction === UP || direction === DOWN) {
				return (
					canMove([newX, newY], direction) &&
					canMove([newX + 1, newY], direction)
				);
			} else {
				return canMove([newX, newY], direction);
			}
		}

		if (newCell === "]") {
			if (direction === UP || direction === DOWN) {
				return (
					canMove([newX, newY], direction) &&
					canMove([newX - 1, newY], direction)
				);
			} else {
				return canMove([newX, newY], direction);
			}
		}

		return true;
	}

	function move([currX, currY]: typeof pos, direction: typeof UP) {
		if (!canMove([currX, currY], direction)) return;

		const [newX, newY] = [currX + direction[0], currY + direction[1]];
		const newCell = doubleMatrix[newY][newX];

		if (newCell === "[") {
			if (direction === UP || direction === DOWN) {
				move([newX, newY], direction);
				move([newX + 1, newY], direction);
			} else {
				move([newX, newY], direction);
			}
		}

		if (newCell === "]") {
			if (direction === UP || direction === DOWN) {
				move([newX, newY], direction);
				move([newX - 1, newY], direction);
			} else {
				move([newX, newY], direction);
			}
		}

		if (doubleMatrix[currY][currX] === ROBOT) robotPos = [newX, newY];

		doubleMatrix[newY][newX] = doubleMatrix[currY][currX];
		doubleMatrix[currY][currX] = "";
	}

	moves.forEach((direction) => {
		move(robotPos, direction);
	});

	const sumGPS = doubleMatrix.reduce(
		(totalSum, line, y) =>
			totalSum +
			line.reduce(
				(lineSum, curr, x) =>
					curr === "[" ? lineSum + (100 * y + x) : lineSum,
				0
			),
		0
	);

	return sumGPS;
}

const params = parseInput();
console.log(part1(params));
console.log(part2(params));
