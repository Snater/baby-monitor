import {NextRequest, NextResponse} from 'next/server';
import humanId from 'human-id';

export function middleware(request: NextRequest) {

	const id = humanId({
		separator: '-',
		capitalize: false,
	});

	return NextResponse.redirect(new URL(`/${id}`, request.url))
}

export const config = {
	matcher: '/',
}
