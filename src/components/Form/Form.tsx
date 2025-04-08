'use client'

import {AnimatePresence, motion} from 'motion/react';
import {useActionState, useEffect, useRef, useState} from 'react';
import BottleButtonsForm from '@/components/Form/BottleButtonsForm';
import CustomInputForm from '@/components/Form/CustomInputForm';
import type {FormState} from '@/types';
import SecondaryHeader from '@/components/SecondaryHeader';
import TimeInput from '@/components/Form/TimeInput';
import addEvent from '@/app/actions/addEvent';
import {formatDate} from '@/lib/util';
import {redirect} from 'next/navigation';
import useChartDataContext from '@/components/ChartDataContext';
import useIdContext from '@/components/IdContext';
import {useQueryClient} from '@tanstack/react-query';
import useStore from '@/store';
import {useTranslations} from 'next-intl';

export default function Form() {
	const t = useTranslations('form');
	const {id, isTemporary} = useIdContext();
	const queryClient = useQueryClient();
	const [loading, setLoading] = useState<number | 'custom' | undefined>();
	const timeInputRef = useRef<HTMLInputElement>(null);
	const {setTargetDate} = useChartDataContext();
	const setCurrentDate = useStore(state => state.setCurrentDate);

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
		const newEvent = state.event;

		if (state.error || !newEvent) {
			return;
		}

		if (isTemporary) {
			redirect(`/${id}`);
		}

		queryClient.refetchQueries({queryKey: ['data', id, formatDate(new Date(newEvent.time))]})
			.then(() => {
				// The promise returned by `refetchQueries` is resolved when the queries are triggered to be
				// refetched, not when they have finished refetching. Therefore, setting a target date which
				// is to be programmatically navigated to when refetching has actually finished.
				setTargetDate(new Date(newEvent.time));
			});
	}, [id, isTemporary, queryClient, setCurrentDate, setTargetDate, state]);

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
