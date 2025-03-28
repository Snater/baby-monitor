import {Dispatch, RefObject, SetStateAction, useRef} from 'react';
import CustomInput from '@/components/Form/CustomInput';
import {default as NextForm} from 'next/form';

type Props = {
	formAction: (payload: FormData) => void
	isPending: boolean
	loading?: number | 'custom'
	setLoading: Dispatch<SetStateAction<number | 'custom' | undefined>>
	timeInputRef: RefObject<HTMLInputElement | null>
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
	timeInputRef,
}: Props) {
	const datetimeRef = useRef<HTMLInputElement>(null);
	const timezoneOffsetRef = useRef<HTMLInputElement>(null);

	const handleSubmit = () => {
		if (!datetimeRef.current || !timezoneOffsetRef.current || !timeInputRef.current) {
			return;
		}

		setLoading('custom');

		datetimeRef.current.value = timeInputRef.current.value;
		timezoneOffsetRef.current.value = new Date().getTimezoneOffset().toString();
	}

	return (
		<NextForm action={formAction} className="w-full" onSubmit={handleSubmit}>
			<input type="hidden" name="datetime" ref={datetimeRef}/>
			<input type="hidden" name="timezoneOffset" ref={timezoneOffsetRef}/>
			<CustomInput
				loading={loading === 'custom' ? 'custom' : isPending}
			/>
		</NextForm>
	);
}
