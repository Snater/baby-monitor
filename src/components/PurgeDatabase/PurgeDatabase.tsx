'use client'

import {useEffect, useRef} from 'react';

export default function PurgeDatabase() {
	const hasPurged = useRef(false);

	useEffect(() => {
		if (!hasPurged.current) {
			fetch('/api/purge').then(() => {
				hasPurged.current = true;
			});
		}
	}, []);

	return null;
}
