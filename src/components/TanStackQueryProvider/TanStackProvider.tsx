'use client'

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {type PropsWithChildren, useState} from 'react';

type Props = PropsWithChildren

export default function TanStackQueryProvider({children}: Props) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
}
