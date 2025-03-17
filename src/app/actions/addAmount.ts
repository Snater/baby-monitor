'use server'

import type {FormState} from '@/types';
import {getIdByReadableId} from '@/app/api/getIdByReadableId';
import promisePool from '@/lib/mysql';
import {z} from 'zod';

const addAmountSchema = z.object({
	amount: z.union([z.coerce.number(), z.literal('custom')]),
	customAmount: z.coerce.number(),
	// zod is not yet able to handle datetime without seconds,
	// see https://github.com/colinhacks/zod/issues/3636
	datetime: z.preprocess(input => `${input}:00`, z.string().datetime({local: true})),
	id: z.string(),
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

	// Initiate session when adding the first value
	let id = await getIdByReadableId(data.id);

	if (!id) {
		await promisePool.query(
			'INSERT INTO `sessions` (`readable_id`) VALUES (?)',
			[data.id]
		);

		id = await getIdByReadableId(data.id);
	}

	await promisePool.query(
		'INSERT INTO `events` (`session_id`, `time`, `amount`) VALUES (?, ?, ?)',
		[
			id,
			data.datetime,
			data.amount === 'custom' ? data.customAmount : data.amount
		]
	);

	return {message: 'ok'};
}
