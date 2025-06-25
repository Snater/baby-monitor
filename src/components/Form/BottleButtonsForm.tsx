import {Dispatch, RefObject, SetStateAction, useCallback, useRef} from 'react';
import {BottleButtons} from '@/components/Form/BottleButtons';
import {default as NextForm} from 'next/form';
import {onlineManager} from '@tanstack/query-core';
import useStore from '@/store';

type Props = {
	formAction: (payload: FormData) => void
	isPending: boolean
	loading?: number | 'custom'
	setLoading: Dispatch<SetStateAction<number | 'custom' | undefined>>
	timeInputRef: RefObject<HTMLInputElement | null>
}

export default function BottleButtonsForm({
	formAction,
	isPending,
	loading,
	setLoading,
	timeInputRef,
}: Props) {
	const formRef = useRef<HTMLFormElement>(null);
	const amountRef = useRef<HTMLInputElement>(null);
	const timeRef = useRef<HTMLInputElement>(null);
	const addPendingEvent = useStore(state => state.addPendingEvent);

	const handleClick = useCallback((amount: number) => {
		if (!amountRef.current || !timeRef.current || !timeInputRef.current) {
			return;
		}

		const time = new Date(timeInputRef.current.value).toISOString();

		if (!onlineManager.isOnline()) {
			addPendingEvent({
				id: -1 * Date.now(),
				amount,
				time,
			});
			return;
		}

		setLoading(amount);

		amountRef.current.value = amount.toString();
		timeRef.current.value = time;

		formRef.current?.requestSubmit();
	}, [addPendingEvent, setLoading, timeInputRef]);

	return (
		<NextForm action={formAction} className="w-full" ref={formRef}>
			<input type="hidden" name="time" ref={timeRef}/>
			<input type="hidden" name="amount" ref={amountRef}/>
			<BottleButtons
				loading={typeof loading === 'number' ? loading : isPending}
				onClick={handleClick}
			/>
		</NextForm>
	);
}
