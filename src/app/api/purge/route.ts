import {errorResponse} from '@/lib/util';
import promisePool from '@/lib/mysql';

export async function GET(): Promise<Response> {
	const db = await promisePool.getConnection();

	try {

		// Delete all events of sessions that have not received new events for a week.
		await db.query(
			'DELETE FROM `events` WHERE `session_id` IN (SELECT `session_id` FROM `events` GROUP BY `session_id` HAVING DATEDIFF(NOW(), MAX(`time`)) > 10)'
		);

		// Delete all sessions that have no events.
		await db.query(
			'DELETE FROM `sessions` WHERE NOT EXISTS (SELECT * FROM `events` WHERE `sessions`.`id` = `events`.`session_id`)'
		);

		return Response.json({});

	} catch (error) {
		// Failing to clean up the database is not meant to hit the UI.
		return Response.json(errorResponse('', error));
	} finally {
		db.release();
	}
}
