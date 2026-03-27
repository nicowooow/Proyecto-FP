# ⚙️ Proyecto FP - Backend API

## 📒 Descripción

Esta es la interfaz de programación de aplicaciones (API) principal del proyecto FP, desarrollada en **Node.js** con el framework **Express**. Su propósito es actuar como el núcleo que orquesta la lógica de negocio, las transacciones a la base de datos (PostgreSQL), la autenticación segura de los usuarios, y gestionar la admisión, compresión y distribución de archivos multimedia (como fotos de perfil).

## 🫀 Requisitos MÍNIMOS

- [Node.js](https://nodejs.org/) (v16.0 o superior)
- [PostgreSQL](https://www.postgresql.org/) (Base de datos relacional)
- Entorno de terminal compatible (Bash, PowerShell)

## 📦 Instalación y ejecución en local

Tras clonar el proyecto, sitúate en la carpeta `backend/` y descarga los módulos necesarios:

```bash
npm install
# o con pnpm:
pnpm install
```

Asegúrate de replicar tu archivo `.env` configurando los parámetros de DB y JWT (basados en `.env.example` si lo hubiera). Finalmente, levanta el proyecto:

```bash
node --watch app.js
```

## 🏗️ Estructura del Proyecto

La estructura del servidor sigue el patrón de diseño clásico de API REST, dividida horizontalmente en responsabilidades con baja dependencia. Esta organización se puede observar a continuación:

```text
backend/
├── config/
├── controllers/
├── db/
├── logs/
├── middlewares/
├── models/
├── public/
├── repository/
├── routes/
├── upload/
└── utils/
```

### 🔍 Detalle de cada Apartado (Explicación Explícita)

#### ⚙️ `config/`
Capa de configuraciones maestras. Contiene la orquestación inicial y unificación de variables de entorno globales. Sirve para que el resto de la aplicación consuma directrices parametrizadas (puertos, secretos JWT) de forma limpia y constante sin lidiar con los métodos crudos de Node.

#### 🎮 `controllers/`
Representa el "cerebro de acción" ante una llamada HTTP. Los controladores reciben la petición de red (ej. *Dame los foros* o *Crea un nuevo usuario*), interactúan con la capa de datos o servicios delegando la lógica atómica, y ensamblan una respuesta `JSON` consolidada (junto a códigos 200, 404, 500) para retornar al cliente.

#### 🗄️ `db/`
Establece y mantiene viva la piscina inyectora de conexiones (Pool) a nuestra instancia PostgreSQL. Garantiza que el resto del sistema pueda solicitar permisos para leer o escribir en las tablas de datos sin preocuparse de los túneles TCP y credenciales pesadas subyacentes.

#### 🛡️ `middlewares/`
Filtros de seguridad e interceptores pre-controlador. Son piezas de código funcionales en medio del "viaje" de la información (ej. `auth.middleware.js`). Antes de que una ruta entregue oro puro de datos a un usuario, un middleware extrae y valida su token para asegurarse de que tiene los roles necesarios. También actúan recolectando errores formales antes de desplomarse la App.

#### 📐 `models/`
Es el contenedor de los moldes lógico-orientados de las entidades. Aquí se codifican las propiedades y validaciones para instancias puras del software, como la clase `Usuario` o la clase `Comentario`. Definen la "forma" algorítmica de qué constituye una unidad de información en la aplicación.

#### 🗃️ `repository/`
Capa dedicada de forma **exclusiva al lenguaje de Base de Datos** (Data Access Layer). Aquí se recluyen y escriben todas las sentencias puras en SQL puro. El diseño exalta que los controladores pidan "Crea esto" y el Repositorio transforme tal instrucción en `INSERT INTO (...)`. Gracias a esto, si en un futuro nos mudamos de SQL a MongoDB, el resto de la App nunca se enterará, solo la reescritura de este apartado.

#### 🛣️ `routes/`
Es el índice del mapa de navegación del servidor de interfaces. Por cada gran entidad (`profiles.routes.js`, `links.routes.js`), se declaran las URLs públicas. Define qué verbo HTTP (POST, PATCH, GET) enlazará el puente de las peticiones hacia el controlador específico de dicho dominio. 

#### 🎥 `upload/`
La ubicación destino en estado crudo donde librerías (como Multer) transaccionan sus intercepciones binarias y aterrizan físicamente los archivos subidos por primera vez (como avatares antes de someterse a compresión o filtros posteriores).

#### 🛠️ `utils/`
Módulo de reciclaje e inyección huérfana. Toda función que no concierne directamente a manipular una u otra vista pero que es universal va aquí: encriptadores asíncronos de contraseñas de bcrypt, adaptadores, formateadores de texto en fechas, lógicas para la extracción de metadatos, o inyecciones de Mail (Nodemailer).
