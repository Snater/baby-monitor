import ChartDataContext, {type ChartDataContextType} from './ChartDataContext';
import {use} from 'react';

export default function useChartDataContext(): ChartDataContextType {
	const context = use(ChartDataContext);

	if (!context) {
		throw new Error('useChartDataContext must be used within a ChartDataProvider');
	}

	return context;
}
