import Chart from '@/components/Chart';
import Form from '@/components/Form';

export default function Home() {
	return (
		<main className="flex flex-col gap-8 items-center">
			<h1>👶 Baby Monitor 🍼</h1>
			<Chart/>
			<Form/>
		</main>
	);
}
