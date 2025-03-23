'use client'

import {AnimatePresence, motion} from 'motion/react';
import {useActionState, useEffect, useRef, useState} from 'react';
import {BottleButtons} from '@/components/Form/BottleButtons';
import CustomInput from '@/components/Form/CustomInput';
import type {FormState} from '@/types';
import {default as NextForm} from 'next/form';
import SecondaryHeader from '@/components/SecondaryHeader';
import TimeInput from '@/components/Form/TimeInput';
import add from '@/app/actions/add';
import useIdContext from '@/components/IdContext';
import {useQueryClient} from '@tanstack/react-query';
import {useTranslations} from 'next-intl';

const timezoneOffset = new Date().getTimezoneOffset();

export default function Form() {
	const t = useTranslations('form');
	const [state, formAction, isPending] = useActionState<FormState, FormData>(add, {});
	const formRef = useRef<HTMLFormElement>(null);
	const amountRef = useRef<HTMLInputElement>(null);
	const {id} = useIdContext();
	const queryClient = useQueryClient();
	const [loading, setLoading] = useState<number | 'custom' | undefined>();

	const handleClick = (amount: number | 'custom') => {
		if (amountRef.current) {
			amountRef.current.value = amount.toString();
		}
	};

	const handleSubmit = () => {
		const amount = amountRef.current?.value;

		if (amount) {
			// Setting state in the click handler will prevent form submission, therefore setting it here.
			setLoading(amount === 'custom' ? 'custom' : parseInt(amount, 10));
		}
	};

	useEffect(() => {
		if (!isPending) {
			setLoading(undefined);
		}
	}, [isPending]);

	useEffect(() => {
		if (!state) {
			return;
		}

		if (state.error === false) {
			queryClient.refetchQueries({queryKey: ['data']});
		}
	}, [queryClient, state]);

	return (
		<>
			<SecondaryHeader>{t('title')}</SecondaryHeader>

			<div className="layout-container">
				<NextForm ref={formRef} action={formAction} className="w-full" onSubmit={handleSubmit}>
					<input type="hidden" name="id" value={id}/>
					<input ref={amountRef} type="hidden" name="amount"/>
					<input type="hidden" name="timezoneOffset" value={timezoneOffset}/>

					<AnimatePresence>
						{
							state.error && (
								<motion.div
									animate={{height: 'auto', opacity: 1}}
									className="overflow-hidden"
									exit={{height: 0, opacity: 0}}
									initial={{height: 0, opacity: 0}}
								>
									<div className="alert error mb-3">
										{state.error.message}
									</div>
								</motion.div>
							)
						}
					</AnimatePresence>

					<div className="grid gap-3">
						<div>
							<TimeInput readOnly={isPending}/>
						</div>
						<div>
							<BottleButtons
								loading={typeof loading === 'number' ? loading : isPending}
								onClick={handleClick}
							/>
						</div>
						<div>
							<CustomInput
								loading={loading === 'custom' ? 'custom' : isPending}
								onClick={handleClick}
							/>
						</div>
					</div>
				</NextForm>
			</div>
		</>
	);
}
