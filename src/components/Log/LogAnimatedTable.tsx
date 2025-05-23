import {Dispatch, SetStateAction, memo, useEffect, useRef, useState} from 'react';
import type {ErrorState, Event} from '@/types';
import LogTable from './LogTable';
import {useAnimate} from 'motion/react';
import {useTranslations} from 'next-intl';

type Props = {
	events?: Event[]
	setError: Dispatch<SetStateAction<ErrorState | false>>
}

/**
 * Memoizing since `events` will be a new array instance whenever the chart data is (re)fetched.
 * Therefore, comparing the actual `events`.
 */
export default memo(function LogAnimatedTable({events, setError}: Props) {
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
				{renderedEvents && renderedEvents.length === 0 ? t('placeholder') : null}
				{
					renderedEvents && renderedEvents.length > 0
						? <LogTable events={renderedEvents} setError={setError}/>
						: null
				}
			</div>
		</div>
	);
}, (oldProps, newProps) => {

	if (newProps.events === undefined) {
		// `newProps.events` is undefined whenever the first time fetching a query (query not being
		// cached yet. In that event, instead of the component to be rerendered, the animation will be
		// triggered within the component with the (obsolete) data from the previous query.
		return true;
	}

	if (oldProps.events === undefined) {
		// Only supposed to be undefined on first render. `newProps.events` not being undefined is
		// checked before, so it can be sure the props are not equal.
		return false;
	}

	if (oldProps.events.length !== newProps.events.length) {
		return false;
	}

	for (let i = 0; i < oldProps.events.length; i++) {
		if (
			oldProps.events[i].id !== newProps.events[i].id
		) {
			return false;
		}
	}

	return true;
});
