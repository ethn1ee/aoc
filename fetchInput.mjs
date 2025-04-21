import "dotenv/config";

const SESSION = process.env.SESSION_TOKEN;
if (!SESSION) {
	console.error("❌ SESSION_TOKEN not set in .env");
	process.exit(1);
}

export async function getInput(year, day) {
	const url = `https://adventofcode.com/${year}/day/${day}/input`;
	const res = await fetch(url, {
		headers: { Cookie: `session=${SESSION}` },
	});
	if (!res.ok) {
		throw new Error(`Day ${day}: ${res.status} ${res.statusText}`);
	}
	return (await res.text()).trimEnd();
}
