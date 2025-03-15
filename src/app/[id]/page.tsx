'use server'

import ContextProviders from '@/app/[id]/ContextProviders';
import Chart from '@/components/Chart';
import Form from '@/components/Form/Form';
import List from '@/components/List';

type Props = {
	params: Promise<{id: string}>
}

export default async function Page({params}: Props) {
	const {id} = await params;

	return (
		<div className="container mx-auto max-w-md px-3 py-4">
			<main className="flex flex-col gap-8 items-center">
				<h1>👶 Baby Monitor 🍼</h1>
				<ContextProviders idProvider={{id}}>
					<Chart/>
					<Form/>
					<List/>
				</ContextProviders>
			</main>
		</div>
	);
}
