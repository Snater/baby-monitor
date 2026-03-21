import type {NextRequest} from "next/server";
import type {PoolConnection} from "mysql2/promise";
import {errorResponse} from "@/lib/util";
import {getIdByReadableId} from "@/app/api/getIdByReadableId";
import {getSchema} from "@/schemas";
import {getTranslations} from "next-intl/server";
import promisePool from "@/lib/mysql";
import type {z} from "zod/v4";

type SessionContext = {
	data: z.infer<typeof getSchema>
	db: PoolConnection
	id: number
	t: Awaited<ReturnType<typeof getTranslations<'api'>>>
}

export async function withSession(
	req: NextRequest,
	handler: (ctx: SessionContext) => Promise<Response>
): Promise<Response> {
	const {data, error} = getSchema.safeParse({
		date: req.nextUrl.searchParams.get('date'),
		readableId: req.nextUrl.searchParams.get('id'),
	});

	const [t, db] = await Promise.all([
		getTranslations('api'),
		promisePool.getConnection(),
	]);

	if (error || !data) {
		db.release();
		return Response.json(errorResponse(t('errors.parse'), error));
	}

	const id = await getIdByReadableId(db, data.readableId);

	if (id === undefined) {
		db.release();
		return Response.json([]);
	}

	try {
		return await handler({data, db, id, t});
	} catch (error) {
		db.release();
		throw error;
	}
}