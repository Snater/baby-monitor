'use client'

import {ChevronLeftIcon, ChevronRightIcon, TrashIcon} from '@heroicons/react/16/solid';
import {useCallback, useEffect, useMemo, useState} from 'react';
import useChartDataContext from '@/components/ChartDataContext';
import {formatDate} from '@/lib/util';
import {useQueryClient} from '@tanstack/react-query';

export default function List() {
	const {chartData} = useChartDataContext();
	const queryClient = useQueryClient();

	// The currently viewed date in YYYY-MM-DD format
	const [currentDate, setCurrentDate] = useState<string>();

	// The dates that data has been logged for
	const loggedDates = useMemo(() => {
		if (!chartData) {
			return;
		}

		return chartData.reduce<string[]>((dates, event) => {
			const eventDate = formatDate(new Date(event.time));

			return dates.includes(eventDate) ? dates : [...dates, eventDate];
		}, []);
	}, [chartData]);

	const currentDateIndex = currentDate ? loggedDates?.indexOf(currentDate) : undefined;
	const previousDate = loggedDates && currentDateIndex && loggedDates[currentDateIndex - 1]
		? loggedDates[currentDateIndex - 1]
		: undefined;
	const nextDate = loggedDates && currentDateIndex && loggedDates[currentDateIndex + 1]
		? loggedDates[currentDateIndex + 1]
		: undefined;

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

	const changeDay = useCallback((direction: 'backward' | 'forward') => {
		if (!currentDate || !loggedDates) {
			return;
		}

		setCurrentDate(currentDate => {
			if (!currentDate || !currentDateIndex || !loggedDates) {
				return currentDate;
			}

			const newIndex = direction === 'backward' ? currentDateIndex - 1 : currentDateIndex + 1;

			if (newIndex < 0 || newIndex >= loggedDates.length) {
				return currentDate;
			}

			return loggedDates[newIndex];
		});
	}, [currentDate, currentDateIndex, loggedDates]);

	const handleDelete = async (time: number) => {
		await fetch(`/api/delete?time=${time}`);
		queryClient.refetchQueries({queryKey: ['data']});
	};

	return (
		<div className="w-full pb-4">
			<h2>🍼 Log</h2>

			<div className="flex items-center justify-between">
				<div>
					<button
						aria-label="previous day"
						disabled={!previousDate}
						onClick={() => changeDay('backward')}
					>
						<ChevronLeftIcon
							aria-label="one day backward"
							className="mx-1 h-6 w-6 stroke-white stroke-[0.1]"
						/>
					</button>
				</div>
				<div className="font-bold">{currentDate && new Date(currentDate).toLocaleDateString()}</div>
				<div>
					<button
						aria-label="next day"
						disabled={!nextDate}
						onClick={() => changeDay('forward')}
					>
						<ChevronRightIcon
							aria-label="one day forward"
							className="mx-1 h-6 w-6 stroke-white stroke-[0.1]"
						/>
					</button>
				</div>
			</div>

			{
				currentDateValues && (
					<div className="grid gap-3">
						<table>
							<thead>
								<tr>
									<th>Time</th>
									<th>Amount</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{
									currentDateValues.map(currentDateValue => (
										<tr key={currentDateValue.time}>
											<td className="text-center">
												{new Date(currentDateValue.time).toLocaleTimeString()}
											</td>
											<td className="text-center">
												{currentDateValue.amount}&thinsp;ml
											</td>
											<td className="text-center">
												<button
													className="w-auto bg-transparent"
													onClick={() => handleDelete(currentDateValue.time)}
												>
													<TrashIcon className="fill-red-700 h-6 w-6"/>
												</button>
											</td>
										</tr>
									))
								}
							</tbody>
						</table>
					</div>
				)
			}

		</div>
	);
}
