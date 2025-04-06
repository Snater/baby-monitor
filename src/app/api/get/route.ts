import {NextRequest} from 'next/server';
import {RowDataPacket} from 'mysql2';
import {errorResponse} from '@/lib/util';
import {getIdByReadableId} from '@/app/api/getIdByReadableId';
import {getSchema} from '@/schemas';
import {getTranslations} from 'next-intl/server';
import promisePool from '@/lib/mysql';

interface Event extends RowDataPacket {
	id: number
	amount: number
	time: string
}

export async function GET(req: NextRequest): Promise<Response> {
	const t = await getTranslations('api');

	const {data, error} = getSchema.safeParse({
		date: req.nextUrl.searchParams.get('date'),
		readableId: req.nextUrl.searchParams.get('id'),
	});

	if (error || !data) {
		return Response.json(errorResponse(t('getEvent.errors.parse'), error));
	}

	const db = await promisePool.getConnection();

	const id = await getIdByReadableId(db, data.readableId);

	if (id === undefined) {
		// An id is inserted into the database only when adding an event. Consequently, no event has
		// been added for that id yet.
		db.release();
		return Response.json([]);
	}

	try {
		const [rows] = await db.query<Event[]>(
			'SELECT `id`, `amount`, `time` FROM `events` WHERE `session_id` = ? AND time BETWEEN DATE_SUB(?, INTERVAL 2 DAY) AND DATE_ADD(?, INTERVAL 1 DAY) - INTERVAL 1 SECOND',
			[id, data.date, data.date]
		);

		db.release();
		return Response.json(rows);

	} catch (error) {
		db.release();
		return Response.json(errorResponse(t('database.error'), error));
	}
}
