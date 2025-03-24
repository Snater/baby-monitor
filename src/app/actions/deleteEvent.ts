'use server'

import {FormState} from '@/types';
import {ResultSetHeader} from 'mysql2';
import {errorResponse} from '@/lib/util';
import {getTranslations} from 'next-intl/server';
import promisePool from '@/lib/mysql';
import {z} from 'zod';

const deleteSchema = z.object({
	id: z.coerce.number(),
});

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
			return {error: {message: t('deleteEvent.errors.failed')}};
		}

		return {error: false};

	} catch (error) {
		return errorResponse(t('database.error'), error);
	}
}
