import { NextResponse } from 'next/server';

export function middleware(request) {
  // Si la ruta es la raíz, redirigir a /login
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: '/',
};