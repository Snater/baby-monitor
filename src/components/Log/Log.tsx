'use client'

import {useEffect, useMemo, useState} from 'react';
import LogAnimatedTable from './LogAnimatedTable';
import LogNavigation from './LogNavigation';
import SecondaryHeader from '@/components/SecondaryHeader';
import {formatDate} from '@/lib/util';
import useChartDataContext from '@/components/ChartDataContext';

export default function Log() {
	const {chartData} = useChartDataContext();

	// The currently viewed date in YYYY-MM-DD format
	const [currentDate, setCurrentDate] = useState<string>();

	// The data logged for the current date
	const currentDateValues = useMemo(() => {
		if (!chartData || !currentDate) {
			return;
		}

		return chartData.filter(datum => formatDate(new Date(datum.time)) === currentDate);
	}, [chartData, currentDate]);

	// Set the current date after rendering to prevent hydration error.
	useEffect(() => {
		if (!currentDate) {
			setCurrentDate(formatDate(new Date()));
		}
	}, [currentDate])

	return (
		<>
			<SecondaryHeader>Log</SecondaryHeader>
			<div className="layout-container">
				<div className="w-full pb-4">
					<LogNavigation currentDate={currentDate} setCurrentDate={setCurrentDate}/>
					{
						currentDateValues && (
							<LogAnimatedTable events={currentDateValues}/>
						)
					}
				</div>
			</div>
		</>
	);
}
