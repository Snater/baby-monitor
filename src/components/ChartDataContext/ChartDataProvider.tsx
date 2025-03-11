import {PropsWithChildren, useState} from 'react';
import ChartDataContext from './ChartDataContext';
import type {Event} from '@/types';

type Props = PropsWithChildren

export default function ChartDataProvider({children}: Props) {
	const [chartData, setChartData] = useState<Event[]>();

return (
		<ChartDataContext.Provider value={{chartData, setChartData}}>
			{children}
		</ChartDataContext.Provider>
	);
}
