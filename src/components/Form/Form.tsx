'use client'

import {AnimatePresence, motion} from 'motion/react';
import {useActionState, useEffect} from 'react';
import BottleForm from '@/components/Form/BottleForm';
import ButtonsForm from '@/components/Form/ButtonsForm';
import type {FormState} from '@/types';
import SecondaryHeader from '@/components/SecondaryHeader';
import addEvent from '@/app/actions/addEvent';
import {DATA_LOOKBACK_DAYS, formatDate} from '@/lib/util';
import {redirect} from 'next/navigation';
import useIdContext from '@/components/IdContext';
import {useFormLayout} from '@/hooks/useFormLayout';
import {useQueryClient} from '@tanstack/react-query';
import useStore from '@/store';
import {useTranslations} from 'next-intl';

export default function Form() {
	const t = useTranslations('form');
	const {id, isTemporary} = useIdContext();
	const queryClient = useQueryClient();
	const setCurrentDate = useStore(state => state.setCurrentDate);
	const {layout} = useFormLayout();

	const [state, formAction, isPending] = useActionState<FormState, FormData>(
		addEvent.bind(null, id),
		{}
	);

	useEffect(() => {
		const newEvent = state.event;

		if (state.error || !newEvent) {
			return;
		}

		if (isTemporary) {
			redirect(`/${id}`);
		}

		const eventDate = new Date(newEvent.time);
		const followingDays = Array.from({length: DATA_LOOKBACK_DAYS}, (_, i) => {
			const d = new Date(eventDate);
			d.setDate(d.getDate() + i + 1);
			return d;
		});

		Promise.all([
			...[eventDate, ...followingDays].map(date => (
				queryClient.invalidateQueries({queryKey: ['data', id, formatDate(date)]})
			)),
			queryClient.invalidateQueries({queryKey: ['prediction', id]}),
		]).finally(() => {
			setCurrentDate(formatDate(eventDate));
		});
	}, [id, isTemporary, queryClient, setCurrentDate, state]);

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

				{layout === 'bottle'
					? <BottleForm key={state.event?.id ?? 0} formAction={formAction} isPending={isPending}/>
					: <ButtonsForm formAction={formAction} isPending={isPending}/>
				}
			</div>
		</>
	);
}