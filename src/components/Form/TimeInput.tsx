import {Ref, useEffect, useState} from 'react';
import {Input} from '@headlessui/react';
import useStore from '@/store';
import {useTranslations} from 'next-intl';

const pad = (n: number) => String(n).padStart(2, '0');

function toLocalInputValue(date: Date): string {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

type Props = {
	readOnly: boolean
	ref: Ref<HTMLInputElement>
}

export default function TimeInput({readOnly, ref}: Props) {
	const t = useTranslations('form.timeInput');
	const [selectedTime, setSelectedTime] = useState<Date | null>(null);
	const stopUpdatingTime = useStore(state => state.stopUpdatingTime);
	const setStopUpdatingTime = useStore(state => state.setStopUpdatingTime);

	useEffect(() => {
		// Avoid hydration mismatch of the time by having it set on client initialization only.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setSelectedTime(new Date());
	}, []);

	useEffect(() => {
		if (stopUpdatingTime) {
			return;
		}

		const intervalId = setInterval(() => {
			setSelectedTime(new Date());
		}, 5000);

		return () => clearInterval(intervalId);
	}, [stopUpdatingTime]);

	return (
		<>
			<label className="block" htmlFor="datetime">{t('label')}</label>
			<div className="input-container">
				<Input
					className="min-w-0 grow w-full"
					id="datetime"
					name="datetime"
					onBlur={() => setStopUpdatingTime(false)}
					onChange={event => setSelectedTime(new Date(event.target.value))}
					onFocus={() => setStopUpdatingTime(true)}
					readOnly={readOnly}
					ref={ref}
					type="datetime-local"
					value={selectedTime ? toLocalInputValue(selectedTime) : ''}
				/>
			</div>
		</>
	)
}
