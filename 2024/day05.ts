import { getInput } from "../fetchInput.mts";

const input = await getInput(2024, 5);

function parseInput(): { X: number[]; Y: number[]; updates: number[][] } {
	const X: number[] = [];
	const Y: number[] = [];
	const updates: number[][] = [];
	const [first, second] = input.split("\n\n");

	first.split("\n").forEach((line) => {
		const [x, y] = line.split("|").map(Number);
		X.push(x);
		Y.push(y);
	});

	second.split("\n").forEach((line) => {
		updates.push(line.split(",").map(Number));
	});

	return { X, Y, updates };
}

function part1(X: number[], Y: number[], updates: number[][]): number {
	function findIndices(arr: number[], target: number) {
		const indices = arr
			.map((val, i) => (val === target ? i : -1))
			.filter((val) => val !== -1);

		return indices;
	}

	function isValid(update: number[], index: number): boolean {
		// num should be before all the Y at findIndices(X, num)
		const num = update[index];
		const shouldBeAfter = findIndices(X, num).map((i) => Y[i]);
		return !update.slice(0, index).some((numberBefore) => {
			return shouldBeAfter.includes(numberBefore);
		});
	}

	let sum = 0;

	updates.forEach((update) => {
		let allValid = true;
		for (let i = 0; i < update.length; i++) {
			if (!isValid(update, i)) {
				allValid = false;
				break;
			}
		}

		if (allValid) {
			sum += update[Math.floor(update.length / 2)];
		}
	});

	return sum;
}

function part2(X: number[], Y: number[], updates: number[][]): number {
	function findIndices(arr: number[], target: number) {
		const indices = arr
			.map((val, i) => (val === target ? i : -1))
			.filter((val) => val !== -1);

		return indices;
	}

	function isValid(update: number[], index: number): boolean {
		// num should be before all the Y at findIndices(X, num)
		const num = update[index];
		const shouldBeAfter = findIndices(X, num).map((i) => Y[i]);
		return !update.slice(0, index).some((numberBefore) => {
			return shouldBeAfter.includes(numberBefore);
		});
	}

	function fix(update: number[]) {
		const shouldBeAfter: Record<number, number[]> = {};

		update.forEach((num) => {
			const allAfter = findIndices(X, num).map((i) => Y[i]);
			shouldBeAfter[num] = update.filter((num) => allAfter.includes(num));
		});

		update.sort((a, b) => shouldBeAfter[b].length - shouldBeAfter[a].length);
	}

	let sum = 0;

	updates.forEach((update) => {
		let allValid = true;
		for (let i = 0; i < update.length; i++) {
			if (!isValid(update, i)) {
				allValid = false;
				break;
			}
		}

		if (!allValid) {
			fix(update);
			sum += update[Math.floor(update.length / 2)];
		}
	});

	return sum;
}

const { X, Y, updates } = parseInput();
console.log(part1(X, Y, updates));
console.log(part2(X, Y, updates));
