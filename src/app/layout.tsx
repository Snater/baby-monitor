import './globals.css';
import {Pacifico,Sour_Gummy} from 'next/font/google';
import type {Metadata} from 'next';
import Providers from './providers';
import {ReactNode} from 'react';

const pacifico = Pacifico({
	variable: '--font-pacifico',
	subsets: ['latin'],
	weight: '400'
});

const sourGummy = Sour_Gummy({
	variable: '--font-sour-gummy',
	subsets: ['latin'],
	weight: '400'
});

export const metadata: Metadata = {
	title: 'Baby Monitor',
	description: 'Track you baby’s formula milk consumption',
	icons: {
		icon: [
			{
				type: 'image/png',
				url: '/icon.png',
				sizes: 'any',
			},
			{
				type: 'image/svg+xml',
				url: '/icon.svg',
			},
			{
				type: 'image/png',
				url: '/icon-180.png',
				rel: 'apple-touch-icon',
			},
			{
				type: 'image/png',
				url: '/icon-192.png',
				sizes: '192x192',
			},
			{
				type: 'image/png',
				url: '/icon-512.png',
				sizes: '512x512',
			}
		]
	}
};

export default function RootLayout({children}: Readonly<{children: ReactNode}>) {
	return (
		<html lang="en">
			<body className={`${pacifico.variable} ${sourGummy.variable} antialiased`}>
				<Providers>
					{children}
				</Providers>
			</body>
		</html>
	);
}
