import { getInput } from "../fetchInput.mts";

const input =
	// await getInput(2024, 17);
	`Register A: 117440
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`;

type InputProps = {
	registers: { [k: string]: number };
	program: number[];
};

function parseInput(): InputProps {
	const [registersStr, programStr] = input.split("\n\n");

	const registers = Object.fromEntries(
		registersStr.split("\n").map((str) => {
			const [register, value] = str.toLowerCase().split(": ");
			return [register.slice(-1), parseInt(value)];
		})
	);

	const program = programStr.match(/\d+/g)?.map(Number);

	if (!registers) throw new Error("No registers parsed");
	if (!program) throw new Error("No instructions parsed");

	return { registers, program };
}

function part1({ registers, program: instructions }: InputProps): {
	ans: string;
	register: { [k: string]: number };
} {
	const reg = { ...registers };

	function combo(op: number) {
		if (op < 0 || op >= 7) throw new Error("Invalid combo operand");

		switch (op) {
			case 4:
				return reg.a;

			case 5:
				return reg.b;

			case 6:
				return reg.c;

			default:
				return op;
		}
	}

	let i = 0;
	const instruction: { [key: string]: (operand: number) => string } = {
		adv: (operand: number) => {
			reg.a = Math.floor(reg.a / Math.pow(2, combo(operand)));
			console.log("a:", reg.a);
			i += 2;
			return "";
		},
		bxl: (operand: number) => {
			reg.b = reg.b ^ operand;
			i += 2;
			return "";
		},
		bst: (operand: number) => {
			reg.b = combo(operand) % 8;
			i += 2;
			return "";
		},
		jnz: (operand: number) => {
			if (reg.a === 0) i += 2;
			else i = operand;
			return "";
		},
		bxc: (_operand: number) => {
			reg.b = reg.b ^ reg.c;
			i += 2;
			return "";
		},
		out: (operand: number) => {
			i += 2;
			return (combo(operand) % 8).toString() + ",";
		},
		bdv: (operand: number) => {
			reg.b = Math.floor(reg.a / Math.pow(2, combo(operand)));
			i += 2;
			return "";
		},
		cdv: (operand: number) => {
			reg.c = Math.floor(reg.a / Math.pow(2, combo(operand)));
			i += 2;
			return "";
		},
	};

	let output = "";

	while (i < instructions.length - 1) {
		const opCode = instructions[i];
		const operator = Object.keys(instruction)[opCode];
		const operand = instructions[i + 1];

		output += instruction[operator](operand);
	}

	return { ans: output.slice(0, -1), register: reg };
}

function part2({ registers, program }: InputProps): number {
	function combo(op: number) {
		if (op < 0 || op >= 7) throw new Error("Invalid combo operand");

		switch (op) {
			case 4:
				return reg.a;

			case 5:
				return reg.b;

			case 6:
				return reg.c;

			default:
				return op;
		}
	}

	function isOutMatch(a: number) {
		const reg = { ...registers, a: a };
		const output: number[] = [];
		let i = 0;

		while (i < program.length - 1 && output.length < program.length) {
			const operand = program[i + 1];
			switch (program[i]) {
				case 0:
					reg.a = Math.floor(reg.a / Math.pow(2, combo(operand)));
					i += 2;
					break;
				case 3:
					if (reg.a === 0) i += 2;
					else i = operand;
					break;
				case 5:
					if (combo(operand) % 8 !== program[output.length]) return false;
					output.push(combo(operand) % 8);
					break;
				default:
					break;
			}
		}

		return true;
	}

	let a = 0;
	while (!isOutMatch(a)) {
		if (a % 10000 === 0) console.log(a);
		a++;
	}

	return a;
}

const params = parseInput();
console.log(part1(params));
console.log(part2(params));
