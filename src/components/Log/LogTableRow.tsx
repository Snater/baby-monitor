import type {Event} from '@/types';
import IconButton from '@/components/IconButton';
import LoadingSpinner from '@/components/LoadingSpinner';
import {TrashIcon} from '@heroicons/react/16/solid';
import useStore from '@/store';
import {useTranslations} from 'next-intl';

type Props = {
	event: Event
	isLoading?: boolean
	onDelete: (id: number) => Promise<void>
}

export default function LogTableRow({event, isLoading = false, onDelete}: Props) {
	const t = useTranslations('log.table');
	const pendingDelete = useStore(state => state.pendingDelete);

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
				{t('amount', {amount: event.amount})}
			</td>
			<td className="text-center">
				<IconButton
					aria-label={t('delete')}
					className={`delete-button ${isLoading ? 'loading' : ''} ${isPendingDelete ? 'invisible' : ''}`}
					disabled={isPendingDelete || isLoading}
					onClick={() => onDelete(event.id)}
				>
					{isLoading ? <LoadingSpinner/> : <TrashIcon/>}
				</IconButton>
			</td>
		</tr>
	);
}
