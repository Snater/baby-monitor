import {useEffect, useRef, useState} from 'react';
import type {Event} from '@/types';
import LogTable from './LogTable';
import {useAnimate} from 'motion/react';
import {useTranslations} from 'next-intl';

type Props = {
	events: Event[]
}

export default function LogAnimatedTable({events}: Props) {
	const t = useTranslations('log.table');
	const [scope, animate] = useAnimate();
	const [renderedEvents, setRenderedEvents] = useState<Event[]>();
	const containerRef = useRef<HTMLDivElement>(null);

	// 1. Slide up the log.
	useEffect(() => {
		if (!scope.current || !containerRef.current) {
			return;
		}

		// The log table should not be animated on first render, which the height style is used as
		// indication for: If there is no height style yet, skip the animation.
		if (containerRef.current.style.height === '') {
			setRenderedEvents(events);
			return;
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
			onComplete: () => {
				if (!containerRef.current) {
					return;
				}

				// Ensure scroll position not getting shifted by the slide animation.
				if (
					containerRef.current.style.height === ''
					|| parseInt(containerRef.current.style.height) < scope.current.clientHeight
				) {
					containerRef.current.style.height = `${scope.current.clientHeight}px`;
				}

			}
		});
	}, [animate, renderedEvents, scope]);

	return (
		<div ref={containerRef}>
			<div className="flex justify-center overflow-hidden" ref={scope}>
				{
					!renderedEvents || renderedEvents.length === 0
						? t('placeholder')
						: <LogTable events={renderedEvents}/>
				}
			</div>
		</div>
	);
}
