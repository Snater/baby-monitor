'use server'

import type {FormState} from '@/types';
import {errorResponse} from '@/lib/util';
import {getIdByReadableId} from '@/app/api/getIdByReadableId';
import {getTranslations} from 'next-intl/server';
import promisePool from '@/lib/mysql';
import {z} from 'zod';

const addSchema = z.object({
	amount: z.coerce.number(),
	// zod is not yet able to handle datetime without seconds,
	// see https://github.com/colinhacks/zod/issues/3636
	datetime: z.preprocess(input => `${input}:00`, z.string().datetime({local: true})),
	timezoneOffset: z.coerce.number(),
});

export default async function addEvent(
	readableId: string,
	_prevState: FormState,
	formData: FormData
): Promise<FormState> {
	const t = await getTranslations('api');

	const {data, error} = addSchema.safeParse(Object.fromEntries(formData));

	if (error || !data) {
		return errorResponse(t('addEvent.errors.parse'), error);
	}

	const db = await promisePool.getConnection();

	let id = await getIdByReadableId(db, readableId);

	// Initiate session when adding the first value
	if (!id) {
		try {
			await db.query(
				'INSERT INTO `sessions` (`readable_id`) VALUES (?)',
				[readableId]
			);
		} catch (error) {
			return errorResponse(t('database.error'), error);
		}

		id = await getIdByReadableId(db, readableId);
	}

	const localTime = new Date(data.datetime).getTime();
	const gmtTime = new Date(localTime + data.timezoneOffset * 60 * 1000);

	try {
		await db.query(
			'INSERT INTO `events` (`session_id`, `time`, `amount`) VALUES (?, ?, ?)',
			[id, gmtTime, data.amount]
		);
	} catch (error) {
		return errorResponse(t('database.error'), error);
	}

	db.release();

	return {error: false};
}
