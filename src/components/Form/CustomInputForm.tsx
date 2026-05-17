import {type Dispatch, type FormEventHandler, type SetStateAction, useRef, useState} from 'react';
import CustomInput from '@/components/Form/CustomInput';
import {default as NextForm} from 'next/form';
import {onlineManager} from '@tanstack/query-core';
import useStore from '@/store';
import {useTranslations} from "next-intl";
import {useUnit} from "@/hooks/useUnit";

type Props = {
	formAction: (payload: FormData) => void
	isPending: boolean
	loading?: number | 'custom'
	setLoading: Dispatch<SetStateAction<number | 'custom' | undefined>>
	time?: Date
}

/**
 * If the forms for the custom input, and the form for the bottle buttons are combined, the submit
 * button in the keyboard on mobile devices would use the first button as submit target.
 */
export default function CustomInputForm({
	formAction,
	isPending,
	loading,
	setLoading,
	time,
}: Props) {
	const t = useTranslations('form.buttons.customAmount');
	const {unit} = useUnit();
	const [error, setError] = useState<string>();
	const addPendingEvent = useStore(state => state.addPendingEvent);

	const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
		const formData = new FormData(event.currentTarget);
		const amount = Number(formData.get('amount'));

		if (!time || Number.isNaN(amount) || amount <= 0) {
			event.preventDefault();
			setError(t('error'));
			return;
		}

		setError(undefined);

		if (!onlineManager.isOnline()) {
			addPendingEvent({
				id: -Date.now(),
				amount,
				time: time.toISOString(),
			});

			event.currentTarget.reset();
			event.preventDefault();
			return;
		}

		setLoading('custom');
	};

	return (
		<NextForm action={formAction} className="w-full" onSubmit={handleSubmit}>
			<input type="hidden" name="time" value={time?.toISOString() ?? ''}/>
			<input type="hidden" name="unit" value={unit}/>
			<CustomInput
				error={error}
				loading={loading === 'custom' ? 'custom' : isPending}
				onChange={() => setError(undefined)}
				unit={unit}
			/>
		</NextForm>
	);
}
