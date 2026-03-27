# 🖥️ Proyecto FP - Frontend Web

## 📒 Descripción

Esta es la interfaz de usuario (Cliente) del proyecto FP, desarrollada en **React** bajo el empaquetador ultrarrápido **Vite**. Su objetivo es proporcionar una experiencia de usuario moderna, reactiva e intuitiva, consumiendo los endpoints de nuestro Backend API para interactuar con la plataforma de perfiles, foros y panel de administración.

## 🫀 Requisitos MÍNIMOS

- [Node.js](https://nodejs.org/) (v16.0 o superior recomedado)
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- [pnpm](https://pnpm.io/), `npm` o `yarn`

## 📦 Instalación y ejecución en local

Sitúate en la carpeta `frontend/` y procede a instalar las dependencias visuales e lógicas de React:

```bash
npm install
# o con pnpm:
pnpm install
```

Asegúrate de que tu Backend se esté ejecutando y luego enciende el servidor de entorno de desarrollo (con soporte de HMR):

```bash
npm run dev
```

## 🏗️ Estructura del Proyecto

La arquitectura del lado del cliente centraliza la lógica dentro de la carpeta `src/`, separando visuales de funcionalidad atómica:

```text
frontend/
└── src/
    ├── assets/
    ├── components/
    ├── pages/
    └── main.jsx
```

### 🔍 Detalle de cada Apartado (Explicación Explícita)

#### 🎨 `src/assets/`
Almacena todo el material estático pasivo y estilizado de la aplicación. Contiene desde nuestras tipografías y logos en SVG, hasta el sistema maestro de hojas de estilo (archivos genéricos `.css`) que inyectan las variables universales y el diseño responsivo en toda la página.

#### 🧱 `src/components/`
El bloque de construcción e ingeniería de la UI. Aquí residen elementos que no pueden ser pantalla por sí mismos, pero que componen la interfaz, diseñados estratégicamente para inyectarse múltiples veces en distintos contextos.  
*(Ej: Barras de navegación superior, menús desplegables, modales interactivos flotantes (`Dialogs`), o tarjetas individuales de previsualización).*

#### 📖 `src/pages/`
Son las pantallas gigantes o "Vistas Completas". Representan los dominios que el enrutador te muestra cuando navegas a `/`, `/forums`, o `/YourTree`. Su labor principal es agrupar a docenas de componentes de la carpeta anterior y alimentar a dichos componentes con los Estados globales o respuestas `Fetch` del servidor.

#### 🚀 `src/main.jsx`
Es la llave de ignición de React. Al abrir la app, Vite lo busca como el archivo sagrado. Su responsabilidad consiste en inyectar el código JavaScript directamente al documento HTML (`index.html`) por medio del `ReactDOM`. A su vez, inicializa los Proveedores (`Providers`) de Enrutamiento y protege las ventanas de visualización de los usuarios no autenticados.

---

## 🚀 Historial de Cambios y Mejoras Recientes

### Módulo de Foros
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

### Módulo de Páginas Recientes
- **Frontend (UI/UX) - `Recent_Pages.jsx`:** 
  - Se reemplazó completamente "Top Pages" por "Recent Pages" en la barra de navegación.
  - Se integró el componente reutilizable `Links_base` (Layouts dinámicos dependiendo del tema del usuario) para generar las tarjetas de vista previa en lugar de crear marcado HTML redundante.
  - Se implementó un límite visual (máx. 3 enlaces visibles, aprox `220px`) para el `link_body` en las tarjetas de usuarios empleando un efecto de desvanecimiento (`fade-out gradient`) en CSS (`recent_pages.css`).
  - Se solucionó un conflicto de HTML inválido (etiquetas `<a>` anidadas) cambiando el contenedor de la tarjeta a `<article>` y capturando los clics mediante JavaScript e interactores de capa invisible, redirigiendo a `/YourTree/@usuario`.
- **Foros - `Forums.jsx`:**
  - Se resolvió un `ReferenceError` fatal al renderizar el modal flotante (`ForumDetailDialog`). La función `formatDate` dependiente fue reubicada en el alcance global del módulo, liberándola del ciclo de vida exclusivo del componente padre, previniendo caídas totales de la UI (White Screen of Death).
  - Ajustes de responsividad en `.forum_detail_dialog` y la cabecera reubicando el 100% por un estilizado 80% centrado.
