import {type Dispatch, type SetStateAction, useCallback, useRef} from 'react';
import {BottleButtons} from '@/components/Form/BottleButtons';
import {default as NextForm} from 'next/form';
import {onlineManager} from '@tanstack/query-core';
import useStore from '@/store';

type Props = {
	formAction: (payload: FormData) => void
	isPending: boolean
	loading?: number | 'custom'
	setLoading: Dispatch<SetStateAction<number | 'custom' | undefined>>
	time?: Date;
}

export default function BottleButtonsForm({
	formAction,
	isPending,
	loading,
	setLoading,
	time,
}: Props) {
	const formRef = useRef<HTMLFormElement>(null);
	const amountRef = useRef<HTMLInputElement>(null);
	const addPendingEvent = useStore(state => state.addPendingEvent);

	const handleClick = useCallback((amount: number) => {
		if (!amountRef.current || !time) {
			return;
		}

		const isoTime = time.toISOString();

		if (!onlineManager.isOnline()) {
			addPendingEvent({
				id: -1 * Date.now(),
				amount,
				time: isoTime,
			});
			return;
		}

		setLoading(amount);

		amountRef.current.value = amount.toString();

		formRef.current?.requestSubmit();
	}, [addPendingEvent, setLoading, time]);

	return (
		<NextForm action={formAction} className="w-full" ref={formRef}>
			<input type="hidden" name="time" value={time?.toISOString() ?? ""}/>
			<input type="hidden" name="amount" ref={amountRef}/>
			<BottleButtons
				loading={typeof loading === 'number' ? loading : isPending}
				onClick={handleClick}
			/>
		</NextForm>
	);
}
