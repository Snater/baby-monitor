import {Ref, useEffect, useState} from 'react';
import {Input} from '@headlessui/react';
import useStore from '@/store';
import {useTranslations} from 'next-intl';

function getLocalDate(date?: Date) {
	const now = date ?? new Date();
	now.setMinutes(now.getMinutes() - new Date().getTimezoneOffset());
	return now;
}

type Props = {
	readOnly: boolean
	ref: Ref<HTMLInputElement>
}

export default function TimeInput({readOnly, ref}: Props) {
	const t = useTranslations('form.timeInput');
	const [selectedTime, setSelectedTime] = useState<Date>(getLocalDate());
	const stopUpdatingTime = useStore(state => state.stopUpdatingTime);
	const setStopUpdatingTime = useStore(state => state.setStopUpdatingTime);

	useEffect(() => {
		if (stopUpdatingTime) {
			return;
		}

		const intervalId = setInterval(() => {
			setSelectedTime(getLocalDate());
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
					onChange={event => setSelectedTime(getLocalDate(new Date(event.target.value)))}
					onFocus={() => setStopUpdatingTime(true)}
					readOnly={readOnly}
					ref={ref}
					type="datetime-local"
					value={selectedTime.toISOString().slice(0, 16)}
				/>
			</div>
		</>
	)
}
