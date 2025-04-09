import type {MetadataRoute} from 'next'
import {getTranslations} from 'next-intl/server';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
	const t = await getTranslations('pwa');

	return {
		name: t('name'),
		description: t('description'),
		display: 'standalone',
		background_color: '#fafaf9',
		icons: [
			{
				src: '/icon-192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/icon-256.png',
				sizes: '256x256',
				type: 'image/png',
			},
			{
				src: '/icon-512.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
		orientation: 'portrait',
		start_url: '/',
		theme_color: '#57534e',
	}
}

export const dynamic = 'force-dynamic';
