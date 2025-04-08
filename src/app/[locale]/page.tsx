'use server'

import ContextProviders from './ContextProviders';
import App from '@/components/App';

export default async function Page() {
	return (
		<ContextProviders>
			<App/>
		</ContextProviders>
	);
}
