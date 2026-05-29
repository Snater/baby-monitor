import type {Event, Unit} from '@/types';
import IconButton from '@/components/IconButton';
import LoadingSpinner from '@/components/LoadingSpinner';
import {STEP} from '@/lib/bottleVolume';
import {TrashIcon} from '@heroicons/react/16/solid';
import {mlToOz} from '@/lib/conversion';
import useStore from '@/store';
import {useTranslations} from 'next-intl';
import {useUnit} from '@/hooks/useUnit';

function roundToStep(ml: number, unit: Unit) {
	const step = STEP[unit];
	const value = unit === 'oz' ? mlToOz(ml) : ml;
	return Math.round(value / step) * step;
}

type Props = {
	event: Event
	isLoading?: boolean
	onDelete: () => Promise<void>
}

export default function LogTableRow({event, isLoading = false, onDelete}: Props) {
	const t = useTranslations('log.table');
	const pendingDelete = useStore(state => state.pendingDelete);
	const {unit} = useUnit();

	const isPendingDelete = pendingDelete.includes(event.id);
	const cellClass = [
		'text-center',
		event.id < 0 && 'opacity-40',
		isPendingDelete && 'line-through',
	].filter(Boolean).join(' ');

	return (
		<tr>
			<td className={cellClass}>
				{new Date(event.time).toLocaleTimeString(undefined, {timeStyle: 'short'})}
			</td>
			<td className={cellClass}>
				{t('amount', {amount: roundToStep(event.amount, unit), unit})}
			</td>
			<td className="text-center">
				<IconButton
					aria-label={t('delete')}
					className={`delete-button ${isLoading ? 'loading' : ''} ${isPendingDelete ? 'invisible' : ''}`}
					disabled={isPendingDelete || isLoading}
					onClick={onDelete}
				>
					{isLoading ? <LoadingSpinner/> : <TrashIcon/>}
				</IconButton>
			</td>
		</tr>
	);
}
