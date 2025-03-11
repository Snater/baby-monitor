import type {Event} from '@/types';
import {createContext, Dispatch, SetStateAction} from 'react';

export interface ChartDataContextType {
	chartData?: Event[]
	setChartData: Dispatch<SetStateAction<Event[] | undefined>>
}

const ChartDataContext = createContext<ChartDataContextType | null>(null);

export default ChartDataContext;
