'use server'

import type {Event, FormState} from '@/types';
import promisePool from '@/lib/mysql';

export default async function addAmount(
	_prevState?: FormState,
	formData?: FormData
): Promise<FormState> {
	if (!formData) {
		return {message: 'no form submitted'};
	}

	const amount = formData.get('amount');
	const datetime = formData.get('datetime');

	if (typeof amount !== 'string' || typeof datetime !== 'string') {
		return {message: 'invalid'};
	}

	const event: Event = {
		amount: parseInt(amount),
		time: new Date(datetime).getTime(),
	}

	await promisePool.query(
		'INSERT INTO events (amount, time) VALUES (?, ?)',
		[event.amount, event.time]
	);

	return {message: 'ok', events: [event]};
}
