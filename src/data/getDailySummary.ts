import type {DbEvent} from '@/app/api/types';
import {anthropic} from '@ai-sdk/anthropic';
import {computeDailyStats} from '@/lib/stats';
import {generateText} from 'ai';
import promisePool from '@/lib/mysql';
import {unstable_cache} from 'next/cache';

export const DAILY_SUMMARY_TAG = (sessionId: number) => `daily-summary-${sessionId}`

async function fetchDailySummary(sessionId: number, locale: string): Promise<string> {
	const db = await promisePool.getConnection();

	let rows: DbEvent[];

	try {
		[rows] = await db.query<DbEvent[]>(
			`SELECT \`id\`, \`amount\`, \`time\` FROM \`events\` WHERE \`session_id\` = ? AND TO_DAYS(time) = TO_DAYS(NOW())`,
			[sessionId]
		);
	} catch {
		db.release();
		return '';
	}

	db.release();

	const stats = computeDailyStats(rows);

	if (stats.totalFeedings === 0) {
		return '';
	}

	try {
		const {text} = await generateText({
			model: anthropic(process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5"),
			system: 'You are a helpful baby feeding assistant.',
			prompt: `Write a short, friendly daily summary for parents.

Data:
- Total feedings: ${stats.totalFeedings}
- Total intake (ml): ${stats.totalAmount}
- Average feeding size (ml): ${stats.averageAmount.toFixed(0)}
- Average interval (minutes): ${stats.averageInterval.toFixed(0)}

Guidelines:
- Keep it under 3 sentences
- Be supportive, not clinical
- Do NOT give medical advice
- Use natural language
- Respond in the language with locale code: ${locale}

Example tone:
"Your baby fed 6 times today, with steady intake throughout the day."`,
		});

		return text;
	} catch {
		return '';
	}
}

export function getDailySummary(sessionId: number, locale: string) {
	return unstable_cache(
		() => fetchDailySummary(sessionId, locale),
		[DAILY_SUMMARY_TAG(sessionId)],
		{tags: [DAILY_SUMMARY_TAG(sessionId)]}
	)();
}