import {Dispatch, Ref, SetStateAction, useEffect, useState} from 'react';
import {Input} from '@headlessui/react';
import useStore from '@/store';
import {useTranslations} from 'next-intl';

const pad = (n: number) => String(n).padStart(2, '0');

function toLocalInputValue(date: Date): string {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

type Props = {
	readOnly: boolean
	setTime: Dispatch<SetStateAction<Date | undefined>>
	time?: Date
}

export default function TimeInput({readOnly, setTime, time}: Props) {
	const t = useTranslations('form.timeInput');
	const stopUpdatingTime = useStore(state => state.stopUpdatingTime);
	const setStopUpdatingTime = useStore(state => state.setStopUpdatingTime);

	useEffect(() => {
		// Avoid hydration mismatch of the time by having it set on client initialization only.
		setTime(new Date());
	}, [setTime]);

	useEffect(() => {
		if (stopUpdatingTime) {
			return;
		}

		const intervalId = setInterval(() => {
			setTime(new Date());
		}, 5000);

		return () => clearInterval(intervalId);
	}, [setTime, stopUpdatingTime]);

	return (
		<>
			<label className="sr-only" htmlFor="datetime">{t('label')}</label>
			<div className="input-container">
				<Input
					className="min-w-0 grow w-full"
					id="datetime"
					name="datetime"
					onBlur={() => setStopUpdatingTime(false)}
					onChange={event => setTime(new Date(event.target.value))}
					onFocus={() => setStopUpdatingTime(true)}
					readOnly={readOnly}
					type="datetime-local"
					value={time ? toLocalInputValue(time) : ''}
				/>
			</div>
		</>
	)
}
