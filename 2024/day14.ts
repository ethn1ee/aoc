import { getInput } from "../fetchInput.mts";
import process from "node:process";

const input = await getInput(2024, 14);
type Robot = {
	p: [number, number];
	v: [number, number];
};

function parseInput(): Robot[] {
	const robots: Robot[] = input.split("\n").map((line) => {
		const [pPart, vPart] = line.split(" ");
		const [px, py] = pPart.substring(2).split(",").map(Number);
		const [vx, vy] = vPart.substring(2).split(",").map(Number);
		return { p: [px, py], v: [vx, vy] };
	});

	return robots;
}

function printMatrix(matrix: number[][]) {
	matrix.forEach((row) => {
		console.log(row.map((cell) => (cell === 0 ? " " : "*")).join(""));
	});
}

function part1(robots: Robot[]): number {
	const TIMEPASSED = 100;
	const WIDTH = 101,
		HEIGHT = 103;
	const quadrants = [0, 0, 0, 0];
	const matrix = Array.from({ length: HEIGHT }, () =>
		Array.from({ length: WIDTH }, () => 0)
	);

	function getFuturePosition(robot: Robot) {
		const dx = (TIMEPASSED * robot.v[0]) % WIDTH,
			dy = (TIMEPASSED * robot.v[1]) % HEIGHT;

		const newX = (WIDTH + robot.p[0] + dx) % WIDTH,
			newY = (HEIGHT + robot.p[1] + dy) % HEIGHT;

		matrix[newY][newX]++;

		if (newX < Math.floor(WIDTH / 2)) {
			if (newY < Math.floor(HEIGHT / 2)) quadrants[0]++;
			else if (newY > Math.floor(HEIGHT / 2)) quadrants[1]++;
		} else if (newX > Math.floor(WIDTH / 2)) {
			if (newY < Math.floor(HEIGHT / 2)) quadrants[2]++;
			else if (newY > Math.floor(HEIGHT / 2)) quadrants[3]++;
		}
	}

	robots.forEach((robot) => getFuturePosition(robot));

	const safety = quadrants.reduce((prod, val) => prod * val, 1);

	return safety;
}

function part2(robots: Robot[], lineLength: number) {
	const WIDTH = 101,
		HEIGHT = 103;
	const quadrants = [0, 0, 0, 0];

	function getFuturePosition(
		robot: Robot,
		matrix: number[][],
		TIMEPASSED: number
	) {
		const dx = (TIMEPASSED * robot.v[0]) % WIDTH,
			dy = (TIMEPASSED * robot.v[1]) % HEIGHT;

		const newX = (WIDTH + robot.p[0] + dx) % WIDTH,
			newY = (HEIGHT + robot.p[1] + dy) % HEIGHT;

		matrix[newY][newX]++;

		if (newX < Math.floor(WIDTH / 2)) {
			if (newY < Math.floor(HEIGHT / 2)) quadrants[0]++;
			else if (newY > Math.floor(HEIGHT / 2)) quadrants[1]++;
		} else if (newX > Math.floor(WIDTH / 2)) {
			if (newY < Math.floor(HEIGHT / 2)) quadrants[2]++;
			else if (newY > Math.floor(HEIGHT / 2)) quadrants[3]++;
		}
	}

	function isLinePresent(matrix: number[][], length: number) {
		return matrix.some((row) => {
			for (let i = 0; i <= row.length - length; i++) {
				if (!row.slice(i, i + length).includes(0)) return true;
			}
			return false;
		});
	}

	let timePassed = 0;

	while (true) {
		const matrix = Array.from({ length: HEIGHT }, () =>
			Array.from({ length: WIDTH }, () => 0)
		);

		robots.forEach((robot) => {
			getFuturePosition(robot, matrix, timePassed);
		});

		if (isLinePresent(matrix, lineLength)) {
			printMatrix(matrix);
			break;
		}

		timePassed++;
	}

	return timePassed;
}

const robots = parseInput();
console.log(part1(robots));
const lineLength = process.argv[2] ? parseInt(process.argv[2], 10) : 10;
console.log(part2(robots, lineLength));
