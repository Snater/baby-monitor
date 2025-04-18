// https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr

'use client'

import {QueryClient, QueryClientProvider, isServer} from '@tanstack/react-query';
import {ReactNode} from 'react';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {createSyncStoragePersister} from '@tanstack/query-sync-storage-persister';
import {persistQueryClient} from '@tanstack/query-persist-client-core';

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

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
	if (isServer) {
		return makeQueryClient()
	} else {
		if (!browserQueryClient) {
			browserQueryClient = makeQueryClient();

			const localStoragePersister = createSyncStoragePersister({
				storage: window.localStorage,
			})

			persistQueryClient({
				queryClient: browserQueryClient,
				persister: localStoragePersister,
			});
		}
		return browserQueryClient;
	}
}

export default function Providers({children}: {children: ReactNode}) {
	const queryClient = getQueryClient()

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools/>
		</QueryClientProvider>
	);
}
