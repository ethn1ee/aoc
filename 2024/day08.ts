import { getInput } from "../fetchInput.mts";

const input = await getInput(2024, 8);

function parseInput(): {
	antennas: Map<string, number[][]>;
	width: number;
	height: number;
} {
	const antennas = new Map<string, number[][]>();
	let width = 0,
		height = 0;

	input.split("\n").forEach((line, y) => {
		height++;
		if (width === 0) width = line.length;
		line.split("").forEach((antenna, x) => {
			if (antenna !== ".") {
				if (antennas.has(antenna)) antennas.get(antenna)?.push([x, y]);
				else {
					antennas.set(antenna, [[x, y]]);
				}
			}
		});
	});

	return { antennas, width, height };
}

function part1(
	antennas: Map<string, number[][]>,
	width: number,
	height: number
): number {
	const hasAntenna = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => false)
	);

	function isInside(x: number, y: number) {
		return x >= 0 && y >= 0 && x < width && y < height;
	}

	antennas.values().forEach((locations) => {
		for (let i = 0; i < locations.length - 1; i++) {
			for (let j = i + 1; j < locations.length; j++) {
				const ant1 = locations[i],
					ant2 = locations[j];
				const dx = ant2[0] - ant1[0],
					dy = ant2[1] - ant1[1];
				const x1 = ant1[0] - dx,
					y1 = ant1[1] - dy,
					x2 = ant2[0] + dx,
					y2 = ant2[1] + dy;

				if (isInside(x1, y1)) hasAntenna[y1][x1] = true;
				if (isInside(x2, y2)) hasAntenna[y2][x2] = true;
			}
		}
	});

	const count = hasAntenna.flat().filter(Boolean).length;

	return count;
}

function part2(
	antennas: Map<string, number[][]>,
	width: number,
	height: number
): number {
	const hasAntenna: string[][][] = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => [])
	);

	function isInside(x: number, y: number) {
		return x >= 0 && y >= 0 && x < width && y < height;
	}

	antennas.entries().forEach(([antenna, locations]) => {
		for (let i = 0; i < locations.length - 1; i++) {
			for (let j = i + 1; j < locations.length; j++) {
				const ant1 = locations[i],
					ant2 = locations[j];
				const dx = ant2[0] - ant1[0],
					dy = ant2[1] - ant1[1];

				let [x, y] = ant1;
				while (isInside(x, y)) {
					hasAntenna[y][x].includes(antenna) || hasAntenna[y][x].push(antenna);
					x -= dx;
					y -= dy;
				}
				[x, y] = ant2;
				while (isInside(x, y)) {
					hasAntenna[y][x].includes(antenna) || hasAntenna[y][x].push(antenna);
					x += dx;
					y += dy;
				}
			}
		}
	});

	const count = hasAntenna.flat().filter((cell) => cell.length > 0).length;

	return count;
}

const { antennas, width, height } = parseInput();
console.log(part1(antennas, width, height));
console.log(part2(antennas, width, height));
