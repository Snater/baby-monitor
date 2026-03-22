import type {PoolConnection} from 'mysql2/promise';
import type {RowDataPacket} from 'mysql2';
import promisePool from '@/lib/mysql';

interface Session extends RowDataPacket {
	id: number
	readable_id: string
}

export async function getSessionId(readableId: string, db?: PoolConnection) {
	const connection = db ?? await promisePool.getConnection();

	try {
		const [rows] = await connection.query<Session[]>(
			'SELECT `id` FROM `sessions` WHERE `readable_id` = ?',
			[readableId]
		);

		return rows[0]?.id;

	} catch (error) {
		console.error('Error querying the database:', error);
		return undefined;

	} finally {
		if (!db) {
			connection.release();
		}
	}
}
