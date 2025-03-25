'use client'

import {useEffect, useState} from 'react';

type PurgeStatus = 'none' | 'pending' | 'done';

export default function PurgeDatabase() {
	const [purgeStatus, setPurgedStatus] = useState<PurgeStatus>('none');

	useEffect(() => {
		if (purgeStatus === 'none') {
			setPurgedStatus('pending');
			fetch('/api/purge').then(() => setPurgedStatus('done'));
		}
	}, [purgeStatus]);

	return null;
}
