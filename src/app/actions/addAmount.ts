'use server'

import promisePool from '@/lib/mysql';

export default async function addAmount(formData: FormData) {
	const amount = formData.get('amount');
	const datetime = formData.get('datetime');

	if (typeof amount !== 'string' || typeof datetime !== 'string') {
		return;
	}

	promisePool.query(
		'INSERT INTO events (amount, time) VALUES (?, ?)',
		[parseInt(amount), new Date(datetime)]
	);
}
