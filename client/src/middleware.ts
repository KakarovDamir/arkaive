import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  locales: ['eng', 'rus', 'kaz'],
 
  defaultLocale: 'rus'
});
 
export const config = {
  matcher: ['/', '/(rus|eng|kaz)/:path*']
};