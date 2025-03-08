import './globals.css';
import type {Metadata} from 'next';
import {Roboto} from 'next/font/google';

const roboto = Roboto({
	variable: '--font-roboto',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Baby Monitor',
	description: 'Track you baby#39;s formula milk consumption',
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
	return (
		<html lang="en">
			<body className={`${roboto.variable} antialiased`}>
				{children}
			</body>
		</html>
	);
}
