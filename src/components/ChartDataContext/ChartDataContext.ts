import type {ChartData} from '@/types';
import {type QueryStatus} from '@tanstack/react-query';
import {createContext, Dispatch, SetStateAction} from 'react';

export interface ChartDataContextType {
	chartData?: ChartData
	setResetSync: Dispatch<SetStateAction<{events: number[], delete: number[]} | undefined>>
	setTargetDate: Dispatch<SetStateAction<Date | undefined>>
	status: QueryStatus
}

const ChartDataContext = createContext<ChartDataContextType | null>(null);

export default ChartDataContext;
