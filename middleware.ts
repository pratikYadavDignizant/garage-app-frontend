import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('admin_token')?.value;
    const { pathname } = request.nextUrl;

    // Allow access to admin auth pages without token
    const isAuthPage = pathname.startsWith('/admin/login') ||
        pathname.startsWith('/admin/forgot-password') ||
        pathname.startsWith('/admin/reset-password');

    // Protect admin routes (except auth pages)
    if (pathname.startsWith('/admin') && !isAuthPage) {
        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
