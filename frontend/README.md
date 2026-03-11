# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## 🚀 Cambios y Mejoras Recientes (Módulo de Foros)

Se han realizado diversas actualizaciones en el sistema de foros para mejorar la experiencia de usuario y asemejar la interfaz a estilos modernos (tipo Reddit):

### Frontend (UI/UX)
- **Vista de Tarjetas (Listado):** 
  - Se removieron los botones de acción directos (Like, Comentar, Compartir) de la vista de lista para priorizar un diseño más limpio.
  - Se integró la muestra de la fecha de creación del post formateada (ej: `9 mar 2026`) justo arriba del título.
- **Vista de Detalle (Modal Pop-Up):**
  - El modal ahora tiene un efecto de fondo desenfocado (`blur`) para destacar sobre el resto de la página mediante el seudoelemento `::backdrop`.
  - Se implementó un sistema interno de comentarios reales, permitiendo a los usuarios visualizar hilos de texto y publicar nuevos comentarios si están logueados.
  - La fecha de creación formateada también se incluyó bajo el título para referenciar cuándo se creó el foro.
  - Se eliminó la funcionalidad decorativa de "Likes" dentro del modal para simplificar la interacción.
- **Deep Linking y Compartir:**
  - Se reparó el bug que forzaba el cierre del modal al acceder mediante un enlace directo (ej: `/Forums/1`). Ahora la pantalla de foros detecta el ID y despliega la ventana emergente flotando sobre la página principal sin fallos ni parpadeos.

### Backend y Base de Datos
- **Controladores y Rutas de Foros:**
  - Se corrigió un bug grave en `get_forum` (GET `/forums/:id`) que trataba el objeto devuelto por la BD como matriz, lo que devolvía `undefined` y causaba un `SyntaxError` (JSON) en el frontend.
- **Sistema de Comentarios:**
  - Se agregó soporte robusto en el repositorio para los comentarios (`forum_comment.repository.js`), creando el método `getForumCommentsByForumId` que ejecuta un `LEFT JOIN` con perfiles para obtener nombres y apellidos.
  - Se sumaron rutas adicionales (`/forum/:id/comments`) a la API REST de foros para surtir al frontend de estas respuestas en tiempo real.

---

## 🚀 Cambios y Mejoras Recientes (Módulo de Páginas Recientes y Foros)

### Frontend (UI/UX)
- **Páginas Recientes (`Recent_Pages.jsx`):** 
  - Se reemplazó completamente "Top Pages" por "Recent Pages" en la barra de navegación.
  - Se integró el componente reutilizable `Links_base` (Layouts dinámicos dependiendo del tema del usuario) para generar las tarjetas de vista previa en lugar de crear marcado HTML redundante.
  - Se implementó un límite visual (máx. 3 enlaces visibles, aprox `220px`) para el `link_body` en las tarjetas de usuarios empleando un efecto de desvanecimiento (`fade-out gradient`) en CSS (`recent_pages.css`).
  - Se solucionó un conflicto de HTML inválido (etiquetas `<a>` anidadas) cambiando el contenedor de la tarjeta a `<article>` y capturando los clics mediante JavaScript e interactores de capa invisible, redirigiendo a `/YourTree/@usuario`.
- **Foros (`Forums.jsx`):**
  - Se resolvió un `ReferenceError` fatal al renderizar el modal flotante (`ForumDetailDialog`). La función `formatDate` dependiente fue reubicada en el alcance global del módulo, liberándola del ciclo de vida exclusivo del componente padre, previniendo caídas totales de la UI (White Screen of Death).
  - Ajustes de responsividad en `.forum_detail_dialog` y la cabecera reubicando el 100% por un estilizado 80% centrado.

### Backend y Base de Datos
- **Controladores de Perfiles:**
  - Se diseñó el endpoint GET `/api/profiles/recent` exclusivo para la obtención cronológica (más recientes primero) de hasta 30 usuarios públicos.
  - Se insertó lógica SQL (`EXISTS`) directamente en el repositorio/controlador para filtrar agresivamente de la base de datos a cualquier usuario que no posea al menos **1 enlace visible activo** en su árbol de enlaces.
  - Las consultas ahora inyectan las previsualizaciones de enlaces directamente desde la base de datos mediante subconsultas `json_agg()`.
- **Esquema de Base de Datos (`database_final.sql`):**
  - Reflejo fidedigno de `database_final.sql` con la base de datos de producción, eliminando tablas huérfanas como `refresh_tokens`, y acoplando columnas vitales como `token_version` por defecto a 0.
