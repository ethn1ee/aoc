import { getInput } from "../fetchInput.mts";

const input = await getInput(2024, 3);
	// "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))";

function part1(): number {
	function findMuls(input: string): string[] {
		const regex = /mul\(\d+\,\d+\)/g;
		return input.match(regex) ?? [];
	}

	function evalMul(mul: string): number {
		const [a, b] = mul.slice(4, -1).split(",").map(Number);
		return a * b;
	}

	const muls = findMuls(input);

	let sum = 0;

	muls.forEach((mul) => {
		sum += evalMul(mul);
	});

	return sum;
}

function part2(): number {
	function findMuls(input: string): string[] {
		const regex = /(mul\(\d+\,\d+\)|do\(\)|don't\(\))/g;
		return input.match(regex) ?? [];
	}

	function evalMul(mul: string): number {
		const [a, b] = mul.slice(4, -1).split(",").map(Number);
		return a * b;
	}

	const commands = findMuls(input);

	let sum = 0;
	let isEnabled = true;

	commands.forEach((command) => {
		switch (command) {
			case "do()":
				isEnabled = true;
				break;
			case "don't()":
				isEnabled = false;
				break;
			default:
				if (isEnabled) sum += evalMul(command);
				break;
		}
	});

	return sum;
}

console.log(part1());
console.log(part2());
