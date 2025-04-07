'use client'

import {AnimatePresence, motion} from 'motion/react';
import {useEffect, useMemo, useState} from 'react';
import type {ErrorState} from '@/types';
import LogAnimatedTable from './LogAnimatedTable';
import LogNavigation from './LogNavigation';
import SecondaryHeader from '@/components/SecondaryHeader';
import {formatDate} from '@/lib/util';
import useChartDataContext from '@/components/ChartDataContext';
import useStore from '@/store';
import {useTranslations} from 'next-intl';
import useIsOnlineContext from '@/components/IsOnlineContext';

export default function Log() {
	const t = useTranslations('log');
	const {chartData} = useChartDataContext();
	const [error, setError] = useState<ErrorState | false>(false);
	const {isOnline} = useIsOnlineContext();
	const currentDate = useStore(state => state.currentDate);
	const setCurrentDate = useStore(state => state.setCurrentDate);
	const pendingEvents = useStore(state => state.pendingEvents);

	// The data logged for the current date
	const currentDateValues = useMemo(() => {
		if (!chartData || !currentDate) {
			return;
		}

		const events = chartData.events
			.filter(datum => formatDate(new Date(datum.time)) === currentDate);

		return [...events, ...pendingEvents];
	}, [chartData, currentDate, pendingEvents]);

	// Set the current date after rendering to prevent hydration error.
	useEffect(() => {
		if (!currentDate) {
			setCurrentDate(formatDate(new Date()));
		}
	}, [currentDate, setCurrentDate])

	return (
		<>
			<SecondaryHeader>{t('title')}</SecondaryHeader>
			<div className="layout-container">
				<div className="grid w-full">
					<LogNavigation resetError={() => setError(false)}/>
					<AnimatePresence>
						{
							!isOnline && (
								<motion.div
									animate={{height: 'auto', opacity: 1}}
									className="overflow-hidden"
									exit={{height: 0, opacity: 0}}
									initial={{height: 0, opacity: 0}}
								>
									<div className="alert warning mb-3">
										{t('offline')}
									</div>
								</motion.div>
							)
						}
					</AnimatePresence>
					<AnimatePresence>
						{
							error && (
								<motion.div
									animate={{height: 'auto', opacity: 1}}
									className="overflow-hidden"
									exit={{height: 0, opacity: 0}}
									initial={{height: 0, opacity: 0}}
								>
									<div className="alert error mb-3">
										{error.message}
									</div>
								</motion.div>
							)
						}
					</AnimatePresence>
					<LogAnimatedTable events={currentDateValues} setError={setError}/>
				</div>
			</div>
		</>
	);
}
