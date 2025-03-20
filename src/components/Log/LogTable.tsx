import {useEffect, useRef, useState} from 'react';
import type {Event} from '@/types';
import {TrashIcon} from '@heroicons/react/16/solid';
import {useAnimate} from 'motion/react';
import {useQueryClient} from '@tanstack/react-query';

type Props = {
	events: Event[]
}

export default function LogTable({events}: Props) {
	const queryClient = useQueryClient();
	const [scope, animate] = useAnimate();
	const [renderedEvents, setRenderedEvents] = useState<Event[]>();
	const containerRef = useRef<HTMLDivElement>(null);

	const handleDelete = async (id: number) => {
		await fetch(`/api/delete?id=${id}`);
		queryClient.refetchQueries({queryKey: ['data']});
	};

	// 1. Slide up the log.
	useEffect(() => {
		if (!scope.current || !containerRef.current) {
			return;
		}

		// Ensure scroll position not getting shifted by the slide animation.
		if (
			containerRef.current.style.height === ''
			|| parseInt(containerRef.current.style.height) < scope.current.clientHeight
		) {
			containerRef.current.style.height = `${scope.current.clientHeight}px`;
		}

		animate(scope.current, {height: 0}, {
			duration: 0.4,
			ease: 'easeOut',
			onComplete: () => {
				// 2. Change the data of the log.
				setRenderedEvents(events);
			}
		});
	}, [animate, events, scope]);

	// 3. Slide down the log, now containing the new data.
	useEffect(() => {
		if (!scope.current) {
			return;
		}

		animate(scope.current, {height: 'auto'}, {
			duration: 0.4,
			ease: 'easeIn',
		});
	}, [animate, renderedEvents, scope]);

	// Initially set the rendered events as animation(s) are not supposed to run initially.
	useEffect(() => {
		if (!renderedEvents) {
			setRenderedEvents(events);
		}
	}, [events, renderedEvents]);

	if (!renderedEvents || renderedEvents.length === 0) {
		return null;
	}

	return (
		<div ref={containerRef}>
			<div className="overflow-hidden" ref={scope}>
				<table className="w-full">
					<thead>
						<tr>
							<th>Time</th>
							<th>Amount</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{
							renderedEvents.map(event => (
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
			</div>
		</div>
	);
}
