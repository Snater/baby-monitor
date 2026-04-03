'use server'

import {DAILY_SUMMARY_TAG} from '@/data/getDailySummary';
import {NEXT_FEEDING_PREDICTION_TAG} from '@/data/getNextFeedingPrediction';
import type {FormState} from '@/types';
import type {ResultSetHeader} from 'mysql2';
import {addSchema} from '@/schemas';
import {errorResponse} from '@/lib/util';
import {getSessionId} from '@/app/api/getSessionId';
import {getTranslations} from 'next-intl/server';
import promisePool from '@/lib/mysql';
import {updateTag} from 'next/cache';

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

	let id = await getSessionId(readableId, db);

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

		id = await getSessionId(readableId, db);
	}

	let result: ResultSetHeader;

	try {
		[result] = await db.query<ResultSetHeader>(
			'INSERT INTO `events` (`session_id`, `time`, `amount`) VALUES (?, ?, ?)',
			[id, data.time, data.amount]
		);
	} catch (error) {
		db.release();
		return errorResponse(t('database.error'), error);
	}

	db.release();

	updateTag(DAILY_SUMMARY_TAG(id!));
	updateTag(NEXT_FEEDING_PREDICTION_TAG(id!));

	return {event: {id: result.insertId, time: data.time, amount: data.amount}, error: false};
}
