import {NextRequest} from 'next/server';
import {RowDataPacket} from 'mysql2';
import {errorResponse, getTimezoneOffsetString, utcDate} from '@/lib/util';
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
		timezoneOffset: req.nextUrl.searchParams.get('timezoneOffset'),
	})

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

	// Since operating the database in UTC, figuring out the local day's start in UTC.
	const dateUTC = utcDate(data.date);
	dateUTC.setMinutes(dateUTC.getMinutes() + data.timezoneOffset);
	const dateUTCFormatted = dateUTC.toISOString().slice(0, 19).replace('T', ' ');
	const timezoneOffsetString = getTimezoneOffsetString(data.timezoneOffset);

	try {
		const [rows] = await db.query<Event[]>(
			'SELECT `id`, `amount`, `time`, DATE(CONVERT_TZ(DATE_SUB(?, INTERVAL 2 DAY), ?, ?)), DATE(CONVERT_TZ(?, ?, ?)) + INTERVAL 1 DAY - INTERVAL 1 SECOND FROM `events` WHERE `session_id` = ?',
			[dateUTCFormatted, timezoneOffsetString, '+00:00', dateUTCFormatted, timezoneOffsetString, '+00:00', id]
		);

		db.release();
		return Response.json(rows);

	} catch (error) {
		db.release();
		return Response.json(errorResponse(t('database.error'), error));
	}
}
