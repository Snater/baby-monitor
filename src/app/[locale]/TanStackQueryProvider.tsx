// https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr

'use client'

import {QueryClient} from '@tanstack/react-query';
import {type ReactNode, useState} from 'react';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				// All data fetched should be kept available when offline.
				gcTime: Infinity,
				staleTime: 60 * 1000,
			},
		},
	});
}

// Returns a no-op persister when storage is undefined (i.e. during SSR).
const persister = createAsyncStoragePersister({
	storage: typeof window !== 'undefined' ? window.localStorage : undefined,
});

export default function Providers({children}: {children: ReactNode}) {
	const [queryClient] = useState(makeQueryClient);

	return (
		<PersistQueryClientProvider client={queryClient} persistOptions={{persister}}>
			{children}
			<ReactQueryDevtools/>
		</PersistQueryClientProvider>
	);
}