import { getInput } from "../fetchInput.mts";

const input = await getInput(2024, 13);

type Machine = {
	A: [number, number];
	B: [number, number];
	prize: [number, number];
};

function parseInput(): Machine[] {
	const regex = /(\d+)/g;
	const machines: Machine[] = input.split("\n\n").map((machine) => {
		const matches = machine.match(regex);
		if (!matches) {
			throw new Error("No numbers found in input");
		}
		const [ax, ay, bx, by, x, y] = matches.map((str) => parseInt(str));
		return { A: [ax, ay], B: [bx, by], prize: [x, y] };
	});

	return machines;
}

function part1(machines: Machine[]): number {
	function calculateTokens(machine: Machine): number {
		let minTokens = Infinity;

		for (let aCount = 0; aCount <= 100; aCount++) {
			for (let bCount = 0; bCount <= 100; bCount++) {
				const sumX = machine.A[0] * aCount + machine.B[0] * bCount,
					sumY = machine.A[1] * aCount + machine.B[1] * bCount;

				if (machine.prize[0] % sumX === 0 && machine.prize[1] % sumY === 0) {
					const xFactor = Math.round(machine.prize[0] / sumX),
						yFactor = Math.round(machine.prize[1] / sumY);
					if (xFactor !== yFactor) continue;

					const totalCount = (3 * aCount + 1 * bCount) * xFactor;
					if (totalCount < minTokens) {
						minTokens = totalCount;
						return minTokens;
					}
				}
			}
		}

		return 0;
	}

	const totalTokens = machines.reduce(
		(sum, machine) => sum + calculateTokens(machine),
		0
	);

	return totalTokens;
}

function part2(machines: Machine[]): number {
	function calculateTokens(machine: Machine): number {
		const {
			A: [x1, y1],
			B: [x2, y2],
			prize: [X, Y],
		} = machine;

		const b = Math.round((X - (x1 / y1) * Y) / (x2 - (x1 / y1) * y2));
		const a = Math.round((X - x2 * b) / x1);

		// verify
		if (x1 * a + x2 * b === X && y1 * a + y2 * b === Y) return 3 * a + b;

		return 0;
	}

	const ERROR = 10000000000000;
	const modifiedMachines = machines.map((machine) => ({
		...machine,
		prize: [machine.prize[0] + ERROR, machine.prize[1] + ERROR] as [
			number,
			number
		],
	}));

	// console.log(modifiedMachines);

	const totalTokens = modifiedMachines.reduce(
		(sum, machine) => sum + calculateTokens(machine),
		0
	);

	return totalTokens;
}

const machines = parseInput();
console.log(part1(machines));
console.log(part2(machines));
