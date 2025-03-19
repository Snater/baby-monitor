import ChartDataContext from './ChartDataContext';
import type {Event} from '@/types';
import {PropsWithChildren} from 'react';
import useIdContext from '@/components/IdContext';
import {useQuery} from '@tanstack/react-query';

type Props = PropsWithChildren

export default function ChartDataProvider({children}: Props) {
	const {id} = useIdContext();

	const {data, status} = useQuery<Event[]>({
		queryKey: ['data', id],
		queryFn: async (): Promise<Event[]> => {
			const response = await fetch(`/api/get?id=${id}`);
			return response.json();
		},
	});

	return (
		<ChartDataContext.Provider value={{chartData: data, status}}>
			{children}
		</ChartDataContext.Provider>
	);
}
