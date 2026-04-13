/* 
  Headers Configuration for Nginx
  Esta configuración ya está en nginx.conf, pero se documenta aquí para referencia
*/

/*
FAVICON HEADERS:
- Favicons deben servirse con Cache-Control: public, max-age=31536000 (1 año)
- Content-Type debe ser detectado correctamente (image/png, image/svg+xml, image/x-icon)

SEO HEADERS:
- X-robots-Tag: No agregues porque robots.txt ya lo maneja
- Canonical URL: Agregado en HTML y mediante Helmet en React

SECURITY HEADERS:
- X-Content-Type-Options: nosniff (evita sniffing de tipos MIME)
- X-Frame-Options: SAMEORIGIN (previene clickjacking)
- X-XSS-Protection: 1; mode=block (muy básico, mejor usar CSP)
- Content-Security-Policy: Recomendado agregar

PERFORMANCE:
- gzip: Comprime respuestas
- brotli: Compresión más eficiente (si está disponible)
- Cache-Control: Estrategia descrita en nginx.conf
*/

// Ejemplo de CSP header a agregar en nginx.conf:
// add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.cdnfonts.com; font-src 'self' https://fonts.gstatic.com https://fonts.cdnfonts.com; img-src 'self' data: https:; connect-src 'self' https:;" always;
