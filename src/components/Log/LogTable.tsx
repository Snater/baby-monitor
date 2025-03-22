import type {Event} from '@/types';
import {TrashIcon} from '@heroicons/react/16/solid';
import {useQueryClient} from '@tanstack/react-query';
import {useTranslations} from 'next-intl';

type Props = {
	events: Event[]
}

export default function LogTable({events}: Props) {
	const t = useTranslations('log.table');
	const queryClient = useQueryClient();

	const handleDelete = async (id: number) => {
		await fetch(`/api/delete?id=${id}`);
		queryClient.refetchQueries({queryKey: ['data']});
	};

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
									onClick={() => handleDelete(event.id)}
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
