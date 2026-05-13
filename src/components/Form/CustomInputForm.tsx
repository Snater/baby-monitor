import {Dispatch, FormEventHandler, RefObject, SetStateAction, useRef} from 'react';
import CustomInput from '@/components/Form/CustomInput';
import {default as NextForm} from 'next/form';
import {onlineManager} from '@tanstack/query-core';
import useStore from '@/store';

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
	const amountInputRef = useRef<HTMLInputElement>(null);
	const addPendingEvent = useStore(state => state.addPendingEvent);

	const handleSubmit: FormEventHandler = event => {
		if (!amountInputRef.current || !time) {
			return;
		}

		const isoTime = time.toISOString();

		if (!onlineManager.isOnline()) {
			addPendingEvent({
				id: -1 * Date.now(),
				amount: parseInt(amountInputRef.current.value, 10),
				time: isoTime,
			});
			amountInputRef.current.value = '';
			event.preventDefault();
			return;
		}

		setLoading('custom');
	}

	return (
		<NextForm action={formAction} className="w-full" onSubmit={handleSubmit}>
			<input type="hidden" name="time" value={time?.toISOString() ?? ""}/>
			<CustomInput
				loading={loading === 'custom' ? 'custom' : isPending}
				ref={amountInputRef}
			/>
		</NextForm>
	);
}
