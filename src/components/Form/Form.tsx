'use client'

import Form from 'next/form';
import addAmount from '@/app/actions/addAmount';
import {useEffect, useState} from 'react';

function getLocalDate(date?: Date) {
	const now = date ?? new Date();
	now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
	return now;
}

export default function AmountForm() {
	const [selectedTime, setSelectedTime] = useState<Date>(getLocalDate());
	const [stopUpdatingTime, setStopUpdatingTime] = useState<boolean>(false);

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
		<Form action={addAmount}>
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
							<div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
								<div className="sm:col-span-1">
									<div className="input-container">
										<input
											id="amount"
											min={0}
											name="amount"
											type="number"
										/>
									</div>
								</div>
								<div className="sm:col-span-1">
									<button
										type="submit"
										className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
