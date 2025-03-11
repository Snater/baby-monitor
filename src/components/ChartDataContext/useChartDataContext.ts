import ChartDataContext, {type ChartDataContextType} from './ChartDataContext';
import {useContext} from 'react';

export default function useChartDataContext(): ChartDataContextType {
	const context = useContext(ChartDataContext);

	if (!context) {
		throw new Error('useChartDataContext must be used within a ChartDataProvider');
	}

	return context;
}
