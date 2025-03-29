'use server'

import type {FormState} from '@/types';
import type {ResultSetHeader} from 'mysql2';
import {addSchema} from '@/schemas';
import {errorResponse} from '@/lib/util';
import {getIdByReadableId} from '@/app/api/getIdByReadableId';
import {getTranslations} from 'next-intl/server';
import promisePool from '@/lib/mysql';

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
			db.release();
			return errorResponse(t('database.error'), error);
		}

		id = await getIdByReadableId(db, readableId);
	}

	const localTime = new Date(data.datetime).getTime();
	const gmtTime = new Date(localTime + data.timezoneOffset * 60 * 1000);

	let result: ResultSetHeader;

	try {
		[result] = await db.query<ResultSetHeader>(
			'INSERT INTO `events` (`session_id`, `time`, `amount`) VALUES (?, ?, ?)',
			[id, gmtTime, data.amount]
		);
	} catch (error) {
		return errorResponse(t('database.error'), error);
	} finally {
		db.release();
	}

	return {event: {id: result.insertId, time: localTime, amount: data.amount}, error: false};
}
