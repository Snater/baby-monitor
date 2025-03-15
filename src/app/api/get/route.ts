import {NextRequest} from 'next/server';
import {RowDataPacket} from 'mysql2';
import {getIdByReadableId} from '@/app/api/getIdByReadableId';
import promisePool from '@/lib/mysql';

interface Event extends RowDataPacket {
	amount: number
	time: string
}

export async function GET(req: NextRequest) {
	const readableId = req.nextUrl.searchParams.get('id');

	if (!readableId) {
		console.error('Missing id parameter');
		return Response.json([]);
	}

	const id = await getIdByReadableId(readableId);

	if (id === undefined) {
		console.error('Invalid id');
		return Response.json([]);
	}

	try {
		const [rows] = await promisePool.query<Event[]>(
			'SELECT * FROM `events` WHERE `session_id` = ?',
			[id]
		);

		return Response.json(rows.map(row => ({
			...row,
			time: new Date(row.time).getTime(),
		})));

	} catch (error) {
		console.error('Error querying the database:', error);
	}
}
