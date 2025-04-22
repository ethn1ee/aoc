import { getInput } from "../fetchInput.mts";

const input = await getInput(2024, 7);
// 	`190: 10 19
// 3267: 81 40 27
// 83: 17 5
// 156: 15 6
// 7290: 6 8 6 15
// 161011: 16 10 13
// 192: 17 8 14
// 21037: 9 7 18 13
// 292: 11 6 16 20`;

function parseInput(): { targets: number[]; operands: number[][] } {
	const targets: number[] = [];
	const operands: number[][] = [];

	input.split("\n").forEach((line) => {
		targets.push(parseInt(line.split(":")[0]));
		operands.push([...line.split(": ")[1].split(" ").map(Number)]);
	});

	return { targets, operands };
}

function part1(targets: number[], operands: number[][]): number {
	let correct = 0;

	for (let i = 0; i < targets.length; i++) {
		const operandArr = operands[i];
		const operations = [operandArr[0]];

		for (let j = 1; j < operandArr.length; j++) {
			const currVals = [...operations]; // take all operations built so far
			operations.length = 0; // clear queue
			const newVal = operandArr[j];

			for (const val of currVals) {
				// *
				operations.push(val * newVal);
				// +
				operations.push(val + newVal);
			}
		}

		if (operations.includes(targets[i])) {
			correct += targets[i];
		}
	}

	return correct;
}

function part2(targets: number[], operands: number[][]): number {
	let correct = 0;

	for (let i = 0; i < targets.length; i++) {
		const operandArr = operands[i];
		const operations = [operandArr[0]];

		for (let j = 1; j < operandArr.length; j++) {
			const currVals = [...operations]; // take all operations built so far
			operations.length = 0; // clear queue
			const newVal = operandArr[j];
			const offset = Math.pow(10, Math.floor(Math.log10(newVal)) + 1);

			for (const val of currVals) {
				// ||
				operations.push(val * offset + newVal);
				// *
				operations.push(val * newVal);
				// +
				operations.push(val + newVal);
			}
		}

		if (operations.includes(targets[i])) {
			correct += targets[i];
		}
	}

	return correct;
}

const { targets, operands } = parseInput();
console.log(part1(targets, operands));
console.log(part2(targets, operands));
