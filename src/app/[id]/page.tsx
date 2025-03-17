'use server'

import ContextProviders from '@/app/[id]/ContextProviders';
import Chart from '@/components/Chart';
import Form from '@/components/Form/Form';
import HeaderBar from '@/components/HeaderBar';
import List from '@/components/List';

type Props = {
	params: Promise<{id: string}>
}

export default async function Page({params}: Props) {
	const {id} = await params;

	return (
		<>
			<HeaderBar/>
			<main className="flex flex-col items-center">
				<ContextProviders idProvider={{id}}>
					<Chart/>
					<Form/>
					<List/>
				</ContextProviders>
			</main>
		</>
	);
}
