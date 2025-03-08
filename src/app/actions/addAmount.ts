'use server'

import promisePool from '@/lib/mysql';

export default async function addAmount(formData: FormData) {
	const amount = formData.get('amount');

	if (typeof amount !== 'string') {
		return;
	}

	promisePool.query(
		'INSERT INTO events (amount, time) VALUES (?, ?)',
		[parseInt(amount), new Date()]
	);
}
