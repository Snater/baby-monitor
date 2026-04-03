import type {DbEvent} from '@/app/api/types';
import {Output, generateText} from 'ai';
import {anthropic} from '@ai-sdk/anthropic';
import promisePool from '@/lib/mysql';
import {unstable_cache} from 'next/cache';
import {z} from 'zod';

export const NEXT_FEEDING_PREDICTION_TAG = (sessionId: number) => `next-feeding-prediction-${sessionId}`;

const predictionSchema = z.object({
	predictedTime: z.string().describe('ISO 8601 datetime string of the predicted next feeding time'),
});

async function fetchNextFeedingPrediction(sessionId: number): Promise<string | null> {
	const db = await promisePool.getConnection();
	let rows: DbEvent[];

	try {
		[rows] = await db.query<DbEvent[]>(
			`SELECT \`id\`, \`amount\`, \`time\` FROM \`events\`
			WHERE \`session_id\` = ? AND \`time\` >= DATE_SUB(NOW(), INTERVAL 48 HOUR)
			ORDER BY \`time\` ASC`,
			[sessionId]
		);
	} catch {
		db.release();
		return null;
	}

	db.release();

	if (rows.length < 2) {
		return null;
	}

	const feedingTimes = rows.map(row => new Date(row.time).toISOString());
	const lastFeeding = feedingTimes[feedingTimes.length - 1];
	const now = new Date().toISOString();

	try {
		const result = await generateText({
			model: anthropic(process.env.ANTHROPIC_MODEL ?? 'claude-haiku-4-5'),
			output: Output.object({schema: predictionSchema}),
			system: 'You are a baby feeding assistant that predicts the next feeding time based on historical patterns.',
			prompt: `Based on the feeding history below, predict the next feeding time.

Current time: ${now}
Last feeding: ${lastFeeding}

Feeding history (oldest to newest):
${feedingTimes.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Analyze the intervals between feedings, giving more weight to recent feedings, and predict when the next feeding is likely to happen. Return the predicted time as an ISO 8601 datetime string. The predicted time must be in the future relative to the current time.`,
		});

		const predicted = new Date(result.output.predictedTime);
		if (isNaN(predicted.getTime()) || predicted <= new Date()) {
			return null;
		}

		return result.output.predictedTime;
	} catch {
		return null;
	}
}

export function getNextFeedingPrediction(sessionId: number) {
	return unstable_cache(
		() => fetchNextFeedingPrediction(sessionId),
		[NEXT_FEEDING_PREDICTION_TAG(sessionId)],
		{tags: [NEXT_FEEDING_PREDICTION_TAG(sessionId)]}
	)();
}
