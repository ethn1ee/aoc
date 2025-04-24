import { getInput } from "../fetchInput.mts";

const input = await getInput(2024, 11);

function parseInput(): string[] {
	return input.split(" ");
}

function bruteforce(stones: string[], blink: number): number {
	function transform(stone: string): string[] {
		if (stone === "0") return ["1"];
		if (stone.length % 2 === 0) {
			const left = stone.slice(0, stone.length / 2);
			const right = parseInt(stone.slice(stone.length / 2)).toString();
			return [left, right];
		}
		return [(parseInt(stone) * 2024).toString()];
	}

	let transformed = stones.slice();

	for (let i = 0; i < blink; i++) {
		transformed = transformed.map((stone) => transform(stone)).flat();
	}

	return transformed.length;
}

function memoization(stones: string[], blink: number): number {
	const start = Date.now();
	const memos = Array.from({ length: blink + 1 }).map(
		() => new Map<string, number>()
	);

	function transform(stone: string, remainingBlink: number): number {
		if (remainingBlink === 0) {
			return 1;
		}

		const memoized = memos[remainingBlink].get(stone);
		if (memoized) return memoized;

		const transformed: string[] = [];

		if (stone === "0") transformed.push("1");
		else if (stone.length % 2 === 0) {
			transformed.push(
				stone.slice(0, stone.length / 2),
				parseInt(stone.slice(stone.length / 2)).toString()
			);
		} else {
			transformed.push((parseInt(stone) * 2024).toString());
		}

		const res = transformed.reduce(
			(sum, newStone) => sum + transform(newStone, remainingBlink - 1),
			0
		);

		memos[remainingBlink].set(stone, res);

		return res;
	}

	let count = 0;
	stones.forEach((stone) => (count += transform(stone, blink)));

	console.log(Date.now() - start);

	return count;
}

const stones = parseInput();
console.log(memoization(stones, 75));
