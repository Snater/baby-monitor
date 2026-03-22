import Chart from '@/components/Chart';
import DailySummary from "@/components/DailySummary";
import Form from '@/components/Form';
import HeaderBar from '@/components/HeaderBar';
import Log from '@/components/Log';
import PurgeDatabase from '@/components/PurgeDatabase';
import ServiceWorker from './ServiceWorker';
import {Suspense} from 'react';

type Props = {
	id?: string
}

export default function App({id}: Props) {
	return (
		<>
			<ServiceWorker/>
			<PurgeDatabase/>
			<HeaderBar/>
			<main className="flex flex-col items-center pt-2">
				<Suspense>
					<DailySummary id={id}/>
				</Suspense>
				<Chart/>
				<Form/>
				<Log/>
			</main>
		</>
	);
}
