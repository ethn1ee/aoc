import { getInput } from "../fetchInput.mts";

const input = await getInput(2024, 16);

type InputProps = {
	maze: boolean[][];
	start: [number, number];
	end: [number, number];
};

function parseInput(): InputProps {
	let start, end;

	const maze = input.split("\n").map((line, y) =>
		line.split("").map((cell, x) => {
			switch (cell) {
				case "#":
					return false;

				case ".":
					return true;

				case "S":
					start = [x, y];
					return true;

				case "E":
					end = [x, y];
					return true;

				default:
					throw new Error("Invalid maze symbol.");
			}
		})
	);

	if (!start || !end) throw new Error("Start or end position not specified.");

	return {
		maze,
		start: start as [number, number],
		end: end as [number, number],
	};
}

const E = 0,
	N = 1,
	W = 2,
	S = 3;

function part1({
	maze,
	start: [startX, startY],
	end: [endX, endY],
}: InputProps): number {
	const width = maze[0].length,
		height = maze.length;

	function distanceToEnd(x: number, y: number): number {
		const horizontal = endX - x;
		const vertical = endY - y;

		return Math.sqrt(horizontal * horizontal + vertical * vertical);
	}

	function getNeighbors(x: number, y: number, dir: number) {
		const neighbors: [number, number, number][] = [];
		switch (dir) {
			case E:
				neighbors.push([x + 1, y, E], [x, y, N], [x, y, S]);
				break;

			case N:
				neighbors.push([x, y - 1, N], [x, y, E], [x, y, W]);
				break;

			case W:
				neighbors.push([x - 1, y, W], [x, y, N], [x, y, S]);
				break;

			case S:
				neighbors.push([x, y + 1, S], [x, y, E], [x, y, W]);
				break;

			default:
				throw new Error("Invalid direction.");
		}

		return neighbors;
	}

	function aStar(): number {
		const q: [number, number, number][] = [[startX, startY, E]];

		const g: number[][][] = Array.from({ length: height }, () =>
			Array.from({ length: width }, () => new Array(4).fill(Infinity))
		); // g[y][x] is the currently known cheapest cost from start to x, y
		g[startY][startX][E] = 0;

		const f: number[][][] = Array.from({ length: height }, () =>
			Array.from({ length: width }, () => new Array(4).fill(Infinity))
		); // f[y][x] = g[y][x][dir] + distanceToEnd(x, y)
		f[startY][startX][E] = distanceToEnd(startX, startY);

		while (q.length > 0) {
			let idx: number = 0;
			const [x, y, dir] = q.reduce(
				([minX, minY, minDir], [currX, currY, currDir], i) => {
					const minF = f[minY][minX];
					const currF = f[currY][currX];
					if (currF < minF) {
						idx = i;
						return [currX, currY, currDir];
					}
					return [minX, minY, minDir];
				},
				[q[0][0], q[0][1], q[0][2]]
			); // lowest f score

			q.splice(idx, 1);

			if (x === endX && y === endY) {
				continue;
			}

			const neighbors = getNeighbors(x, y, dir);

			neighbors.forEach((neighbor) => {
				const [nX, nY, nDir] = neighbor;

				if (nX < 0 || nY < 0 || nX >= width || nY >= height || !maze[nY][nX])
					return;

				const d = nDir === dir ? 1 : 1000; // weight of the edge from current to neighbor

				const tempG = g[y][x][dir] + d;

				if (tempG < g[nY][nX][nDir]) {
					g[nY][nX][nDir] = tempG;
					f[nY][nX][nDir] = tempG + distanceToEnd(nX, nY);
					if (
						!q.some(
							(node) => node[0] === nX && node[1] === nY && node[2] === nDir
						)
					) {
						q.push(neighbor);
					}
				}
			});
		}

		return g[endY][endX].reduce(
			(min, curr) => (curr < min ? curr : min),
			Infinity
		);
	}

	return aStar();
}

