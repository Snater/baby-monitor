'use client'

import {useRef, useState} from 'react';
import BottleButtonsForm from '@/components/Form/BottleButtonsForm';
import CustomInputForm from '@/components/Form/CustomInputForm';
import TimeInput from '@/components/Form/TimeInput';

type Props = {
	formAction: (payload: FormData) => void
	isPending: boolean
}

export default function ButtonsForm({formAction, isPending}: Props) {
	const timeInputRef = useRef<HTMLInputElement>(null);
	const [loading, setLoading] = useState<number | 'custom' | undefined>();

	return (
		<div className="grid gap-3">
			<div>
				<TimeInput readOnly={isPending} ref={timeInputRef}/>
			</div>
			<div>
				<BottleButtonsForm
					formAction={formAction}
					isPending={isPending}
					loading={isPending ? loading : undefined}
					setLoading={setLoading}
					timeInputRef={timeInputRef}
				/>
			</div>
			<div>
				<CustomInputForm
					formAction={formAction}
					isPending={isPending}
					loading={isPending ? loading : undefined}
					setLoading={setLoading}
					timeInputRef={timeInputRef}
				/>
			</div>
		</div>
	);
}
