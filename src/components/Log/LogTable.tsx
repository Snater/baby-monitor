import {type Dispatch, type SetStateAction, useCallback, useState} from 'react';
import type {ErrorState, Event} from '@/types';
import IconButton from '@/components/IconButton';
import LoadingSpinner from '@/components/LoadingSpinner';
import {TrashIcon} from '@heroicons/react/16/solid';
import deleteEvent from '@/app/actions/deleteEvent';
import {onlineManager} from '@tanstack/query-core';
import {useQueryClient} from '@tanstack/react-query';
import useStore from '@/store';
import {useTranslations} from 'next-intl';

type Props = {
	events?: Event[]
	setError: Dispatch<SetStateAction<ErrorState | false>>
}

export default function LogTable({events, setError}: Props) {
	const t = useTranslations('log.table');
	const [loadingId, setLoadingId] = useState<number | null>(null);
	const purgePendingEvents = useStore(state => state.purgePendingEvents);
	const addPendingDelete = useStore(state => state.addPendingDelete);
	const pendingDelete = useStore(state => state.pendingDelete);
	const queryClient = useQueryClient();

	const handleDelete = useCallback(async (id: number) => {
		setError(false);

		if (id < 0) {
			purgePendingEvents([id]);
			return;
		}

		if (!onlineManager.isOnline()) {
			addPendingDelete(id);
			return;
		}

		setLoadingId(id);

		try {
			const response = await deleteEvent({id});

			if (response.error) {
				setError(response.error);
				setLoadingId(null);
				return;
			}

			await queryClient.invalidateQueries({ queryKey: ['data'] });
			setLoadingId(null);

		} catch (error: unknown) {
			setError({
				message: t('unknownError'),
				error: error instanceof Error ? error : new Error(String(error)),
			});
			setLoadingId(null);
		}
	}, [addPendingDelete, purgePendingEvents, queryClient, setError, t]);

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
					events.map(event => {
						const isPendingDelete = pendingDelete.includes(event.id);
						const cellClass = [
							'text-center',
							event.id < 0 && 'opacity-40',
							isPendingDelete && 'line-through',
						].filter(Boolean).join(' ');

						return (
							<tr key={event.id}>
								<td className={cellClass}>
									{new Date(event.time).toLocaleTimeString(undefined, {timeStyle: 'short'})}
								</td>
								<td className={cellClass}>
									{t('amount', {amount: event.amount})}
								</td>
								<td className="text-center">
									<IconButton
										aria-label={t('delete')}
										className={`delete-button ${loadingId === event.id ? 'loading' : ''} ${isPendingDelete ? 'invisible' : ''}`}
										disabled={isPendingDelete || loadingId === event.id}
										onClick={() => handleDelete(event.id)}
									>
										{loadingId === event.id ? <LoadingSpinner/> : <TrashIcon/>}
									</IconButton>
								</td>
							</tr>
						);
					})
				}
			</tbody>
		</table>
	);
}
