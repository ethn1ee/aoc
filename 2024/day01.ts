import { getInput } from "../fetchInput.mjs";

const input = await getInput(2024, 1);

// Split lines into left and right arrays
function splitLeftRight(): { left: number[]; right: number[] } {
	const left: number[] = [];
	const right: number[] = [];
	input
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.length > 0)
		.forEach((line) => {
			const [l, r] = line.split("   ").map(Number);
			left.push(l);
			right.push(r);
		});

	left.sort((a, b) => a - b);
	right.sort((a, b) => a - b);

	return { left, right };
}

function part1(left: number[], right: number[]): number {
	let sum = 0;
	for (let i = 0; i < left.length; i++) {
		sum += Math.abs(left[i] - right[i]);
	}

	return sum;
}

function part2(left: number[], right: number[]): number {
	let j = 0;
	let sum = 0;

	for (let i = 0; i < left.length; i++) {
		let similarity = 0;
		while (left[i] > right[j]) j++;
		while (left[i] === right[j]) {
			similarity += left[i];
			j++;
		}
		sum += similarity;
	}

	return sum;
}

const { left, right } = splitLeftRight();
console.log("Part 1:", part1(left, right));
console.log("Part 2:", part2(left, right));
