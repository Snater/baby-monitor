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
	const deleted = useStore(state => state.logDeleteDone);
	const setDeleted = useStore(state => state.setLogDeleteDone);
	const removePendingEvents = useStore(state => state.removePendingEvents);
	const queryClient = useQueryClient();

	const handleDelete = useCallback(async (id: number) => {
		setError(false);

		if (id < 0) {
			setDeleted(id);
			removePendingEvents([id]);
			return;
		}

		setLoading(id);

		const response = await deleteEvent({id});

		setDeleted(id);
		setLoading(0);

		if (response.error) {
			setError(response.error);
			return;
		}

		await queryClient.invalidateQueries({queryKey: ['data']});
	}, [removePendingEvents, queryClient, setDeleted, setError, setLoading]);

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
							<td className={`text-center ${event.id < 0 ? 'opacity-40' : ''}`}>
								{new Date(event.time).toLocaleTimeString(undefined, {timeStyle: 'short'})}
							</td>
							<td className={`text-center ${event.id < 0 ? 'opacity-40' : ''}`}>
								{t('amount', {amount: event.amount})}
							</td>
							<td className="text-center">
								<IconButton
									aria-label={t('delete')}
									className={`delete-button ${loading === event.id ? 'loading' : ''}`}
									disabled={deleted === event.id || loading > 0}
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
