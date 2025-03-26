import type {Event} from '@/types';
import IconButton from '@/components/IconButton';
import LoadingSpinner from '@/components/LoadingSpinner';
import {TrashIcon} from '@heroicons/react/16/solid';
import {useTranslations} from 'next-intl';

export type Props = {
	events?: Event[]
	/**
	 * The id of the event a delete button corresponds to.
	 */
	loading: number | false
	onDelete: (id: number) => void
}

export default function LogTable({events, loading, onDelete}: Props) {
	const t = useTranslations('log.table');

	if (!events) {
		return null;
	}

	return (
		<table className="w-full">
			<thead>
				<tr>
					<th>{t('header.time')}</th>
					<th>{t('header.amount')}</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{
					events.map(event => (
						<tr key={event.id}>
							<td className="text-center">
								{new Date(event.time).toLocaleTimeString(undefined, {timeStyle: 'short'})}
							</td>
							<td className="text-center">
								{t('amount', {amount: event.amount})}
							</td>
							<td className="text-center">
								<IconButton
									aria-label={t('delete')}
									className="delete-button"
									onClick={() => onDelete(event.id)}
								>
									{loading === event.id ? <LoadingSpinner/> : <TrashIcon/>}
								</IconButton>
							</td>
						</tr>
					))
				}
			</tbody>
		</table>
	);
}
