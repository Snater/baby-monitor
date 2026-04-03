import {NextRequest} from 'next/server';
import {errorResponse} from '@/lib/util';
import {getNextFeedingPrediction} from '@/data/getNextFeedingPrediction';
import {getSessionId} from '@/app/api/getSessionId';
import {getTranslations} from 'next-intl/server';
import {z} from 'zod/v4';

const predictSchema = z.object({
	readableId: z.string(),
});

export async function GET(req: NextRequest): Promise<Response> {
	const t = await getTranslations('api');

	const {data, error} = predictSchema.safeParse({
		readableId: req.nextUrl.searchParams.get('id'),
	});

	if (error || !data) {
		return Response.json(errorResponse(t('errors.parse'), error));
	}

	const id = await getSessionId(data.readableId);

	if (id === undefined) {
		return Response.json({predictedTime: null});
	}

	const predictedTime = await getNextFeedingPrediction(id);

	return Response.json({predictedTime});
}
