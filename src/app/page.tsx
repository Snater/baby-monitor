import Chart from '@/components/Chart';
import Form from '@/components/Form';

export default function Home() {
	return (
		<div className="container mx-auto max-w-md px-3 py-4">
			<main className="flex flex-col gap-8 items-center">
				<h1>👶 Baby Monitor 🍼</h1>
				<Chart/>
				<Form/>
			</main>
		</div>
	);
}
