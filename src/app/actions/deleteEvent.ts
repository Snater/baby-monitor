'use server'

import {FormState} from '@/types';
import {ResultSetHeader} from 'mysql2';
import {deleteSchema} from '@/schemas';
import {errorResponse} from '@/lib/util';
import {getTranslations} from 'next-intl/server';
import promisePool from '@/lib/mysql';

export default async function deleteEvent(params: unknown): Promise<FormState> {
	const t = await getTranslations('api');

	const {data, error} = deleteSchema.safeParse(params);

	if (error || !data) {
		return errorResponse(t('deleteEvent.errors.parse'), error);
	}

	const db = await promisePool.getConnection();

	try {
		const [result] = await db.query<ResultSetHeader>(
			'DELETE FROM `events` WHERE `id` = ? LIMIT 1',
			[data.id]
		);

		if (result.affectedRows === 0) {
			db.release();
			return errorResponse(t('deleteEvent.errors.failed'));
		}

	} catch (error) {
		db.release();
		return errorResponse(t('database.error'), error);
	}

	db.release();
	return {error: false};
}
