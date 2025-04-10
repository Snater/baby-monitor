const CACHE_NAME = 'baby-monitor_v0';

const precachedAssets = [
	'/icon.png',
	'/icon.svg',
	'/icon-180.png',
	'/icon-192.png',
	'/icon-256.png',
	'/icon-512.png',
	'/offline.html',
];

async function cacheAssets() {
	caches.open(CACHE_NAME).then((cache) => {
		return cache.addAll(precachedAssets);
	});
}

self.addEventListener('install', (event) => {
	event.waitUntil(cacheAssets());
});

async function purgeCaches() {
	const cacheNames = await caches.keys();
	return Promise.all(
		cacheNames
			.filter(name => name !== CACHE_NAME)
			.map(name => caches.delete(name))
	);
}

self.addEventListener('activate', (event) => {
	event.waitUntil(purgeCaches());
});

async function handleApi(request) {
	const url = new URL(request.url);

	if (url.pathname.startsWith('/api/purge')) {
		try {
			return await fetch(request);
		} catch {
			// Since purging the database is meaningless to cache, while it is not relevant for the UX,
			// ignoring any failures; Most likely the user is offline.
			return Response.json({});
		}
	}

	return fetch(request);
}

async function dynamicCaching(request) {
	const cache = await caches.open(CACHE_NAME);
	/** @type {Response | undefined} */
	let response = undefined;

	try {
		response = await fetch(request);

		if (response.ok) {
			await cache.put(request, response.clone());
		}

		return response;
	} catch {
		const cached = await caches.match(request);

		if (cached) {
			return cached;
		}

		if (request.mode === 'navigate' && request.method === 'GET') {
			return caches.match('/offline.html');
		}
	}

	return response ?? await caches.match('/offline.html');
}

self.addEventListener('fetch', (event) => {
	const request = event.request;
	const url = new URL(event.request.url);

	if (url.pathname.startsWith('/api/')) {
		event.respondWith(handleApi(request));
		return;
	}

	const isPrecachedRequest = precachedAssets.includes(url.pathname);

	if (isPrecachedRequest) {
		event.respondWith(caches.open(CACHE_NAME).then(cache => cache.match(event.request.url)));
		return;
	}

	event.respondWith(dynamicCaching(event.request));
});
