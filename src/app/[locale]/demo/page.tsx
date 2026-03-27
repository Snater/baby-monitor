import type {ResultSetHeader} from 'mysql2';
import {buildDemoEventInserts} from '@/data/demoEvents';
import humanId from 'human-id';
import promisePool from '@/lib/mysql';
import {redirect} from 'next/navigation';

export default async function Page() {
	const readableId = `demo-${humanId({separator: '-', capitalize: false})}`;
	const db = await promisePool.getConnection();

	try {
		const [result] = await db.query<ResultSetHeader>(
			'INSERT INTO `sessions` (`readable_id`) VALUES (?)',
			[readableId]
		);

		const sessionId = result.insertId;

		await db.query(
			'INSERT INTO `events` (`session_id`, `time`, `amount`) VALUES ?',
			[buildDemoEventInserts().map(([time, amount]) => [sessionId, time, amount])]
		);
	} finally {
		db.release();
	}

	redirect(`/${readableId}`);
}