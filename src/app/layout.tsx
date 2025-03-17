import './globals.css';
import {Pacifico,Sour_Gummy} from 'next/font/google';
import type {Metadata} from 'next';
import {ReactNode} from 'react';
import TanStackQueryProvider from '@/components/TanStackQueryProvider';

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
};

export default function RootLayout({children}: Readonly<{children: ReactNode}>) {
	return (
		<html lang="en">
			<body className={`${pacifico.variable} ${sourGummy.variable} antialiased`}>
				<TanStackQueryProvider>
					{children}
				</TanStackQueryProvider>
			</body>
		</html>
	);
}
