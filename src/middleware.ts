import {NextRequest, NextResponse} from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {routing} from '@/i18n/routing';

export function middleware(request: NextRequest) {

	if (request.nextUrl.pathname === '/') {
		const cookie = request.cookies.get('id');

		if (cookie && cookie.value !== '') {
			return NextResponse.redirect(new URL(`/${cookie.value}`, request.url));
		}
	}

	const handleI18nRouting = createMiddleware(routing);
	const response = handleI18nRouting(request);

	const segments = request.nextUrl.pathname.split('/');
	const id = segments[2];

	if (id) {
		response.cookies.set('id', id, {maxAge: 60 * 60 * 24 * 30});
	}

	return response;
}

export const config = {
	matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
