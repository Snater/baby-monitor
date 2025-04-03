import {addMultipleSchema, eventSchema} from '@/schemas';
import type {Event} from '@/types';
import {NextRequest} from 'next/server';
import type {RowDataPacket} from 'mysql2';
import {errorResponse} from '@/lib/util';
import {getIdByReadableId} from '@/app/api/getIdByReadableId';
import {getTranslations} from 'next-intl/server';
import promisePool from '@/lib/mysql';
import z from 'zod';

interface Id extends RowDataPacket {
	id: number
}

type EventWithGmtTime = z.infer<typeof eventSchema> & {gmtTime: Date}

export async function POST(req: NextRequest): Promise<Response> {
	const t = await getTranslations('api');

	const body = await req.json();

	const {data, error} = addMultipleSchema.safeParse(body);

	if (error || !data) {
		return Response.json(errorResponse(t('addEvents.errors.parse'), error));
	}

	const db = await promisePool.getConnection();

	const id = await getIdByReadableId(db, data.id);

	if (id === undefined) {
		db.release();
		return Response.json({events: [], error: false});
	}

	const eventsWithGmtTime: EventWithGmtTime[] = data.events.map(event => ({
		...event,
		gmtTime: new Date(event.time + data.timezoneOffset * 60 * 1000),
	}));

	let result: Id[];

	try {
		[result] = await db.query<Id[]>(
			'INSERT INTO `events` (`session_id`, `time`, `amount`) VALUES ? RETURNING id',
			[eventsWithGmtTime.map(event => [id, event.gmtTime, event.amount])]
		);
	} catch (error) {
		return Response.json(errorResponse(t('database.error'), error));
	} finally {
		db.release();
	}

	const insertedEvents: Event[] = eventsWithGmtTime.map((event, i) => ({
		id: result[i].id,
		amount: event.amount,
		time: event.gmtTime.getTime(),
	}));

	return Response.json({events: insertedEvents, error: false});
}
