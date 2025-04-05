import {ResultSetHeader, RowDataPacket} from 'mysql2';
import type {Event} from '@/types';
import {NextRequest} from 'next/server';
import {errorResponse} from '@/lib/util';
import {getIdByReadableId} from '@/app/api/getIdByReadableId';
import {getTranslations} from 'next-intl/server';
import promisePool from '@/lib/mysql';
import {syncSchema} from '@/schemas';

interface Id extends RowDataPacket {
	id: number
}

export async function POST(req: NextRequest): Promise<Response> {
	const t = await getTranslations('api');

	const body = await req.json();

	const {data, error} = syncSchema.safeParse(body);

	if (error || !data) {
		return Response.json(errorResponse(t('sync.errors.parse'), error));
	}

	const db = await promisePool.getConnection();

	const id = await getIdByReadableId(db, data.id);

	if (id === undefined) {
		db.release();
		return Response.json({delete: [], events: [], error: false});
	}

	let insertedEvents: Event[] = [];

	if (data.events.length > 0) {
		let result: Id[];

		try {
			const valueString = data.events.map(() => `(?, FROM_UNIXTIME(?), ?)`).join(', ');

			[result] = await db.query<Id[]>(
				'INSERT INTO `events` (`session_id`, `time`, `amount`) VALUES ' + valueString + ' RETURNING id',
				data.events.flatMap(event => [id, Math.floor(event.time / 1000), event.amount])
			);

			console.log(result);
		} catch (error) {
			db.release();
			return Response.json(errorResponse(t('database.error'), error));
		}

		insertedEvents = data.events.map((event, i) => ({
			id: result[i].id,
			amount: event.amount,
			time: event.time,
		}));
	}

	if (data.delete.length > 0) {
		try {
			const [result] = await db.query<ResultSetHeader>(
				'DELETE FROM `events` WHERE `id` IN ? LIMIT ?',
				[[data.delete], data.delete.length]
			);

			if (result.affectedRows === 0) {
				db.release();
				return Response.json(errorResponse(t('deleteEvent.errors.failed')));
			}
		} catch (error) {
			db.release();
			return Response.json(errorResponse(t('database.error'), error));
		}
	}

	db.release();
	return Response.json({events: insertedEvents, delete: data.delete, error: false});
}
