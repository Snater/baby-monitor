import type {Event} from '@/types';
import {type QueryStatus} from '@tanstack/react-query';
import {createContext} from 'react';

export interface ChartDataContextType {
	chartData?: Event[]
	status: QueryStatus
}

const ChartDataContext = createContext<ChartDataContextType | null>(null);

export default ChartDataContext;
