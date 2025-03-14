import type {Event} from '@/types';
import {createContext} from 'react';

export interface ChartDataContextType {
	chartData?: Event[]
}

const ChartDataContext = createContext<ChartDataContextType | null>(null);

export default ChartDataContext;
