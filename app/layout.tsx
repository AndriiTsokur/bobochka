import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from '@/lib/constants';
import '@/assets/styles/globals.css';

const roboto = Roboto({
	weight: ['400', '700'],
	subsets: ['latin', 'cyrillic'],
	fallback: ['Arial', 'sans-serif'],
});

export const metadata: Metadata = {
	title: {
		template: `%s | Bobochka`,
		default: APP_NAME,
	},
	description: APP_DESCRIPTION,
	metadataBase: new URL(SERVER_URL),
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${roboto.className} antialiased`}>
				<ThemeProvider
					attribute='class'
					defaultTheme='light'
					enableSystem
					disableTransitionOnChange
				>
					{children}
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
