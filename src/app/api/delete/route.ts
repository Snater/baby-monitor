import promisePool from '@/lib/mysql';
import {NextRequest} from 'next/server';
import {ResultSetHeader} from 'mysql2';

export async function GET(req: NextRequest) {

	const time = req.nextUrl.searchParams.get('time');

	if (!time) {
		console.error('No time provided');
		return;
	}

	const date = new Date(parseInt(time));

	try {
		const [result] = await promisePool.query<ResultSetHeader>('DELETE FROM `events` WHERE `time` = ? LIMIT 1', [date]);

		if (result.affectedRows === 0) {
			console.error('Unable to delete');
		}

		return Response.json({message: 'ok'});

	} catch (error) {
		console.error('Error querying the database:', error);
	}
}
