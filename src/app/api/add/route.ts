import {RowDataPacket} from 'mysql2';
import promisePool from '@/lib/mysql';

interface Event extends RowDataPacket {
	amount: number
	time: string
}

export async function GET() {

	try {
		const [rows] = await promisePool.query<Event[]>('SELECT * FROM events');

		return Response.json(rows.map(row => ({
			...row,
			time: new Date(row.time).getTime(),
		})));

	} catch (error) {
		console.error('Error querying the database:', error);
	}
}
