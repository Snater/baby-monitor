import type {ChartData} from '@/types';
import {type QueryStatus} from '@tanstack/react-query';
import {createContext} from 'react';

export interface ChartDataContextType {
	chartData?: ChartData
	setTargetDate: (date: Date) => void
	status: QueryStatus
}

const ChartDataContext = createContext<ChartDataContextType | null>(null);

export default ChartDataContext;
