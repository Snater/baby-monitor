import './globals.css';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {Pacifico,Sour_Gummy} from 'next/font/google';
import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query';
import {ReactNode} from 'react';
import TanStackQueryProvider from './TanStackQueryProvider';
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
	params: Promise<{locale: string}>
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
	const queryClient = new QueryClient();

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	return (
		<html lang={locale}>
			<body className={`${pacifico.variable} ${sourGummy.variable} antialiased`}>
				<TanStackQueryProvider>
					<NextIntlClientProvider>
						{
							/*
								This <div> makes the Popopver close by clicking outside of it:
								https://github.com/tailwindlabs/headlessui/issues/2752#issuecomment-1724096430
							*/
						}
						<div>
							<HydrationBoundary state={dehydrate(queryClient)}>
								{children}
							</HydrationBoundary>
						</div>
					</NextIntlClientProvider>
				</TanStackQueryProvider>
			</body>
		</html>
	);
}
