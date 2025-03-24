import {NextRequest} from 'next/server';
import {RowDataPacket} from 'mysql2';
import {errorResponse} from '@/lib/util';
import {getIdByReadableId} from '@/app/api/getIdByReadableId';
import {getTranslations} from 'next-intl/server';
import promisePool from '@/lib/mysql';
import {z} from 'zod';

interface Event extends RowDataPacket {
	id: number
	amount: number
	time: string
}

const getSchema = z.object({
	readableId: z.string(),
});

export async function GET(req: NextRequest): Promise<Response> {
	const t = await getTranslations('api');

	const {data, error} = getSchema.safeParse({
		readableId: req.nextUrl.searchParams.get('id'),
	})

	if (error || !data) {
		return Response.json(errorResponse(t('getEvent.errors.parse'), error));
	}

	const db = await promisePool.getConnection();

	const id = await getIdByReadableId(db, data.readableId);

	if (id === undefined) {
		// An id is inserted into the database only when adding an event. Consequently, no event has
		// been added for that id yet.
		return Response.json([]);
	}

	try {
		const [rows] = await db.query<Event[]>(
			'SELECT `id`, `amount`, `time` FROM `events` WHERE `session_id` = ?',
			[id]
		);

		const timezoneOffset = new Date().getTimezoneOffset();

		return Response.json(rows.map(row => ({
			...row,
			time: new Date(new Date(row.time).getTime() - timezoneOffset * 60 * 1000),
		})));

	} catch (error) {
		return Response.json(errorResponse(t('database.error'), error));
	} finally {
		db.release();
	}
}
