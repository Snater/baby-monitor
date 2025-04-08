import Chart from '@/components/Chart';
import Form from '@/components/Form';
import HeaderBar from '@/components/HeaderBar';
import Log from '@/components/Log';
import PurgeDatabase from '@/components/PurgeDatabase';

export default function App() {
	return (
		<>
			<PurgeDatabase/>
			<HeaderBar/>
			<main className="flex flex-col items-center pt-2">
				<Chart/>
				<Form/>
				<Log/>
			</main>
		</>
	);
}
