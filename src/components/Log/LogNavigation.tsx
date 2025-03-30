import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/16/solid';
import {useCallback, useMemo} from 'react';
import IconButton from '@/components/IconButton';
import {formatDate} from '@/lib/util';
import useChartDataContext from '@/components/ChartDataContext';
import useStore from '@/store';
import {useTranslations} from 'next-intl';

type Props = {
	resetError: () => void
}

export default function LogNavigation({resetError}: Props) {
	const t = useTranslations('log.navigation');
	const {chartData} = useChartDataContext();
	const currentDate = useStore(state => state.currentDate);
	const setCurrentDate = useStore(state => state.setCurrentDate);

	// The dates that data has been logged for
	const loggedDates = useMemo(() => {
		if (!chartData) {
			return;
		}

		const dates = chartData.events.reduce<string[]>((dates, event) => {
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

		if (!currentDate || typeof currentDateIndex !== 'number' || !loggedDates) {
			setCurrentDate(currentDate);
			return;
		}

		const newIndex = direction === 'backward' ? currentDateIndex - 1 : currentDateIndex + 1;

		if (newIndex < 0 || newIndex >= loggedDates.length) {
			setCurrentDate(currentDate);
			return;
		}

		setCurrentDate(loggedDates[newIndex]);

	}, [currentDate, currentDateIndex, loggedDates, resetError, setCurrentDate]);

	return (
		<div className="grid grid-cols-[auto_1fr_auto] items-center mb-2">
			<div>
				<IconButton
					aria-label={t('previous')}
					disabled={!previousDate}
					onClick={() => changeDay('backward')}
				>
					<ChevronLeftIcon className="stroke-primary-text stroke-[0.1]"/>
				</IconButton>
			</div>
			<div className="h-full text-xl">
				<div
					className="border-1 border-input-outline flex rounded-lg h-full items-center justify-center mx-3"
				>
					{currentDate && new Date(currentDate).toLocaleDateString()}
				</div>
			</div>
			<div>
				<IconButton
					aria-label={t('next')}
					disabled={!nextDate}
					onClick={() => changeDay('forward')}
				>
					<ChevronRightIcon className="stroke-primary-text stroke-[0.1]"/>
				</IconButton>
			</div>
		</div>
	);
}
