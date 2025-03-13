'use server'

import type {Event, FormState} from '@/types';
import promisePool from '@/lib/mysql';
import {z} from 'zod';

const addAmountSchema = z.object({
	amount: z.union([z.coerce.number(), z.literal('custom')]),
	customAmount: z.coerce.number(),
	// zod is not yet able to handle datetime without seconds,
	// see https://github.com/colinhacks/zod/issues/3636
	datetime: z.preprocess(input => `${input}:00`, z.string().datetime({local: true})),
});

export default async function addAmount(
	_prevState?: FormState,
	formData?: FormData
): Promise<FormState> {
	if (!formData) {
		return {message: 'no form submitted'};
	}

	const {data, error} = addAmountSchema.safeParse(Object.fromEntries(formData));

	if (error) {
		return {message: error.message};
	}

	if (!data) {
		return {message: 'invalid'};
	}

	const event: Event = {
		amount: data.amount === 'custom' ? data.customAmount : data.amount,
		time: new Date(data.datetime).getTime(),
	}

	await promisePool.query(
		'INSERT INTO events (amount, time) VALUES (?, ?)',
		[event.amount, new Date(event.time)]
	);

	return {message: 'ok', events: [event]};
}
