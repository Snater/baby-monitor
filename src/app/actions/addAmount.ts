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
	const customAmount = formData.get('customAmount');
	const datetime = formData.get('datetime');

	if (
		typeof amount !== 'string'
		|| typeof datetime !== 'string'
		|| amount === 'custom' && typeof customAmount !== 'string'
	) {
		return {message: 'invalid'};
	}

	const event: Event = {
		amount: amount === 'custom' ? parseInt(customAmount as string) : parseInt(amount),
		time: new Date(datetime).getTime(),
	}

	await promisePool.query(
		'INSERT INTO events (amount, time) VALUES (?, ?)',
		[event.amount, new Date(event.time)]
	);

	return {message: 'ok', events: [event]};
}
