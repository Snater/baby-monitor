'use client'

import {useEffect} from 'react';

export default function ServiceWorker() {

	useEffect(() => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker
				.register('/sw.js')
				.catch(error => {
					console.error('Service Worker registration failed:', error);
				});
		}
	}, []);

	return null;
}
