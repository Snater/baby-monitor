import {NextRequest} from 'next/server';
import {ResultSetHeader} from 'mysql2';
import promisePool from '@/lib/mysql';

export async function GET(req: NextRequest) {
	const id = req.nextUrl.searchParams.get('id');

	if (!id) {
		console.error('Missing id parameter');
		return Response.json([]);
	}

	try {
		const [result] = await promisePool.query<ResultSetHeader>(
			'DELETE FROM `events` WHERE `id` = ? LIMIT 1',
			[id]
		);

		if (result.affectedRows === 0) {
			console.error('Unable to delete');
		}

		return Response.json({message: 'ok'});

	} catch (error) {
		console.error('Error querying the database:', error);
	}
}
