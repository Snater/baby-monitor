'use client'

import {AnimatePresence, motion} from 'motion/react';
import {useActionState, useEffect, useRef, useState} from 'react';
import BottleButtonsForm from '@/components/Form/BottleButtonsForm';
import CustomInputForm from '@/components/Form/CustomInputForm';
import type {FormState} from '@/types';
import SecondaryHeader from '@/components/SecondaryHeader';
import TimeInput from '@/components/Form/TimeInput';
import addEvent from '@/app/actions/addEvent';
import useIdContext from '@/components/IdContext';
import {useQueryClient} from '@tanstack/react-query';
import {useTranslations} from 'next-intl';

export default function Form() {
	const t = useTranslations('form');
	const {id} = useIdContext();
	const queryClient = useQueryClient();
	const [loading, setLoading] = useState<number | 'custom' | undefined>();
	const timeInputRef = useRef<HTMLInputElement>(null);
	const [state, formAction, isPending] = useActionState<FormState, FormData>(
		addEvent.bind(null, id),
		{}
	);

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
							<TimeInput readOnly={isPending} ref={timeInputRef}/>
						</div>
						<div>
							<BottleButtonsForm
								formAction={formAction}
								isPending={isPending}
								loading={loading}
								setLoading={setLoading}
								timeInputRef={timeInputRef}
							/>
						</div>
						<div>
							<CustomInputForm
								formAction={formAction}
								isPending={isPending}
								loading={loading}
								setLoading={setLoading}
								timeInputRef={timeInputRef}
							/>
						</div>
					</div>
			</div>
		</>
	);
}
