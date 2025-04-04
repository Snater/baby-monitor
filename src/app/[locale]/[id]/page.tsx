'use server'

import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query';
import ContextProviders from '@/app/[locale]/[id]/ContextProviders';
import Chart from '@/components/Chart';
import Form from '@/components/Form/Form';
import HeaderBar from '@/components/HeaderBar';
import Log from '@/components/Log';
import OfflineSync from '@/components/OfflineSync';
import PurgeDatabase from '@/components/PurgeDatabase';

type Props = {
	params: Promise<{id: string}>
}

export default async function Page({params}: Props) {
	const {id} = await params;
	const queryClient = new QueryClient();

	return (
		<>
			<PurgeDatabase/>
			<HeaderBar/>
			<main className="flex flex-col items-center pt-2">
				<HydrationBoundary state={dehydrate(queryClient)}>
					<ContextProviders idProvider={{id}}>
						<OfflineSync/>
						<Chart/>
						<Form/>
						<Log/>
					</ContextProviders>
				</HydrationBoundary>
			</main>
		</>
	);
}
