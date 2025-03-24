'use client'

import {AnimatePresence, motion} from 'motion/react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import type {ErrorState} from '@/types';
import LogAnimatedTable from './LogAnimatedTable';
import LogNavigation from './LogNavigation';
import LogTable from '@/components/Log/LogTable';
import SecondaryHeader from '@/components/SecondaryHeader';
import deleteEvent from '@/app/actions/deleteEvent';
import {formatDate} from '@/lib/util';
import useChartDataContext from '@/components/ChartDataContext';
import {useQueryClient} from '@tanstack/react-query';
import {useTranslations} from 'next-intl';

export default function Log() {
	const t = useTranslations('log');
	const queryClient = useQueryClient();
	const {chartData} = useChartDataContext();
	const [error, setError] = useState<ErrorState | false>(false);

	// The currently viewed date in YYYY-MM-DD format
	const [currentDate, setCurrentDate] = useState<string>();

	// The data logged for the current date
	const currentDateValues = useMemo(() => {
		if (!chartData || !currentDate) {
			return;
		}

		return chartData.filter(datum => formatDate(new Date(datum.time)) === currentDate);
	}, [chartData, currentDate]);

	const handleDelete = useCallback(async (id: number) => {
		setError(false);

		const response = await deleteEvent({id});

		if (response.error) {
			setError(response.error);
			return;
		}

		queryClient.refetchQueries({queryKey: ['data']});
	}, [queryClient]);

	// Set the current date after rendering to prevent hydration error.
	useEffect(() => {
		if (!currentDate) {
			setCurrentDate(formatDate(new Date()));
		}
	}, [currentDate])

	return (
		<>
			<SecondaryHeader>{t('title')}</SecondaryHeader>
			<div className="layout-container">
				<div className="grid w-full">
					<LogNavigation
						currentDate={currentDate}
						resetError={() => setError(false)}
						setCurrentDate={setCurrentDate}
					/>
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
					{
						currentDateValues && (
							<LogAnimatedTable events={currentDateValues}>
								<LogTable onDelete={handleDelete}/>
							</LogAnimatedTable>
						)
					}
				</div>
			</div>
		</>
	);
}
