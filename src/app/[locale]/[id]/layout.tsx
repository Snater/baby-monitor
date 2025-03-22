import './globals.css';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {Pacifico,Sour_Gummy} from 'next/font/google';
import Providers from './providers';
import {ReactNode} from 'react';
import {getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

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

type MetadataProps = {
	params: Promise<{id: string, locale: string}>
}

export async function generateMetadata({params}: MetadataProps) {
	const {locale} = await params;
	const t = await getTranslations({locale, namespace: 'metadata'});

	return {
		title: t('title'),
		description: t('description'),
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
				},
			],
		},
	};
}

type Props = Readonly<{
	children: ReactNode
	params: Promise<{id: string, locale: string}>
}>

export default async function RootLayout({children, params}: Props) {
	const {locale} = await params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	return (
		<html lang={locale}>
			<body className={`${pacifico.variable} ${sourGummy.variable} antialiased`}>
				<Providers>
					<NextIntlClientProvider>
						{children}
					</NextIntlClientProvider>
				</Providers>
			</body>
		</html>
	);
}
