'use server'

import type {FormState} from '@/types';
import {getIdByReadableId} from '@/app/api/getIdByReadableId';
import {getTranslations} from 'next-intl/server';
import promisePool from '@/lib/mysql';
import {z} from 'zod';

const addSchema = z.object({
	amount: z.union([z.coerce.number(), z.literal('custom')]),
	customAmount: z.coerce.number(),
	// zod is not yet able to handle datetime without seconds,
	// see https://github.com/colinhacks/zod/issues/3636
	datetime: z.preprocess(input => `${input}:00`, z.string().datetime({local: true})),
	id: z.string(),
	timezoneOffset: z.coerce.number(),
});

export default async function add(_prevState: FormState, formData: FormData): Promise<FormState> {
	const t = await getTranslations('errors');

	const {data, error} = addSchema.safeParse(Object.fromEntries(formData));

	if (error || !data) {
		return {error: {message: t('parseForm'), error}};
	}

	const db = await promisePool.getConnection();

	let id = await getIdByReadableId(db, data.id);

	// Initiate session when adding the first value
	if (!id) {
		await db.query(
			'INSERT INTO `sessions` (`readable_id`) VALUES (?)',
			[data.id]
		);

		id = await getIdByReadableId(db, data.id);
	}

	const localTime = new Date(data.datetime).getTime();
	const gmtTime = new Date(localTime + data.timezoneOffset * 60 * 1000);

	await db.query(
		'INSERT INTO `events` (`session_id`, `time`, `amount`) VALUES (?, ?, ?)',
		[
			id,
			gmtTime,
			data.amount === 'custom' ? data.customAmount : data.amount
		]
	);

	db.release();

	return {error: false};
}
