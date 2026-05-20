'use server'

import {FormState} from '@/types';
import {ResultSetHeader} from 'mysql2';
import {deleteSchema} from '@/schemas';
import {errorResponse} from '@/lib/util';
import {getTranslations} from 'next-intl/server';
import promisePool from '@/lib/mysql';

export default async function deleteEvent(params: unknown): Promise<FormState> {
	const t = await getTranslations('api');

	const parsed = deleteSchema.safeParse(params);

	if (!parsed.success) {
		return errorResponse(t('deleteEvent.errors.parse'), parsed.error);
	}

	const { id } = parsed.data;

	const db = await promisePool.getConnection();

	try {
		const [result] = await db.query<ResultSetHeader>(
			'DELETE FROM `events` WHERE `id` = ? LIMIT 1',
			[id]
		);

		if (result.affectedRows === 0) {
			return errorResponse(t('deleteEvent.errors.failed'));
		}

		return {error: false};
	} catch (error) {
		return errorResponse(t('database.error'), error);
	} finally {
		db.release();
	}
}
