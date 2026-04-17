'use server'

import {DAILY_SUMMARY_TAG} from '@/data/getDailySummary';
import {NEXT_FEEDING_PREDICTION_TAG} from '@/data/getNextFeedingPrediction';
import type {FormState} from '@/types';
import type {ResultSetHeader, RowDataPacket} from 'mysql2';
import {addSchema} from '@/schemas';
import {errorResponse} from '@/lib/util';
import {getTranslations} from 'next-intl/server';
import promisePool from '@/lib/mysql';
import {updateTag} from 'next/cache';

interface SessionRow extends RowDataPacket {
	id: number
}

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
	await db.beginTransaction();

	try {
		const [sessionRows] = await db.query<SessionRow[]>(
			'SELECT `id` FROM `sessions` WHERE `readable_id` = ? FOR UPDATE',
			[readableId]
		);

		let sessionId: number;

		if (sessionRows[0]) {
			sessionId = sessionRows[0].id;
		} else {
			const [inserted] = await db.query<ResultSetHeader>(
				'INSERT INTO `sessions` (`readable_id`) VALUES (?)',
				[readableId]
			);
			sessionId = inserted.insertId;
		}

		const [result] = await db.query<ResultSetHeader>(
			'INSERT INTO `events` (`session_id`, `time`, `amount`) VALUES (?, ?, ?)',
			[sessionId, data.time, data.amount]
		);

		await db.commit();
		db.release();

		updateTag(DAILY_SUMMARY_TAG(sessionId));
		updateTag(NEXT_FEEDING_PREDICTION_TAG(sessionId));

		return {event: {id: result.insertId, time: data.time, amount: data.amount}, error: false};
	} catch (error) {
		await db.rollback();
		db.release();
		return errorResponse(t('database.error'), error);
	}
}