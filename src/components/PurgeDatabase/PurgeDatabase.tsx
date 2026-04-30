'use client'

import {useEffect, useRef} from 'react';

export default function PurgeDatabase() {
	const hasPurged = useRef(false);

	useEffect(() => {
		if (!hasPurged.current) {
			const timeout = setTimeout(() => {
				fetch('/api/purge').then(() => {
					hasPurged.current = true;
				});
			}, 500);

			return () => clearTimeout(timeout);
		}
	}, []);

	return null;
}
