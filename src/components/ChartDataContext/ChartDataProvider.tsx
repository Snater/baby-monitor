import ChartDataContext from './ChartDataContext';
import type {Event} from '@/types';
import {PropsWithChildren} from 'react';
import {useQuery} from '@tanstack/react-query';

type Props = PropsWithChildren

export default function ChartDataProvider({children}: Props) {

	const {data} = useQuery<Event[]>({
		queryKey: ['data'],
		queryFn: async (): Promise<Event[]> => {
			const response = await fetch('/api/get');
			return response.json();
		},
	});

	return (
		<ChartDataContext.Provider value={{chartData: data}}>
			{children}
		</ChartDataContext.Provider>
	);
}
