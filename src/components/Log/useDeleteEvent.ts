import {type Dispatch, type SetStateAction, useCallback, useState} from 'react';
import type {ErrorState} from '@/types';
import deleteEvent from '@/app/actions/deleteEvent';
import {onlineManager} from '@tanstack/query-core';
import {useQueryClient} from '@tanstack/react-query';
import useStore from '@/store';
import {useTranslations} from 'next-intl';

type Args = {
	setError: Dispatch<SetStateAction<ErrorState | false>>
}

export function useDeleteEvent({
	setError,
}: Args) {
	const t = useTranslations('log.table');
	const [loadingId, setLoadingId] = useState<number | null>(null);
	const purgePendingEvents = useStore(state => state.purgePendingEvents);
	const addPendingDelete = useStore(state => state.addPendingDelete);
	const queryClient = useQueryClient();

	const deleteEventById = useCallback(async (id: number) => {
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

	return {
		deleteEvent: deleteEventById,
		loadingId,
	}
}