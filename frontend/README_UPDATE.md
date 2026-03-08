# Actualización del Frontend: Perfiles, Imágenes y JWT

Este documento detalla todas las mejoras estéticas, correcciones de red, y nuevas mecánicas implementadas en la interfaz de React para interactuar con los perfiles de usuario.

## 1. Rediseño Estilo GitHub (`Profile.jsx` y `Profile.css`)
La página de perfil principal fue completamente rediseñada para acercarse a la apariencia y distribución de perfiles de GitHub.
- Se separó el diseño en una barra lateral (Sidebar) y un área principal de contenido.
- Los estilos se anclaron a las variables dinámicas de la aplicación provenientes de `base.css`, respetando los contrastes de forma profesional.
- Se implementó un Avatar por defecto en `profile_default.svg` usando la popular silueta de GitHub.

## 2. Gestión Dinámica de Imágenes (`YourTree.jsx` y asociados)
El módulo principal de tu árbol recibió grandes mejoras para visualizar y editar tu perfil en vivo.
- `YourTree.jsx` y `YourTreeUser.jsx` ahora ejecutan un `fetch` a la base de datos nada más cargar la página. Esto recupera en tiempo real tu `imageUrl` y tu `bio`.
- Se modificaron los componentes base (como `Links_base` y `General_tree`) para aceptar esta nueva variable de `imageUrl` en vez de usar siempre el SVG genérico, mostrando instantáneamente tu rostro a los visitantes.

## 3. Carga y Eliminación de Fotos (`forms.jsx`)
El sistema de formularios evolucionó de ser interfaces pasivas a formularios activos en JavaScript `FormData`.
- `FormUploadImage` fue modificado para comunicarse con su componente padre cuando seleccionas una imagen (`onFileSelect`).
- Se le inyectó la funcionalidad de borrar la imagen existente (`onDeleteImage`), despejando la interfaz y enviando una señal oculta (`delete_image: "true"`) al guardar, permitiéndote eliminar tu avatar por completo.
- Todo esto se empaqueta junto a tu "bio" en un objeto limpio de `FormData` y se envía al "Save" de una vez.

## 4. Resolución de Errores Críticos de Autenticación (`token.jsx`)
La aplicación sufría de caídas constantes con códigos "500 Internal Server Error" causados por el mensaje `jwt malformed`.
- **Raíz del problema:** Muchos componentes intentaban obtener el JWT a través de `localStorage.getItem("accessToken")`, el cual devolvía valores nulos porque la aplicación en realidad guardaba estos accesos en **Cookies**.
- Se refactorizó la lectura de tokens en todas partes (`FormCreateLink`, `FormDeleteLink`, `FormUpdateLink`, y `YourTree.jsx`). Ahora, todas hacen uso de la función oficial `getToken()` de la aplicación. ¡Las peticiones ya no fallan y las barreras de autenticación del backend aprueban el token con éxito!
