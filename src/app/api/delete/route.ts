import {NextRequest} from 'next/server';
import {ResultSetHeader} from 'mysql2';
import {getIdByReadableId} from '@/app/api/getIdByReadableId';
import promisePool from '@/lib/mysql';

export async function GET(req: NextRequest) {
	const readableId = req.nextUrl.searchParams.get('id');
	const time = req.nextUrl.searchParams.get('time');

	if (!readableId) {
		console.error('Missing id parameter');
		return Response.json([]);
	}

	if (!time) {
		console.error('No time provided');
		return;
	}

	const id = await getIdByReadableId(readableId);

	if (id === undefined) {
		console.error('Invalid id');
		return;
	}

	const date = new Date(parseInt(time));

	try {
		const [result] = await promisePool.query<ResultSetHeader>(
			'DELETE FROM `events` WHERE `session_id` = ? AND `time` = ? LIMIT 1',
			[id, date]
		);

		if (result.affectedRows === 0) {
			console.error('Unable to delete');
		}

		return Response.json({message: 'ok'});

	} catch (error) {
		console.error('Error querying the database:', error);
	}
}
