import {getDailySummary} from '@/data/getDailySummary';
import {getLocale} from 'next-intl/server';
import {getSessionId} from '@/app/api/getSessionId';

type Props = {
	id?: string
}

export default async function DailySummary({id}: Props) {
	if (!id) {
		return null;
	}

	const [locale, sessionId] = await Promise.all([getLocale(), getSessionId(id)]);

	if (!sessionId) {
		return null;
	}

	const summary = await getDailySummary(sessionId, locale);

	if (!summary) {
		return null;
	}

	return (
		<div className="layout-container pb-0">{summary}</div>
	);
}