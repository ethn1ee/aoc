import { getInput } from "./get-input";

const input = await getInput(2024, 9);

function parseInput(): number[] {
	return input.split("").map(Number);
}

function part1(diskMap: number[]): number {
	function createFiles(): number[] {
		const files: number[] = [];
		let currID = 0; // use negative currID for free space

		diskMap.forEach((block) => {
			const file: number[] = Array.from({ length: block }, () => {
				if (currID >= 0) return currID;
				return -1;
			});

			files.push(...file);

			currID = currID >= 0 ? -(currID + 1) : -currID;
		});

		return files;
	}

	const files = createFiles();
	let currFreeSpace = 0;
	let i = files.length - 1;

	while (true) {
		while (files[currFreeSpace] >= 0) currFreeSpace++; // find next free space
		if (currFreeSpace > i) break;
		files[currFreeSpace] = files[i];
		files[i] = -1;
		i--;
	}

	const checksum = files.reduce(
		(sum, val, pos) => (val === -1 ? sum : sum + val * pos),
		0
	);

	return checksum;
}

function part2(diskMap: number[]): number {
	type Slot = { pos: number; size: number; val?: number };

	const files: Slot[] = [];
	const spaces: Slot[] = [];

	let currPos = 0;
	diskMap.forEach((size, i) => {
		if (i % 2 === 0) files.push({ pos: currPos, size: size, val: i / 2 });
		else spaces.push({ pos: currPos, size: size });
		currPos += size;
	});

	for (const file of files.reverse()) {
		const leftMostFreeIdx = spaces.findIndex(
			(space) => space.size >= file.size && space.pos < file.pos
		);
		const leftMostFreeSpace = spaces[leftMostFreeIdx];

		if (leftMostFreeSpace) {
			file.pos = leftMostFreeSpace.pos;
			leftMostFreeSpace.size -= file.size;
			leftMostFreeSpace.pos += file.size;

			if (leftMostFreeSpace.size === 0) spaces.splice(leftMostFreeIdx, 1);
		}
	}

	const checksum = files.reduce((sum, { pos, size, val }) => {
		let temp = 0;
		for (let i = pos; i < pos + size; i++) {
			temp += i * val!;
		}
		return sum + temp;
	}, 0);

	return checksum;
}

const diskMap = parseInput();
console.log(part1(diskMap));
console.log(part2(diskMap));
