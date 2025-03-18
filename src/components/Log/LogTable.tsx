import type {Event} from '@/types';
import {TrashIcon} from '@heroicons/react/16/solid';
import {useQueryClient} from '@tanstack/react-query';

type Props = {
	events: Event[]
}

export default function LogTable({events}: Props) {
	const queryClient = useQueryClient();

	const handleDelete = async (id: number) => {
		await fetch(`/api/delete?id=${id}`);
		queryClient.refetchQueries({queryKey: ['data']});
	};

	if (!events) {
		return null;
	}

	return (
		<table>
			<thead>
				<tr>
					<th>Time</th>
					<th>Amount</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{
					events.map(event => (
						<tr key={event.id}>
							<td className="text-center">
								{
									new Date(event.time).toLocaleTimeString(
										undefined,
										{timeStyle: 'short'}
									)
								}
							</td>
							<td className="text-center">
								{event.amount}&thinsp;ml
							</td>
							<td className="text-center">
								<button
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
