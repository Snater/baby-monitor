import type {Event} from '@/types';
import {TrashIcon} from '@heroicons/react/16/solid';
import {useTranslations} from 'next-intl';

export type Props = {
	events?: Event[]
	onDelete: (id: number) => void
}

export default function LogTable({events, onDelete}: Props) {
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
								<button
									aria-label={t('delete')}
									className="delete-button"
									onClick={() => onDelete(event.id)}
								>
									<TrashIcon/>
								</button>
							</td>
						</tr>
					))
				}
			</tbody>
		</table>
	);
}
