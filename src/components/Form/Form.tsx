'use client'

import {useActionState, useEffect, useState} from 'react';
import Form from 'next/form';
import type {FormState} from '@/types';
import addAmount from '@/app/actions/addAmount';
import useChartDataContext from '@/components/ChartDataContext';

function getLocalDate(date?: Date) {
	const now = date ?? new Date();
	now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
	return now;
}

const initialState = {
	message: '',
};

export default function AmountForm() {
	const [selectedTime, setSelectedTime] = useState<Date>(getLocalDate());
	const [stopUpdatingTime, setStopUpdatingTime] = useState<boolean>(false);
	const {setChartData} = useChartDataContext();
	const [state, formAction] = useActionState<FormState>(addAmount, initialState);

	useEffect(() => {
		if (!state) {
			return;
		}

		if (state.message === 'ok' && state.events && state.events.length > 0) {
			const events = state.events;
			setChartData(data => ([...data ?? [], ...events]));
		}
	}, [setChartData, state]);

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
		<Form action={formAction} className="w-full">
			<div>
				<div className="pb-4">
					<h2>🍼 Let&#39;s get some milk!</h2>

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

						<div>
							<label htmlFor="amount">
								Custom Amount
							</label>
							<div className="grid grid-cols-6 gap-x-3">
								<div className="col-span-4">
									<div className="input-container">
										<input
											id="amount"
											min={0}
											name="amount"
											type="number"
										/>
									</div>
								</div>
								<div className="col-span-2">
									<button
										type="submit"
										className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-full"
									>
										Submit
									</button>
								</div>
							</div>
						</div>

					</div>

				</div>
			</div>
		</Form>
	);
}
