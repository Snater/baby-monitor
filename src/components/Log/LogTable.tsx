import {type Dispatch, type SetStateAction} from 'react';
import type {ErrorState, Event} from '@/types';
import LogTableRow from "@/components/Log/LogTableRow";
import {useTranslations} from 'next-intl';
import {useDeleteEvent} from "@/components/Log/useDeleteEvent";

type Props = {
	events?: Event[]
	setError: Dispatch<SetStateAction<ErrorState | false>>
}

export default function LogTable({events, setError}: Props) {
	const t = useTranslations('log.table');
	const {deleteEvent, loadingId} = useDeleteEvent({setError});

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
						<LogTableRow
							key={event.id}
							event={event}
							isLoading={loadingId === event.id}
							onDelete={deleteEvent}
						/>
					))
				}
			</tbody>
		</table>
	);
}
