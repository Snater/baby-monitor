import {NextRequest, NextResponse} from 'next/server';
import createMiddleware from 'next-intl/middleware';
import humanId from 'human-id';
import {routing} from '@/i18n/routing';

export function middleware(request: NextRequest) {

	if (request.nextUrl.pathname === '/') {
		const id = humanId({
			separator: '-',
			capitalize: false,
		});

		return NextResponse.redirect(new URL(`/${id}`, request.url));
	}

	const handleI18nRouting = createMiddleware(routing);
	return handleI18nRouting(request);
}

export const config = {
	matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
