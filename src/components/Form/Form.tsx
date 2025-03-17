'use client'

import {MouseEvent, useActionState, useCallback, useEffect, useRef, useState} from 'react';
import type {FormState} from '@/types';
import {default as NextForm} from 'next/form';
import SecondaryHeader from '@/components/SecondaryHeader';
import add from '@/app/actions/add';
import useIdContext from '@/components/IdContext';
import {useQueryClient} from '@tanstack/react-query';

const timezoneOffset = new Date().getTimezoneOffset();

function getLocalDate(date?: Date) {
	const now = date ?? new Date();
	now.setMinutes(now.getMinutes() - timezoneOffset);
	return now;
}

const initialState = {
	message: '',
};

const DEFAULT_BOTTLE_SIZES = process.env.NEXT_PUBLIC_BOTTLE_SIZES
	? process.env.NEXT_PUBLIC_BOTTLE_SIZES
		.split(',')
		.map(bottleSize => parseInt(bottleSize, 10))
	: null;

export default function Form() {
	const [selectedTime, setSelectedTime] = useState<Date>(getLocalDate());
	const [stopUpdatingTime, setStopUpdatingTime] = useState<boolean>(false);
	const [state, formAction] = useActionState<FormState>(add, initialState);
	const formRef = useRef<HTMLFormElement>(null);
	const amountRef = useRef<HTMLInputElement>(null);
	const {id} = useIdContext();
	const queryClient = useQueryClient();

	const handleClick = useCallback((event: MouseEvent, amount: number | 'custom') => {
		if (!formRef.current || !amountRef.current) {
			return;
		}

		amountRef.current.value = amount.toString();
	}, []);

	useEffect(() => {
		if (!state) {
			return;
		}

		if (state.message === 'ok') {
			queryClient.refetchQueries({queryKey: ['data']});
		}
	}, [queryClient, state]);

	useEffect(() => {
		if (stopUpdatingTime) {
			return;
		}

		const intervalId = setInterval(() => {
			setSelectedTime(getLocalDate());
		}, 5000);

		return () => clearInterval(intervalId);
	}, [stopUpdatingTime]);

	return (
		<>
			<SecondaryHeader icon="🍼">
				Let&#39;s have some milk
			</SecondaryHeader>

			<div className="layout-container">
				<NextForm ref={formRef} action={formAction} className="w-full">
					<input type="hidden" name="id" value={id}/>
					<input ref={amountRef} type="hidden" name="amount"/>
					<input type="hidden" name="timezoneOffset" value={timezoneOffset}/>

					<div className="grid gap-3">

						<div>
							<label className="block" htmlFor="datetime">Time</label>
							<div className="input-container">
								<input
									className="min-w-0 grow w-full"
									id="datetime"
									name="datetime"
									onChange={event => setSelectedTime(getLocalDate(new Date(event.target.value)))}
									onFocus={() => setStopUpdatingTime(true)}
									type="datetime-local"
									value={selectedTime.toISOString().slice(0, 16)}
								/>
							</div>
						</div>

						{
							DEFAULT_BOTTLE_SIZES && (
								<div className="grid grid-cols-3 gap-3">
									{
										DEFAULT_BOTTLE_SIZES.map(bottleSize => (
											<button onClick={event => handleClick(event, bottleSize)} key={bottleSize}>
												{bottleSize}&thinsp;ml
											</button>
										))
									}
								</div>
							)
						}

						<div>
							<label htmlFor="customAmount">
								Custom Amount
							</label>
							<div className="grid grid-cols-6 gap-x-3">
								<div className="col-span-4">
									<div className="input-container">
										<input
											id="customAmount"
											min={0}
											name="customAmount"
											type="number"
										/>
									</div>
								</div>
								<div className="col-span-2">
									<button onClick={event => handleClick(event, 'custom')}>
										Submit
									</button>
								</div>
							</div>
						</div>

					</div>
				</NextForm>
			</div>
		</>
	);
}
