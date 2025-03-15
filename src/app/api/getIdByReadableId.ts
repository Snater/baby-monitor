import promisePool from '@/lib/mysql';
import {RowDataPacket} from 'mysql2';

interface Session extends RowDataPacket {
	id: number
	readable_id: string
}

export async function getIdByReadableId(readableId: string) {
	try {
		const [rows] = await promisePool.query<Session[]>(
			'SELECT * FROM `sessions` WHERE `readable_id` = ?',
			[readableId]
		)

		if (rows.length === 0) {
			return undefined;
		}

		return rows[0].id;
	} catch (error) {
		console.error('Error querying the database:', error);
		return undefined;
	}
}
