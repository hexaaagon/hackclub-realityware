import Link from "next/link";

export default function Home() {
	return (
		<main className="flex flex-col">
			<h1>this is the dashboard!</h1>
			<Link href="/debug" className="text-blue-500 underline">
				go to debug page
			</Link>
		</main>
	);
}
