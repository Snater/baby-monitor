'use server'

import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query';
import ContextProviders from '@/app/[id]/ContextProviders';
import Chart from '@/components/Chart';
import Form from '@/components/Form/Form';
import HeaderBar from '@/components/HeaderBar';
import Log from '@/components/Log';

type Props = {
	params: Promise<{id: string}>
}

export default async function Page({params}: Props) {
	const {id} = await params;
	const queryClient = new QueryClient();

	return (
		<>
			<HeaderBar/>
			<main className="flex flex-col items-center">
				<HydrationBoundary state={dehydrate(queryClient)}>
					<ContextProviders idProvider={{id}}>
						<Chart/>
						<Form/>
						<Log/>
					</ContextProviders>
				</HydrationBoundary>
			</main>
		</>
	);
}
