'use server'

import App from '@/components/App';
import ContextProviders from '@/app/[locale]/ContextProviders';
import OfflineSync from '@/components/OfflineSync';

type Props = {
	params: Promise<{id: string}>
}

export default async function Page({params}: Props) {
	const {id} = await params;

	return (
		<ContextProviders idProvider={{id}}>
			<OfflineSync/>
			<App/>
		</ContextProviders>
	);
}
