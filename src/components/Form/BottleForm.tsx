'use client'

import BottleSlider from '@/components/Form/BottleSlider';
import {type FormEventHandler, useCallback, useRef, useState} from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import NextForm from 'next/form';
import TimeInput from '@/components/Form/TimeInput';
import {onlineManager} from '@tanstack/query-core';
import useStore from '@/store';
import {useTranslations} from 'next-intl';

type Props = {
	formAction: (payload: FormData) => void
	isPending: boolean
}

export default function BottleForm({formAction, isPending}: Props) {
	const t = useTranslations('form');
	const timeInputRef = useRef<HTMLInputElement>(null);
	const timeRef = useRef<HTMLInputElement>(null);
	const addPendingEvent = useStore(s => s.addPendingEvent);
	const [amount, setAmount] = useState(0);

	const handleSubmit: FormEventHandler = useCallback((event) => {
		if (!timeInputRef.current || !timeRef.current) {
			return;
		}

		const time = new Date(timeInputRef.current.value).toISOString();

		if (!onlineManager.isOnline()) {
			addPendingEvent({id: -1 * Date.now(), amount, time});
			setAmount(0);
			event.preventDefault();
			return;
		}

		timeRef.current.value = time;
	}, [addPendingEvent, amount]);

	return (
		<NextForm action={formAction} className="flex justify-center" onSubmit={handleSubmit}>
			<input type="hidden" name="time" ref={timeRef}/>
			<input type="hidden" name="amount" value={amount} readOnly/>
			<div className="relative">
				<BottleSlider amount={amount} disabled={isPending} onChange={setAmount}/>
				<div className="absolute left-1/2 top-0 h-50 w-[calc(100%+3rem)] -translate-x-1/2 bg-background/50 backdrop-blur-sm [mask-image:linear-gradient(to_bottom,transparent_0%,black_40%,black_65%,transparent_100%)] transition-all">
				</div>
				<div className="absolute left-1/2 top-0 flex w-[calc(100%+3rem)] -translate-x-1/2 flex-col gap-3 p-4 pt-10">
					<TimeInput readOnly={isPending} ref={timeInputRef}/>
					<button disabled={isPending || amount === 0} type="submit">
						{isPending ? <LoadingSpinner/> : t('submit')}
					</button>
				</div>
			</div>
		</NextForm>
	);
}
