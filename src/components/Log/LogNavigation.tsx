import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/16/solid';
import {Dispatch, SetStateAction, useCallback, useMemo} from 'react';
import {formatDate} from '@/lib/util';
import useChartDataContext from '@/components/ChartDataContext';
import {useTranslations} from 'next-intl';

type Props = {
	currentDate?: string
	resetError: () => void
	setCurrentDate: Dispatch<SetStateAction<string | undefined>>
}

export default function LogNavigation({currentDate, resetError, setCurrentDate}: Props) {
	const t = useTranslations('log.navigation');
	const {chartData} = useChartDataContext();

	// The dates that data has been logged for
	const loggedDates = useMemo(() => {
		if (!chartData) {
			return;
		}

		const dates = chartData.reduce<string[]>((dates, event) => {
			const eventDate = formatDate(new Date(event.time));

			return dates.includes(eventDate) ? dates : [...dates, eventDate];
		}, []);

		const today = formatDate(new Date());

		// While there may not yet be logged values for today, ensure today is available for navigation.
		if (!dates.includes(today)) {
			dates.push(today);
		}

		return dates;
	}, [chartData]);

	const currentDateIndex = currentDate ? loggedDates?.indexOf(currentDate) : undefined;
	const canCheckLoggedDates = loggedDates && typeof currentDateIndex == 'number';
	const previousDate = canCheckLoggedDates && loggedDates[currentDateIndex - 1]
		? loggedDates[currentDateIndex - 1]
		: undefined;
	const nextDate = canCheckLoggedDates && loggedDates[currentDateIndex + 1]
		? loggedDates[currentDateIndex + 1]
		: undefined;

	const changeDay = useCallback((direction: 'backward' | 'forward') => {
		if (!currentDate || !loggedDates) {
			return;
		}

		resetError();

		setCurrentDate(currentDate => {
			if (!currentDate || typeof currentDateIndex !== 'number' || !loggedDates) {
				return currentDate;
			}

			const newIndex = direction === 'backward' ? currentDateIndex - 1 : currentDateIndex + 1;

			if (newIndex < 0 || newIndex >= loggedDates.length) {
				return currentDate;
			}

			return loggedDates[newIndex];
		});
	}, [currentDate, currentDateIndex, loggedDates, resetError, setCurrentDate]);

	return (
		<div className="grid grid-cols-[auto_1fr_auto] items-center mb-2">
			<div>
				<button
					aria-label={t('previous')}
					disabled={!previousDate}
					onClick={() => changeDay('backward')}
				>
					<ChevronLeftIcon className="mx-1 h-6 w-6 stroke-white stroke-[0.1]"/>
				</button>
			</div>
			<div className="h-full text-xl">
				<div
					className="border-1 border-stone-300 flex rounded-lg h-full items-center justify-center mx-3"
				>
					{currentDate && new Date(currentDate).toLocaleDateString()}
				</div>
			</div>
			<div>
				<button
					aria-label={t('next')}
					disabled={!nextDate}
					onClick={() => changeDay('forward')}
				>
					<ChevronRightIcon className="mx-1 h-6 w-6 stroke-white stroke-[0.1]"/>
				</button>
			</div>
		</div>
	);
}
