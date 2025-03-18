'use client'

import {useActionState, useEffect, useRef} from 'react';
import {BottleButtons} from '@/components/Form/BottleButtons';
import type {FormState} from '@/types';
import {default as NextForm} from 'next/form';
import SecondaryHeader from '@/components/SecondaryHeader';
import TimeInput from '@/components/Form/TimeInput';
import add from '@/app/actions/add';
import useIdContext from '@/components/IdContext';
import {useQueryClient} from '@tanstack/react-query';

const timezoneOffset = new Date().getTimezoneOffset();

const initialState = {
	message: '',
};

export default function Form() {
	const [state, formAction] = useActionState<FormState>(add, initialState);
	const formRef = useRef<HTMLFormElement>(null);
	const amountRef = useRef<HTMLInputElement>(null);
	const {id} = useIdContext();
	const queryClient = useQueryClient();

	const handleClick = (amount: number | 'custom') => {
		if (amountRef.current) {
			amountRef.current.value = amount.toString();
		}
	};

	useEffect(() => {
		if (!state) {
			return;
		}

		if (state.message === 'ok') {
			queryClient.refetchQueries({queryKey: ['data']});
		}
	}, [queryClient, state]);

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
							<TimeInput>Time</TimeInput>
						</div>

						<BottleButtons onClick={handleClick}/>

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
									<button onClick={() => handleClick('custom')}>
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
