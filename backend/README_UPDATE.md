# Actualización del Backend: Subida de Imágenes y Autenticación

Este documento resume los avances y las correcciones implementadas en el backend correspondientes a la funcionalidad de perfiles, carga de imágenes y el sistema de autenticación de rutas.

## 1. Carga de Imágenes con Multer (`multer.utils.js`)
Se configuró **Multer** para interceptar de manera segura archivos de imagen enviados desde el frontend.
- Las imágenes subidas se guardan físicamente en el directorio `upload/profiles/`.
- Se aplican filtros de seguridad: límite de 5MB y aceptación exclusiva de formatos (`.png`, `.jpg`, `.jpeg`, `.webp`).

## 2. Archivos Estáticos (`app.js`)
Para que el frontend pueda visualizar las imágenes subidas a la carpeta `upload`, el servidor Express fue configurado para servir esta carpeta de forma estática en la ruta pública `/yourtree/api/upload`.

## 3. Actualización de Perfil (`profiles.controller.js`)
Se implementó el controlador `patch_profile` para manejar la actualización de la biografía y la imagen de perfil.
- Si el usuario adjunta una nueva foto de perfil, el backend genera su URL correspondiente y la almacena.
- Si se recibe la bandera `delete_image`, el backend elimina la imagen activa guardando una cadena vacía en la base de datos `imageUrl = ""`.
- Todos estos campos se actualizan utilizando la función `COALESCE` en el repositorio para no sobreescribir destructivamente los campos que el usuario no modificó.

## 4. Obtención del ID en los Perfiles Públicos (`profile.model.js`)
Había un bug silente donde no se podían crear enlaces porque el perfil no poseía un ID. Esto se debía a que la función `toPublic()` de la clase `Profile` ocultaba estrictamente el `id`. Se actualizó la clase para incluir temporalmente `id: this.#id` en la respuesta pública, permitiendo al frontend adjuntar los enlaces al perfil correcto.

## 5. Corrección en el Middleware de Autenticación (`auth.middleware.js`)
Varios endpoints críticos en el sistema de enlaces y de perfiles devolvían errores extraños debido a inconsistencias en las rutas.
- En `profiles.routes.js` y `links.routes.js` se importaba una función inexistente (`authToken`). Se corrigió a su nombre real `authenticate`.
- Ahora, las rutas de modificación (crear, borrar, parchear y actualizar tanto perfiles como enlaces) están robustamente protegidas por el token JWT.
