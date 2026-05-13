'use client'

import {type FormEventHandler, useCallback, useState} from 'react';
import BottleSlider from '@/components/Form/BottleSlider';
import LoadingSpinner from '@/components/LoadingSpinner';
import NextForm from 'next/form';
import TimeInput from '@/components/Form/TimeInput';
import {displayAmount} from '@/lib/conversion';
import {onlineManager} from '@tanstack/query-core';
import useStore from '@/store';
import {useBottleAmount} from '@/hooks/useBottleAmount';
import {useTranslations} from 'next-intl';
import {useUnit} from '@/hooks/useUnit';

type Props = {
	formAction: (payload: FormData) => void
	isPending: boolean
}

export default function BottleForm({formAction, isPending}: Props) {
	const t = useTranslations('form.bottle');
	const [time, setTime] = useState<Date>();
	const addPendingEvent = useStore(s => s.addPendingEvent);
	const {amount, setBottleAmount} = useBottleAmount();
	const {unit} = useUnit();

	const handleSubmit: FormEventHandler = useCallback((event) => {
		if (!time) {
			return;
		}

		const isoTime = time.toISOString();

		if (!onlineManager.isOnline()) {
			addPendingEvent({id: -1 * Date.now(), amount, time: isoTime});
			event.preventDefault();
			return;
		}
	}, [addPendingEvent, amount, time]);

	return (
		<NextForm action={formAction} className="flex justify-center" onSubmit={handleSubmit}>
			<input type="hidden" name="time" value={time?.toISOString() ?? ""}/>
			<input type="hidden" name="amount" value={amount} readOnly/>
			<div className="relative">
				<BottleSlider amount={amount} disabled={isPending} onChange={setBottleAmount} unit={unit}/>
				<div className="absolute left-1/2 top-0 h-50 w-[calc(100%+3rem)] -translate-x-1/2 bg-background/50 backdrop-blur-sm pointer-events-none [mask-image:linear-gradient(to_bottom,transparent_0%,black_40%,black_65%,transparent_100%)] transition-all">
				</div>
				<div className="absolute left-1/2 top-0 flex w-[calc(100%+3rem)] -translate-x-1/2 flex-col gap-3 p-4 pt-10">
					<TimeInput readOnly={isPending} setTime={setTime} time={time}/>
					<button disabled={isPending || amount === 0} type="submit">
						{isPending
							? <LoadingSpinner/>
							: t('submit', {
								amount: displayAmount(amount, unit),
								unit: amount > 0 ? unit : "undefined"
							})
						}
					</button>
				</div>
			</div>
		</NextForm>
	);
}
