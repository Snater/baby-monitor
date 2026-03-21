import {DATA_LOOKBACK_DAYS, errorResponse} from '@/lib/util';
import {DbEvent} from "@/app/api/types";
import {NextRequest} from 'next/server';
import {withSession} from '@/app/api/withSession';

export async function GET(req: NextRequest): Promise<Response> {
	return withSession(req, async ({data, db, id, t}) => {
		try {
			const [rows] = await db.query<DbEvent[]>(
				`SELECT \`id\`, \`amount\`, \`time\` FROM \`events\` WHERE \`session_id\` = ? AND time BETWEEN DATE_SUB(?, INTERVAL ${DATA_LOOKBACK_DAYS} DAY) AND DATE_ADD(?, INTERVAL 1 DAY) - INTERVAL 1 SECOND`,
				[id, data.date, data.date]
			);

			db.release();
			return Response.json(rows);

		} catch (error) {
			db.release();
			return Response.json(errorResponse(t('database.error'), error));
		}
	});
}