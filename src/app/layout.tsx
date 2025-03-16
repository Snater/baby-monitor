import './globals.css';
import type {Metadata} from 'next';
import {Roboto} from 'next/font/google';
import TanStackQueryProvider from '@/components/TanStackQueryProvider';

const roboto = Roboto({
	variable: '--font-roboto',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Baby Monitor',
	description: 'Track you baby’s formula milk consumption',
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
	return (
		<html lang="en">
			<body className={`${roboto.variable} antialiased`}>
				<TanStackQueryProvider>
					{children}
				</TanStackQueryProvider>
			</body>
		</html>
	);
}
