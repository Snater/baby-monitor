import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/16/solid';
import {useCallback} from 'react';
import IconButton from '@/components/IconButton';
import useIdContext from '@/components/IdContext';
import useIsOnlineContext from '@/components/IsOnlineContext';
import {useQueryClient} from '@tanstack/react-query';
import useStore from '@/store';
import {useFormatter, useTranslations} from 'next-intl';

type Props = {
	resetError: () => void
}

export default function LogNavigation({resetError}: Props) {
	const t = useTranslations('log.navigation');
	const format = useFormatter();
	const queryClient = useQueryClient();
	const {isOnline} = useIsOnlineContext();
	const {id} = useIdContext();
	const currentDate = useStore(state => state.currentDate);
	const setCurrentDate = useStore(state => state.setCurrentDate);
	const loggedDates = useStore(state => state.loggedDates);
	const currentDateIndex = currentDate ? loggedDates?.indexOf(currentDate) : undefined;
	const canCheckLoggedDates = loggedDates && typeof currentDateIndex === 'number';
	const previousDate = canCheckLoggedDates && loggedDates[currentDateIndex - 1]
		? loggedDates[currentDateIndex - 1]
		: undefined;
	const nextDate = canCheckLoggedDates && loggedDates[currentDateIndex + 1]
		? loggedDates[currentDateIndex + 1]
		: undefined;

	const areDatesCached = isOnline || !currentDate
		? {previous: true, next: true}
		: {
			previous: queryClient.getQueryState(['data', id, previousDate])?.status === 'success',
			next: queryClient.getQueryState(['data', id, nextDate])?.status === 'success',
		};

	const changeDay = useCallback((direction: 'backward' | 'forward') => {
		if (!currentDate || !loggedDates || typeof currentDateIndex !== 'number') {
			return;
		}

		resetError();

		const newIndex = direction === 'backward' ? currentDateIndex - 1 : currentDateIndex + 1;

		if (newIndex < 0 || newIndex >= loggedDates.length) {
			return;
		}

		setCurrentDate(loggedDates[newIndex]);
	}, [currentDate, currentDateIndex, loggedDates, resetError, setCurrentDate]);

	return (
		<div className="grid grid-cols-[auto_1fr_auto] items-center mb-2">
			<div>
				<IconButton
					aria-label={t('previous')}
					disabled={!previousDate || !areDatesCached.previous}
					onClick={() => changeDay('backward')}
				>
					<ChevronLeftIcon className="stroke-primary-text stroke-[0.1]"/>
				</IconButton>
			</div>
			<div className="h-full text-xl">
				<div
					className="border-1 border-input-outline flex rounded-lg h-full items-center justify-center mx-3"
				>
					{currentDate && format.dateTime(new Date(`${currentDate}T00:00:00`), {dateStyle: 'medium'})}
				</div>
			</div>
			<div>
				<IconButton
					aria-label={t('next')}
					disabled={!nextDate || !areDatesCached.next}
					onClick={() => changeDay('forward')}
				>
					<ChevronRightIcon className="stroke-primary-text stroke-[0.1]"/>
				</IconButton>
			</div>
		</div>
	);
}
