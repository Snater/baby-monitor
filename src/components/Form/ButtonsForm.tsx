'use client';

import BottleButtonsForm from '@/components/Form/BottleButtonsForm';
import CustomInputForm from '@/components/Form/CustomInputForm';
import TimeInput from '@/components/Form/TimeInput';
import {useState} from 'react';

type Props = {
	formAction: (payload: FormData) => void
	isPending: boolean
};

export default function ButtonsForm({formAction, isPending}: Props) {
	const [loading, setLoading] = useState<number | 'custom' | undefined>();
	const [time, setTime] = useState<Date>();

	return (
		<div className="grid gap-3">
			<div>
				<TimeInput readOnly={isPending} setTime={setTime} time={time}/>
			</div>
			<div>
				<BottleButtonsForm
					formAction={formAction}
					isPending={isPending}
					loading={isPending ? loading : undefined}
					setLoading={setLoading}
					time={time}
				/>
			</div>
			<div>
				<CustomInputForm
					formAction={formAction}
					isPending={isPending}
					loading={isPending ? loading : undefined}
					setLoading={setLoading}
					time={time}
				/>
			</div>
		</div>
	);
}
