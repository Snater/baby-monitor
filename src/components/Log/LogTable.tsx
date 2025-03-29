import type {ErrorState, Event} from '@/types';
import IconButton from '@/components/IconButton';
import LoadingSpinner from '@/components/LoadingSpinner';
import {TrashIcon} from '@heroicons/react/16/solid';
import {useTranslations} from 'next-intl';
import {Dispatch, SetStateAction, useCallback} from 'react';
import deleteEvent from '@/app/actions/deleteEvent';
import useStore from '@/store';
import {useQueryClient} from '@tanstack/react-query';

type Props = {
	events?: Event[]
	setError: Dispatch<SetStateAction<ErrorState | false>>
}

export default function LogTable({events, setError}: Props) {
	const t = useTranslations('log.table');
	const loading = useStore(state => state.logDeleteLoading);
	const setLoading = useStore(state => state.setLogDeleteLoading);
	const queryClient = useQueryClient();

	const handleDelete = useCallback(async (id: number) => {
		setError(false);
		setLoading(id);

		const response = await deleteEvent({id});

		setLoading(false);

		if (response.error) {
			setError(response.error);
			return;
		}

		await queryClient.refetchQueries({queryKey: ['data']});
	}, [queryClient, setError, setLoading]);

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
									onClick={() => handleDelete(event.id)}
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
