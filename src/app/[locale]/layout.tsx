import './globals.css';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {Pacifico,Sour_Gummy} from 'next/font/google';
import {ReactNode} from 'react';
import TanStackQueryProvider from './TanStackQueryProvider';
import {getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {Metadata} from "next";

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

export function generateStaticParams() {
	return routing.locales.map(locale => ({locale}));
}

export async function generateMetadata({params}: MetadataProps): Promise<Metadata> {
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
					sizes: '32x32',
				},
				{
					type: 'image/svg+xml',
					url: '/icon.svg',
					sizes: 'any',
				},
				{
					type: 'image/png',
					url: '/icon-180.png',
					rel: 'apple-touch-icon',
				},
			],
		},
		other: {
			'darkreader-lock': '',
		},
	};
}

type Props = Readonly<{
	children: ReactNode
	params: Promise<{locale: string}>
}>

export default async function RootLayout({children, params}: Props) {
	const {locale} = await params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={`${pacifico.variable} ${sourGummy.variable} antialiased`}>
				{/* Blocking script: sets theme class before first paint to avoid flash */}
				<script dangerouslySetInnerHTML={{__html: `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.classList.add(t,'no-transition');requestAnimationFrame(function(){document.documentElement.classList.remove('no-transition');});}catch(e){}})();`}} />
				<TanStackQueryProvider>
					<NextIntlClientProvider>
						{
							/*
								This <div> makes the Popover close by clicking outside of it:
								https://github.com/tailwindlabs/headlessui/issues/2752#issuecomment-1724096430
							*/
						}
						<div>
							{children}
						</div>
					</NextIntlClientProvider>
				</TanStackQueryProvider>
			</body>
		</html>
	);
}