function part2({
	maze,
	start: [startX, startY],
	end: [endX, endY],
}: InputProps): number {
	const width = maze[0].length,
		height = maze.length;

	function distanceToEnd(x: number, y: number): number {
		const horizontal = endX - x;
		const vertical = endY - y;

		return Math.sqrt(horizontal * horizontal + vertical * vertical);
	}

	function getNeighbors(x: number, y: number, dir: number) {
		const neighbors: [number, number, number][] = [];
		switch (dir) {
			case E:
				neighbors.push([x + 1, y, E], [x, y, N], [x, y, S]);
				break;

			case N:
				neighbors.push([x, y - 1, N], [x, y, E], [x, y, W]);
				break;

			case W:
				neighbors.push([x - 1, y, W], [x, y, N], [x, y, S]);
				break;

			case S:
				neighbors.push([x, y + 1, S], [x, y, E], [x, y, W]);
				break;

			default:
				throw new Error("Invalid direction.");
		}

		return neighbors;
	}

	let minCost = Infinity;

	const path: boolean[][] = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => false)
	);

	function countTiles(
		cameFrom: [number, number, number][][][],
		x: number,
		y: number,
		dir: number,
		cost: number
	) {
		if (cost < minCost) {
			path.forEach((line) => line.fill(false));
			minCost = cost;
		} else if (cost > minCost) {
			return;
		}

		let [prevX, prevY, prevDir] = [x, y, dir];

		while (prevX !== -1 && prevY !== -1 && prevDir !== -1) {
			path[prevY][prevX] = true;
			[prevX, prevY, prevDir] = cameFrom[prevY][prevX][prevDir];
		}
	}

	function aStar(): number {
		const q: [number, number, number][] = [[startX, startY, E]];

		const cameFrom: [number, number, number][][][] = Array.from(
			{ length: height },
			() =>
				Array.from({ length: width }, () =>
					Array.from({ length: 4 }, () => [-1, -1, -1])
				)
		);

		const g: number[][][] = Array.from({ length: height }, () =>
			Array.from({ length: width }, () =>
				Array.from({ length: 4 }, () => Infinity)
			)
		); // g[y][x] is the currently known cheapest cost from start to x, y
		g[startY][startX][E] = 0;

		const f: number[][][] = Array.from({ length: height }, () =>
			Array.from({ length: width }, () =>
				Array.from({ length: 4 }, () => Infinity)
			)
		); // f[y][x] = g[y][x][dir] + distanceToEnd(x, y)
		f[startY][startX][E] = distanceToEnd(startX, startY);

		while (q.length > 0) {
			const [x, y, dir] = q.pop()!;

			if (x === endX && y === endY) {
				countTiles(cameFrom, x, y, dir, g[y][x][dir]);
				continue;
			}

			const neighbors = getNeighbors(x, y, dir);

			neighbors.forEach((neighbor) => {
				const [nX, nY, nDir] = neighbor;

				if (nX < 0 || nY < 0 || nX >= width || nY >= height || !maze[nY][nX])
					return;

				const d = nDir === dir ? 1 : 1000; // weight of the edge from current to neighbor

				const tempG = g[y][x][dir] + d;

				if (tempG <= g[nY][nX][nDir]) {
					cameFrom[nY][nX][nDir] = [x, y, dir];
					g[nY][nX][nDir] = tempG;
					f[nY][nX][nDir] = tempG + distanceToEnd(nX, nY);
					if (
						!q.some(
							(node) => node[0] === nX && node[1] === nY && node[2] === nDir
						)
					) {
						q.push(neighbor);
					}
				}
			});
		}

		return g[endY][endX].reduce(
			(min, curr) => (curr < min ? curr : min),
			Infinity
		);
	}

	aStar();

	return path.reduce(
		(totalSum, row) =>
			totalSum + row.reduce((rowSum, cell) => (cell ? rowSum + 1 : rowSum), 0),
		0
	);
}

const params = parseInput();
console.log(part1(params));
console.log(part2(params));
