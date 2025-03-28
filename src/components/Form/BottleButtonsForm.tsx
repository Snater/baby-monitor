import {Dispatch, RefObject, SetStateAction, useRef} from 'react';
import {BottleButtons} from '@/components/Form/BottleButtons';
import {default as NextForm} from 'next/form';

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
	const datetimeRef = useRef<HTMLInputElement>(null);
	const timezoneOffsetRef = useRef<HTMLInputElement>(null);

	const handleClick = (amount: number) => {
		if (
			!amountRef.current
			|| !datetimeRef.current
			|| !timezoneOffsetRef.current
			|| !timeInputRef.current
		) {
			return;
		}

		setLoading(amount);

		amountRef.current.value = amount.toString();
		datetimeRef.current.value = timeInputRef.current.value;
		timezoneOffsetRef.current.value = new Date().getTimezoneOffset().toString();

		formRef.current?.requestSubmit();
	};

	return (
		<NextForm action={formAction} className="w-full" ref={formRef}>
			<input type="hidden" name="datetime" ref={datetimeRef}/>
			<input type="hidden" name="amount" ref={amountRef}/>
			<input type="hidden" name="timezoneOffset" ref={timezoneOffsetRef}/>
			<BottleButtons
				loading={typeof loading === 'number' ? loading : isPending}
				onClick={handleClick}
			/>
		</NextForm>
	);
}
