import {useEffect, useState} from 'react';
import {Input} from '@headlessui/react';
import {useTranslations} from 'next-intl';

function getLocalDate(date?: Date) {
	const now = date ?? new Date();
	now.setMinutes(now.getMinutes() - new Date().getTimezoneOffset());
	return now;
}

type Props = {
	readOnly: boolean
}

export default function TimeInput({readOnly}: Props) {
	const t = useTranslations('form.timeInput');
	const [selectedTime, setSelectedTime] = useState<Date>(getLocalDate());
	const [stopUpdatingTime, setStopUpdatingTime] = useState<boolean>(false);

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
					onChange={event => setSelectedTime(getLocalDate(new Date(event.target.value)))}
					onFocus={() => setStopUpdatingTime(true)}
					readOnly={readOnly}
					type="datetime-local"
					value={selectedTime.toISOString().slice(0, 16)}
				/>
			</div>
		</>
	)
}
