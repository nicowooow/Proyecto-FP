-- =====================================================
-- BASE DE DATOS: TreedLink
-- =====================================================
-- una version que en la que hay cambios en casi todas la tablas.
-- sus nombres tanto tabla y atributos
-- =====================================================
-- create database TreedLink;
-- drop database TreedLink;
-- =====================================================
-- TABLA: roles
-- esta tabla contiene los roles que tendran los usuarios
-- =====================================================
-- id		 				: id del rol.
-- name						: el nombre del rol ( admin / user ).
-- description				: descripcion del rol.
-- =====================================================
create table
    roles (
        id SERIAL,
        name VARCHAR(30) not null unique,
        description TEXT,
        primary key (id)
    );

-- =====================================================
-- TABLA: payment_plans
-- esta tabla contiene los planes de pago de la web.
-- =====================================================
-- id		 				: id del plan de pago.
-- name						: nombre del plan de pago.
-- price_month				: precio mensual del plan de pago.
-- price_year				: precio anual del plan de pago.
-- =====================================================
create table
    payment_plans (
        id SERIAL,
        name VARCHAR(15) not null,
        price_month DECIMAL(5, 2) not null,
        price_year DECIMAL(5, 2) not null,
        primary key (id),
        unique (name)
    );

-- =====================================================
-- TABLA: users
-- esta tabla es la que guarda los datos de inicio de sesion del usuario nuevo.
-- =====================================================
-- Id		 				: identidicador del usuario.
-- username					: nombre de usuario en la web.
-- email					: email de acceso a la web.
-- password_hash			: contraseña hasheada para el incio de sesion.
-- created_at				: fecha de creacion de la cuenta.
-- last_login_at			: ultima fecha de sesion del usaurio.
-- role_id					: que tipo de rol tiene el usuario, por defecto es 2 -> user
-- token_version			: indica la version del token que tiene el usuario
-- =====================================================
create table
    users (
        id SERIAL,
        username VARCHAR(60) not null,
        email VARCHAR(255) not null,
        password_hash VARCHAR(255) not null,
        status VARCHAR(20) default 'pending' check (
            status in ('active', 'inactive', 'banned', 'pending')
        ),
        created_at TIMESTAMP default CURRENT_TIMESTAMP,
        last_login_at TIMESTAMP,
        role_id INT default 2 not null,
        verify_code VARCHAR(7) default null,
        primary key (id),
        unique (username),
        unique (email),
        constraint fk_users_role_id foreign key (role_id) references roles (id)
    );

-- ==================================================
-- TABLA: token
-- contiene informacion del refresh token
-- ==================================================
-- id		 				: id del token.
-- refresh_token            : valor del refresh token.
-- user_id                  : id el usuario.
-- token_version            : version del token usado.
-- created_at               : fecha de creación del token.
-- expires_at               : fecha de expiración del token.
-- revoked                  : si el token es usable o no.
-- ==================================================
CREATE TABLE
    token (
        id SERIAL PRIMARY KEY,
        refresh_token TEXT NOT NULL UNIQUE,
        user_id INT NOT NULL,
        token_version INT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        revoked BOOLEAN NOT NULL DEFAULT FALSE,
        CONSTRAINT fk_refresh_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

-- =====================================================
-- TABLA: profiles
-- esta tabla contiene los datos del usaurio.
-- =====================================================
-- id		 				: id del perfil.
-- user_id					: id que hace referencia al que esta en la tabla de users ( fk_profiles_user_id ).
-- plan_id					: id que hace referencia al que esta en la tabla de payment_plans ( fk_profiles_plan_id ).
-- first_name				: el primer nombre del usuario.
-- last_name				: el apellido(s) del usuario el cual puede no tener ningun valor.
-- birth_year				: año de nacimiento del usuario el cual nos podra ver si tiene acceso o no a ciertas partes de la web.
-- phone					: numero de telefono del usuario , por si necesita un codigo de acceso para hacer cambios.
-- recovery_email			: correo del usuario, por si necesita recuperar su cuenta o hacer cambios en su cuenta.
-- bio						: una biografia que describa el usuario de si mismo o lo que guste poner.
-- image_url				: enlace de la imagen externa.
-- theme                    : el tema que esocja el usuario (claro u oscuro)
-- type_theme               : tipo de tema el uno es animado -> con gradientes, el 2 simple -> con colores solidos 
-- is_monthly_plan 			: se define el plan que tiene. true = mensual, false = anual, null = gratis.
-- is_public 				: indica si es público (TRUE) o privado (FALSE).
-- created_at				: fecha de creacion del perfil.
-- updated_at				: ultima fecha de actualizacion del perfil.
-- =====================================================
create table
    profiles (
        id SERIAL,
        user_id INT not null,
        plan_id INT not null,
        first_name VARCHAR(50) not null,
        last_name VARCHAR(50),
        birth_date DATE check (
            birth_date >= '1900-01-01'
            AND birth_date <= CURRENT_DATE
        ),
        phone VARCHAR(25),
        recovery_email VARCHAR(255),
        bio TEXT,
        image_url VARCHAR(1024),
        theme VARCHAR(10) default 'light' check (theme in ('dark', 'light')),
        is_monthly_plan BOOLEAN,
        is_public BOOLEAN default true,
        created_at TIMESTAMP default CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        primary key (id),
        unique (user_id),
        constraint fk_profiles_user_id foreign key (user_id) references users (id) on delete cascade,
        constraint fk_profiles_plan_id foreign key (plan_id) references payment_plans (id)
    );

-- =====================================================
-- INDEX : idx_profiles_user_id -> Permite buscar el perfil de usuario por su user_id de forma rápida
-- INDEX : idx_profiles_plan_id -> Facilita la consulta de perfiles por tipo de plan de pago 
-- =====================================================
CREATE INDEX idx_profiles_user_id on profiles (user_id);

CREATE INDEX idx_profiles_plan_id on profiles (plan_id);

-- =====================================================
-- TABLA: follows
-- tabla N:M donde se guardan los datos de los usuarios que se siguen 
-- =====================================================
-- follower_profile_id		: id del perfil que sigue
-- followed_profile_id		: id del perfil que es seguido
-- created_at				: fecha de cuando empezo a seguile.
-- " constraint -> chk_follows_no_self " nos asegura que el los id de los perfiles sean distintos, para que no se puedan autoseguir
-- =====================================================
create table
    follows (
        follower_profile_id INT not null,
        followed_profile_id INT not null,
        created_at TIMESTAMP default CURRENT_TIMESTAMP,
        primary key (follower_profile_id, followed_profile_id),
        constraint fk_follows_follower_profile_id foreign key (follower_profile_id) references profiles (id) on delete cascade,
        constraint fk_follows_followed_profile_id foreign key (followed_profile_id) references profiles (id) on delete cascade,
        constraint chk_follows_no_self check (follower_profile_id <> followed_profile_id)
    );

-- =====================================================
-- INDEX : idx_follows_follower -> Permite consultar de forma eficiente a quién sigue cada usuari
-- INDEX : idx_follows_followed -> Permite consultar fácilmente quién sigue a un usuario para la parte de seguidores
-- =====================================================
create index idx_follows_follower on follows (follower_profile_id);

create index idx_follows_followed on follows (followed_profile_id);

-- =====================================================
-- TABLA: blocks
-- tabla N:M donde se guardan los datos de los usuarios que se bloquean
-- =====================================================
-- blocker_profile_id		: id del perfil que bloquea
-- blocked_profile_id		: id del perfil que es bloqueado
-- created_at				: fecha de cuando empezo a seguile.
-- " constraint -> chk_blocks_no_self " nos asegura que el los id de los perfiles sean distintos, para que no se puedan autobloquear
-- =====================================================
create table
    blocks (
        blocker_profile_id INT not null,
        blocked_profile_id INT not null,
        created_at TIMESTAMP default CURRENT_TIMESTAMP,
        primary key (blocker_profile_id, blocked_profile_id),
        constraint fk_blocks_blocker_profile_id foreign key (blocker_profile_id) references profiles (id) on delete cascade,
        constraint fk_blocks_blocked_profile_id foreign key (blocked_profile_id) references profiles (id) on delete cascade,
        constraint chk_blocks_no_self check (blocker_profile_id <> blocked_profile_id)
    );

-- =====================================================
-- INDEX : idx_blocks_blocker -> Permite consultar a quién ha bloqueado cada perfil de forma rápida
-- INDEX : idx_blocks_blocked -> Permite consultar quién ha bloqueado a un perfil fácilmente
-- =====================================================
create index idx_blocks_blocker on blocks (blocker_profile_id);

create index idx_blocks_blocked on blocks (blocked_profile_id);

-- =====================================================
-- TABLA: conversations
-- tabla que contendra el chat individual entre 2 perfiles o mas , lo cual se vera mas a futuro
-- =====================================================
-- id						: id de la conversaion.
-- created_at				: fecha en la que se inicio la conversacion.
-- =====================================================
create table
    conversations (
        id SERIAL,
        created_at TIMESTAMP default CURRENT_TIMESTAMP,
        primary key (id)
    );

-- =====================================================
-- INDEX : idx_conversations_id -> Permite buscar rápidamente una conversación por su id (útil para joins o búsquedas directas)
-- =====================================================
CREATE INDEX idx_conversations_id ON conversations (id);

-- =====================================================
-- TABLA: conversation_participants
-- tabla que contendra los perfiles en la conversacion
-- =====================================================
-- conversation_id			: id que hace referencia a la conversacion
-- profile_id				: id que hace referencia al perfil que esta en dicha conversacion
-- joined_at				: fecha en la que se unieron a la conversacion
-- =====================================================
CREATE TABLE
    conversation_participants (
        conversation_id INT not null,
        profile_id INT not null,
        joined_at TIMESTAMP default CURRENT_TIMESTAMP,
        primary key (conversation_id, profile_id),
        constraint fk_conv_part_conversation_id foreign key (conversation_id) references conversations (id) on delete cascade,
        constraint fk_conv_part_profile_id foreign key (profile_id) references profiles (id) on delete cascade
    );

-- =====================================================
-- INDEX : idx_conversation_participants_conversation_id -> Facilita listar los participantes de una conversación concreta
-- =====================================================
CREATE INDEX idx_conversation_participants_conversation_id ON conversation_participants (conversation_id);

-- =====================================================
-- TABLA: messages
-- tabla que contendra los mensajes, los cuales seran individuales no grupales
-- =====================================================
-- id		 				: id del mensaje.
-- sender_profile_id		: id que hace referencia al perfil que envia el mensaje ( fk_messages_sender_profile_id ).
-- conversation_id			: id que hace referencia a la conversacion a la que pertenece ( fk_messages_conversation_id ).
-- content					: el contenido del mensaje
-- sent_at					: fecha en la cual se envio el mensaje.
-- is_read					: si el mensaje fue leido o no.
-- =====================================================
create table
    messages (
        id SERIAL,
        sender_profile_id INT not null,
        conversation_id INT not null,
        content TEXT not null,
        sent_at TIMESTAMP default CURRENT_TIMESTAMP,
        is_read BOOLEAN default false,
        primary key (id),
        constraint fk_messages_sender_profile_id foreign key (sender_profile_id) references profiles (id) on delete set null,
        constraint fk_messages_conversation_id foreign key (conversation_id) references conversations (id) on delete cascade
    );

-- =====================================================
-- INDEX : idx_messages_conversation_id -> Permite recuperar rápidamente los mensajes de cada conversación
-- INDEX : idx_messages_sender_profile_id -> Facilita buscar los mensajes enviados por cada perfil
-- =====================================================
CREATE INDEX idx_messages_conversation_id ON messages (conversation_id);

CREATE INDEX idx_messages_sender_profile_id ON messages (sender_profile_id);

-- =====================================================
-- TABLA: payments
-- esta tabla almacenara los datos de pago
-- =====================================================
-- id		 				: id del pago.
-- profile_id				: id que hace referencia al que esta en la tabla de profiles ( fk_payments_profile_id ).
-- plan_id					: id que hace referencia al que esta en la tabla de payment plans ( fk_payments_plan_id ).
-- paid_at					: fecha en la cual se realizo el pago.
-- amount					: cantidad que pago el usuario.
-- status					: estado en el que se encuentra el pago.
-- payment_method			: metodo de pago utilizado.
-- reference_code			: codigo de referencia que da la entidad.
-- =====================================================
create table
    payments (
        id SERIAL,
        profile_id INT not null,
        plan_id INT not null,
        paid_at TIMESTAMP default CURRENT_TIMESTAMP,
        amount DECIMAL(5, 2) not null,
        status VARCHAR(12) default 'pending' check (
            status in ('pending', 'completed', 'failed', 'cancelled')
        ),
        payment_method VARCHAR(20) not null,
        reference_code varchar(64),
        primary key (id),
        constraint fk_payments_profile_id foreign key (profile_id) references profiles (id) on delete cascade,
        constraint fk_payments_plan_id foreign key (plan_id) references payment_plans (id)
    );

-- =====================================================
-- INDEX : idx_payments_profile_id -> Acelera la obtención del historial de pagos de un perfil
-- INDEX : idx_payments_plan_id -> Permite consultar rápidamente los pagos asociados a cada plan
-- =====================================================
CREATE INDEX idx_payments_profile_id on payments (profile_id);

CREATE INDEX idx_payments_plan_id on payments (plan_id);

-- =====================================================
-- TABLA: addresses
-- esta tabla contiene la direccion de facturacion del usuario
-- =====================================================
-- id		 				: id de la direccion.
-- profile_id				: id que hace referencia al que esta en la tabla de profiles ( fk_addresses_profile_id ).
-- street_number			: numero del domicilio del usuario.
-- floor					: piso del usuario.
-- zip_code					: codigo postal de usuario.
-- street_type				: tipo de calle en la que se encuentra.
-- street_name				: nombre de la calle.
-- country					: pais de donde pertenece el usuario.
-- city						: ciudad del usuario
-- province					: provincia del usuario.
-- =====================================================
create table
    addresses (
        id SERIAL,
        profile_id INT not null,
        street_number INT not null,
        floor VARCHAR(2),
        zip_code VARCHAR(10) not null,
        street_type VARCHAR(20),
        street_name VARCHAR(64) not null,
        country VARCHAR(60) not null,
        city VARCHAR(50),
        province VARCHAR(50),
        primary key (id),
        constraint fk_addresses_profile_id foreign key (profile_id) references profiles (id) on delete cascade
    );

-- =====================================================
-- INDEX : idx_addresses_profile_id -> Permite buscar la dirección de un perfil sin demora 
-- =====================================================
CREATE INDEX idx_addresses_profile_id on addresses (profile_id);

-- =====================================================
-- TABLA: categories
-- tabla que almacenara las categorias que tenemos tanto en forums o posts
-- =====================================================
-- id		 				: id de la categoria.
-- name 					: nombre de la categoria, es unico.
-- theme                    : theme general al que va dirigida categoria
-- =====================================================
create table
    categories (
        id SERIAL,
        name VARCHAR(50) not null,
        theme VARCHAR(30) not null,
        primary key (id),
        unique (name)
    );

-- =====================================================
-- TABLA: links
-- esta tabla contiene los links que apareceran en el el apartado de TreedLink
-- =====================================================
-- id		 				: id del enlace a compartir.
-- profile_id				: id que hace referencia al que esta en la tabla de profiles ( fk_links_profile_id ).
-- title					: titulo del enlace a compartir.
-- url						: el enlace del contenido a compartir.
-- position					: el orden en el que apareceran los enlaces.
-- is_visible				: si el enlace es visible o no .
-- =====================================================
create table
    links (
        id SERIAL,
        profile_id INT not null,
        title VARCHAR(100),
        url TEXT not null,
        url_image TEXT not null,
        position INT default '' not null,
        is_visible BOOLEAN default true,
        primary key (id),
        constraint fk_links_profile_id foreign key (profile_id) references profiles (id) on delete cascade
    );

-- =====================================================
-- INDEX : idx_links_profile_id -> Permite buscar los links de cada perfil de forma rápida 
-- =====================================================
CREATE INDEX idx_links_profile_id on links (profile_id);

-- =====================================================
-- TABLA: link_stats
-- tabla que almacena estadísticas de visualización de estilos públicos por usuarios
-- =====================================================
-- id		 				: id del la estadistica del enlace.
-- link_id					: id que hace referencia al que esta en la tabla de liks ( fk_link_stats_link_id ).
-- profile_id				: id que hace referencia al que esta en la tabla de profiles puede ser null porque puenden entrar desde anonimo ( fk_link_stats_profile_id ).
-- viewed_at				: vistar realizadas en que mes y año.
-- user_agent				: navegador/dispositivo por el cual se ve.
-- ip_address				: auditoria de la IP.
-- referrer					: si es que proviene de otra pagina web.
-- =====================================================
CREATE TABLE
    link_stats (
        id SERIAL,
        link_id INT NOT NULL,
        profile_id INT,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_agent VARCHAR(255),
        ip_address VARCHAR(45),
        referrer VARCHAR(255),
        primary key (id),
        constraint fk_link_stats_link_id foreign key (link_id) references links (id) on delete cascade,
        constraint fk_link_stats_profile_id foreign key (profile_id) references profiles (id) on delete set null
    );

-- =====================================================
-- INDEX : idx_link_stats_link_id -> Facilita la consulta de estadísticas de cada enlace por su id
-- INDEX : idx_link_stats_profile_id -> Permite ver quién ha accedido a enlaces (visitantes registrados) 
-- =====================================================
CREATE INDEX idx_link_stats_link_id on link_stats (link_id);

CREATE INDEX idx_link_stats_profile_id on link_stats (profile_id);

-- =====================================================
-- TABLA: forums
-- tabla que contiene los datos del foro que creo el usuario
-- =====================================================
-- id		 				: id del foro.
-- profile_id				: id que hace referencia al que esta en la tabla de profiles ( fk_forums_profile_id ).
-- title					: titulo del foro.
-- description				: descripcion del foro.
-- is_sensitive				: si el contenido es sensible o no .
-- status					: si el estado del foro es activo, oculto o borrado
-- is_public 				: indica si es público (TRUE) o privado (FALSE).
-- likes					: cantidad de likes que tiene.
-- shares					: cantidad de veces que fue compartido.
-- created_at				: fecha de creacion del foro.
-- =====================================================
create table
    forums (
        id SERIAL,
        profile_id INT not null,
        title VARCHAR(150),
        description TEXT not null,
        is_sensitive BOOLEAN default FALSE,
        is_public BOOLEAN default true,
        status varchar(20) default 'active' check (status in ('active', 'hidden', 'deleted')), -- status					: si el estado del foro es activo, oculto o borrado
        likes INT default 0,
        shares INT default 0,
        created_at TIMESTAMP default CURRENT_TIMESTAMP,
        primary key (id),
        constraint fk_forums_profile_id foreign key (profile_id) references profiles (id) on delete cascade
    );

-- =====================================================
-- INDEX : idx_forums_profile_id -> Permite ver todos los foros creados por un perfil rápidamente 
-- =====================================================
CREATE INDEX idx_forums_profile_id on forums (profile_id);

-- =====================================================
-- TABLA: forum_images
-- tabla que contiene el post que crea el usuario, cada post tiene hasta un maximo de 5 imagenes
-- =====================================================
-- id		 				: id de la imagen del post.
-- forum_id					: id que hace referencia al que esta en la tabla de posts ( fk_post_images_post_id ).
-- image_url				: enlace de la imagen.
-- position					: posicion en la cual mostrar las imagenes.
-- =====================================================
create table
    forum_images (
        id SERIAL,
        forum_id INT not null,
        image_url VARCHAR(1024) not null,
        position INT check (position BETWEEN 1 AND 5),
        primary key (id),
        constraint fk_post_images_post_id foreign key (forum_id) references forums (id) on delete cascade
    );

-- =====================================================
-- INDEX : idx_forum_images_post_id -> Facilita la carga de imágenes de un foro específico 
-- =====================================================
CREATE INDEX idx_forum_images_post_id on forum_images (forum_id);

-- =====================================================
-- TABLA: forum_comments
-- tabla que contiene los datos de los comentarios del foro padre
-- =====================================================
-- id		 				: id del comentario dentro del foro.
-- forum_id					: id que hace referencia al que esta en la tabla de forums ( fk_forum_comments_forum_id ).
-- profile_id				: id que hace referencia al que esta en la tabla de profiles ( fk_forum_comments_profile_id ).
-- content					: contenido del comentario.
-- status					: si el estado del foro es activo, oculto o borrado
-- likes					: cantidad de likes que tiene el comentario.
-- shares					: cantidad de veces que fue compartido.
-- created_at				: fecha en la cual fue creado el comentario.
-- =====================================================
create table
    forum_comments (
        id SERIAL,
        forum_id INT not null,
        profile_id INT not null,
        content TEXT not null,
        status varchar(20) default 'active' check (status in ('active', 'hidden', 'deleted')),
        likes INT default 0,
        shares INT default 0,
        created_at TIMESTAMP default CURRENT_TIMESTAMP,
        primary key (id),
        constraint fk_forum_comments_forum_id foreign key (forum_id) references forums (id) on delete cascade,
        constraint fk_forum_comments_profile_id foreign key (profile_id) references profiles (id) on delete cascade
    );

-- =====================================================
-- INDEX : idx_forum_comments_forum_id -> Permite mostrar todos los comentarios de un foro de forma rápida
-- INDEX : idx_forum_comments_profile_id -> Facilita la consulta de comentarios hechos por cada perfil 
-- =====================================================
CREATE INDEX idx_forum_comments_forum_id on forum_comments (forum_id);

CREATE INDEX idx_forum_comments_profile_id on forum_comments (profile_id);

-- =====================================================
-- TABLA: forum_category
-- tabla N:M que vincula foros/posts con sus categorías
-- =====================================================
-- category_id 				: id que hace referencia al que esta en la tabla de categories ( fk_forum_category_forum_id ).
-- forum_id		 			: id que hace referencia al que esta en la tabla de forums ( fk_forum_category_category_id ).
-- =====================================================
create table
    forum_category (
        category_id INT,
        forum_id INT,
        constraint fk_forum_category_forum_id foreign key (forum_id) references forums (id) on delete cascade,
        constraint fk_forum_category_category_id foreign key (category_id) references categories (id),
        primary key (category_id, forum_id)
    );

-- =====================================================
-- INDEX : idx_forum_category_forum_id -> Permite obtener todas las categorías asignadas a un foro fácilmente 
-- =====================================================
CREATE INDEX idx_forum_category_forum_id on forum_category (forum_id);

-- =====================================================
-- TABLA: FORUM_STATS
-- tabla que almacena estadísticas de visualización de estilos públicos por usuarios
-- =====================================================
-- id						: id de la estadística de la visualización del foro.
-- forum_id 				: id que hace referencia al que está en la tabla de forums ( fk_forum_stats_forum_id ).
-- profile_id 				: id que hace referencia al que está en la tabla de profiles, puede ser NULL si el visitante es anónimo ( fk_forum_stats_profile_id ).
-- viewed_at 				: fecha y hora en que se realiza la visualización.
-- user_agent 				: navegador/dispositivo usado para ver el foro.
-- ip_address 				: dirección IP para auditoría.
-- referrer 				: si la visita proviene de otra página web.
-- =====================================================
CREATE TABLE
    forum_stats (
        id SERIAL,
        forum_id INT not null,
        profile_id INT,
        viewed_at TIMESTAMP default CURRENT_TIMESTAMP,
        user_agent VARCHAR(255),
        ip_address VARCHAR(45),
        referrer VARCHAR(255),
        primary key (id),
        constraint fk_forum_stats_forum_id foreign key (forum_id) references forums (id) on delete cascade,
        constraint fk_forum_stats_profile_id foreign key (profile_id) references profiles (id) on delete set null
    );

-- =====================================================
-- INDEX : idx_forum_stats_forum_id -> Permite consultar las visitas y métricas de un foro concreto rápidamente
-- INDEX : idx_forum_stats_profile_id -> Permite analizar el comportamiento de visualización por perfil en foros 
-- =====================================================
CREATE INDEX idx_forum_stats_forum_id on forum_stats (forum_id);

CREATE INDEX idx_forum_stats_profile_id on forum_stats (profile_id);

-- =====================================================
-- TABLA: posts
-- tabla que contienen los datos del post que creo el usuario
-- =====================================================
-- id		 				: id del post.
-- profile_id				: id que hace referencia al que esta en la tabla de profiles ( fk_posts_profile_id ).
-- description				: la descripcion del post que creo el usuario.
-- is_sensitive				: si el contenido es sensible o no.
-- status					: si el estado del foro es activo, oculto o borrado
-- is_public 				: indica si es público (TRUE) o privado (FALSE).
-- likes					: cantidad de likes que tiene el comentario.
-- shares					: cantidad de veces que fue compartido.
-- created_at				: fecha en la cual fue creado el post.
-- =====================================================
create table
    posts (
        id SERIAL,
        profile_id INT not null,
        description TEXT not null,
        is_sensitive BOOLEAN default FALSE,
        status varchar(20) default 'active' check (status in ('active', 'hidden', 'deleted')),
        likes INT default 0,
        is_public BOOLEAN default true,
        shares INT default 0,
        created_at TIMESTAMP default CURRENT_TIMESTAMP,
        primary key (id),
        constraint fk_posts_profile_id foreign key (profile_id) references profiles (id) on delete cascade
    );

-- =====================================================
-- INDEX : idx_posts_profile_id -> Permite buscar todos los posts publicados por un perfil de forma eficiente 
-- =====================================================
CREATE INDEX idx_posts_profile_id on posts (profile_id);

-- =====================================================
-- TABLA: post_images
-- tabla que contiene el post que crea el usuario, cada post tiene hasta un maximo de 5 imagenes
-- =====================================================
-- id		 				: id de la imagen del post.
-- post_id					: id que hace referencia al que esta en la tabla de posts ( fk_post_images_post_id ).
-- image_url				: enlace de la imagen.
-- position					: posicion en la cual mostrar las imagenes.
-- =====================================================
create table
    post_images (
        id SERIAL,
        post_id INT not null,
        image_url VARCHAR(1024) not null,
        position INT check (position BETWEEN 1 AND 5),
        primary key (id),
        constraint fk_post_images_post_id foreign key (post_id) references posts (id) on delete cascade
    );

-- =====================================================
-- INDEX : idx_post_images_post_id -> Facilita la carga de imágenes de un post específico 
-- =====================================================
CREATE INDEX idx_post_images_post_id on post_images (post_id);

-- =====================================================
-- TABLA: post_comments
-- tabla que contiene los comentarios del post padre
-- =====================================================
-- id		 				: id del comentario.
-- post_id					: id que hace referencia al que esta en la tabla de posts ( fk_post_comments_post_id ).
-- profile_id				: id que hace referencia al que esta en la tabla de profiles ( fk_post_comments_profile_id ).
-- content					: contenido del comentario.
-- status					: si el estado del foro es activo, oculto o borrado
-- likes					: cantidad de likes que tiene el comentario.
-- shares					: cantidad de veces que fue compartido.
-- created_at				: fecha en la cual fue creado el comentario.
-- =====================================================
create table
    post_comments (
        id SERIAL,
        post_id INT not null,
        profile_id INT not null,
        content TEXT not null,
        status varchar(20) default 'active' check (status in ('active', 'hidden', 'deleted')),
        likes INT default 0,
        shares INT default 0,
        created_at TIMESTAMP default CURRENT_TIMESTAMP,
        primary key (id),
        constraint fk_post_comments_post_id foreign key (post_id) references posts (id) on delete cascade,
        constraint fk_post_comments_profile_id foreign key (profile_id) references profiles (id) on delete cascade
    );

-- =====================================================
-- INDEX : idx_post_comments_post_id -> Permite mostrar rápidamente los comentarios de cada post
-- INDEX : idx_post_comments_profile_id -> Permite consultar los comentarios de cada usuario en los posts 
-- =====================================================
CREATE INDEX idx_post_comments_post_id on post_comments (post_id);

CREATE INDEX idx_post_comments_profile_id on post_comments (profile_id);

-- =====================================================
-- TABLA: post_category
-- tabla N:M que vincula foros/posts con sus categorías
-- =====================================================
-- category_id 				: id que hace referencia al que esta en la tabla de categories ( fk_post_category_post_id ).
-- post_id		 			: id que hace referencia al que esta en la tabla de posts ( fk_post_category_category_id ).
-- =====================================================
create table
    post_category (
        category_id INT,
        post_id INT,
        constraint fk_post_category_post_id foreign key (post_id) references posts (id) on delete cascade,
        constraint fk_post_category_category_id foreign key (category_id) references categories (id),
        primary key (category_id, post_id)
    );

-- =====================================================
-- INDEX : idx_post_category_post_id -> Permite buscar categorías asignadas a cada post de forma ágil 
-- =====================================================
CREATE INDEX idx_post_category_post_id on post_category (post_id);

-- =====================================================
-- TABLA: POST_STATS
-- tabla que almacena estadísticas de visualización de estilos públicos por usuarios
-- =====================================================
-- id 						: id de la estadística de la visualización del post.
-- post_id 					: id que hace referencia al que está en la tabla de posts ( fk_post_stats_post_id ).
-- profile_id 				: id que hace referencia al que está en la tabla de profiles, puede ser NULL si el visitante es anónimo ( fk_post_stats_profile_id ).
-- viewed_at 				: fecha y hora en que se realiza la visualización.
-- user_agent 				: navegador/dispositivo usado para ver el post.
-- ip_address 				: dirección IP para auditoría.
-- referrer 				: si la visita proviene de otra página web.
-- =====================================================
CREATE TABLE
    post_stats (
        id SERIAL,
        post_id INT NOT NULL,
        profile_id INT,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_agent VARCHAR(255),
        ip_address VARCHAR(45),
        referrer VARCHAR(255),
        primary key (id),
        constraint fk_post_stats_post_id foreign key (post_id) references posts (id) on delete cascade,
        constraint fk_post_stats_profile_id foreign key (profile_id) references profiles (id) on delete set null
    );

-- =====================================================
-- INDEX : idx_post_stats_post_id -> Permite consultar las estadísticas de visitas de cada post
-- INDEX : idx_post_stats_profile_id -> busca de forma mas rapida de buscar las stats de los posts mediante el id del perfil 
-- =====================================================
CREATE INDEX idx_post_stats_post_id on post_stats (post_id);

CREATE INDEX idx_post_stats_profile_id on post_stats (profile_id);

-- =====================================================
-- TABLA: styles
-- tabla que contiene los estilos públicos disponibles para secciones del sistema
-- =====================================================
-- id		 				: id del estilo.
-- style					: los estilos en formato json -> css.
-- =====================================================
create table
    styles (
        id SERIAL,
        title VARCHAR(64),
        style JSONB not null,
        primary key (id)
    );

-- =====================================================
-- TABLA: public_styles
-- tabla N:M que enlaza los perfiles con los estilos públicos
-- =====================================================
-- id		 				: id que hace referencia al que esta en la tabla de estilo ( fk_public_styles_profile_id ).
-- profile_id				: id que hace referencia al que esta en la tabla de profiles ( fk_public_styles_style_id ).
-- =====================================================
CREATE TABLE
    public_styles (
        profile_id INT not null,
        style_id INT not null,
        constraint fk_public_styles_profile_id foreign key (profile_id) references profiles (id) on delete cascade,
        constraint fk_public_styles_style_id foreign key (style_id) references styles (id) on delete cascade,
        primary key (profile_id, style_id)
    );

-- =====================================================
-- INDEX : idx_public_styles_profile_id -> Facilita la búsqueda de estilos públicos asignados a cada perfil
-- INDEX : idx_public_styles_style_id -> Permite consultar qué perfiles usan cada estilo público 
-- =====================================================
CREATE INDEX idx_public_styles_profile_id on public_styles (profile_id);

CREATE INDEX idx_public_styles_style_id on public_styles (style_id);

-- =====================================================
-- TABLA: PUBLIC_STYLE_STATS
-- tabla que almacena estadísticas de visualización de estilos públicos por usuarios
-- =====================================================
-- id : id de la estadística de la visualización del estilo público
-- profile_id : id que hace referencia al que está en la tabla de profiles, puede ser NULL si el visitante es anónimo ( fk_public_style_stats_style_id ).
-- style_id : id que hace referencia al que está en la tabla de styles (el estilo público visualizado) ( fk_public_style_stats_profile_id ).
-- viewed_at : fecha y hora en que se realiza la visualización
-- user_agent : navegador/dispositivo usado para ver el estilo
-- ip_address : dirección IP para auditoría
-- referrer : si la visita proviene de otra página web
-- =====================================================
CREATE TABLE
    public_style_stats (
        id SERIAL,
        style_id INT NOT NULL,
        profile_id INT,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_agent VARCHAR(255),
        ip_address VARCHAR(45),
        referrer VARCHAR(255),
        primary key (id),
        constraint fk_public_style_stats_style_id foreign key (style_id) references styles (id) on delete cascade,
        constraint fk_public_style_stats_profile_id foreign key (profile_id) references profiles (id) on delete set null
    );

-- =====================================================
-- INDEX : idx_public_style_stats_style_id -> Facilita el análisis de visitas y actividad sobre cada estilo público
-- INDEX : idx_public_style_stats_profile_id -> Permite analizar la actividad de estilos públicos por usuario 
-- =====================================================
CREATE INDEX idx_public_style_stats_style_id on public_style_stats (style_id);

CREATE INDEX idx_public_style_stats_profile_id on public_style_stats (profile_id);

-- =====================================================
-- TABLA: reports
-- tabla que contiene los reportes de un post, foro o uno de sus comentarios
-- =====================================================
-- id		 				: id del reporte.
-- profile_id				: id que hace referencia al que esta en la tabla de profiles ( fk_reports_profile_id ).
-- target_type				: de donde viene el reporte.
-- target_id				: guarda el id del elemento padre.
-- reason					: la razon del reporte
-- created_at				: fecha en la cual fue creado el reporte.
-- =====================================================
create table
    reports (
        id SERIAL,
        profile_id INT not null,
        target_type VARCHAR(20) check (
            target_type in ('forum', 'forum_comment', 'post', 'post_comment')
        ),
        target_id INT not null,
        reason TEXT not null,
        created_at TIMESTAMP default CURRENT_TIMESTAMP,
        primary key (id),
        constraint fk_reports_profile_id foreign key (profile_id) references profiles (id) on delete set null
    );

-- =====================================================
-- INDEX : idx_reports_profile_id -> Facilita la revisión de reportes hechos por cada perfil 
-- =====================================================
CREATE INDEX idx_reports_profile_id on reports (profile_id);

-- =====================================================
-- TABLA: report_authors
-- tabla N:M que vincula reportes con los perfiles que los han realizado
-- =====================================================
-- report_id				: id que hace referencia al que esta en la tabla de reporte ( fk_report_authors_report_id ).
-- profile_id				: id que hace referencia al que esta en la tabla de profiles ( fk_report_authors_profile_id ).
-- =====================================================
CREATE TABLE
    report_authors (
        report_id INT not null,
        profile_id INT not null,
        primary key (report_id, profile_id),
        constraint fk_report_authors_report_id foreign key (report_id) references reports (id),
        constraint fk_report_authors_profile_id foreign key (profile_id) references profiles (id) on delete set null
    );

-- =====================================================
-- INDEX : idx_report_authors_report_id -> Permite consultar los autores asociados a cada reporte
-- INDEX : idx_report_authors_profile_id -> Permite analizar los reportes en los que ha participado cada perfil 
-- =====================================================
CREATE INDEX idx_report_authors_report_id on report_authors (report_id);

CREATE INDEX idx_report_authors_profile_id on report_authors (profile_id);

-- =====================================================
-- DATOS DE PLAN DE PAGOS
-- =====================================================
insert into
    payment_plans (name, price_month, price_year)
values
    ('basic', 0.00, 0.00),
    ('standard', 5.99, 4.99),
    ('medium', 10.99, 9.99),
    ('advance', 23.99, 20.99);

-- =====================================================
-- DATOS DE LOS ROLES
-- =====================================================
insert into
    roles (name, description)
values
    ('admin', 'Usuario con permisos de administración'),
    ('user', 'Usuario estándar autenticado');

-- =====================================================
-- DATOS DE CATEGORIAS
-- =====================================================
-- Technology & Science
INSERT INTO
    categories (name, theme)
VALUES
    ('Technology', 'Technology & Science'),
    ('Science', 'Technology & Science'),
    ('Video Games', 'Technology & Science'),
    ('Computer Science', 'Technology & Science'),
    ('Robotics', 'Technology & Science'),
    ('Programming', 'Technology & Science');

-- Entertainment & Culture
INSERT INTO
    categories (name, theme)
VALUES
    ('Movies', 'Entertainment & Culture'),
    ('Music', 'Entertainment & Culture'),
    ('TV Series', 'Entertainment & Culture'),
    ('Art', 'Entertainment & Culture'),
    ('Photography', 'Entertainment & Culture'),
    ('Literature', 'Entertainment & Culture'),
    ('Humor', 'Entertainment & Culture');

-- Lifestyle & Society
INSERT INTO
    categories (name, theme)
VALUES
    ('Fashion', 'Lifestyle & Society'),
    ('Food', 'Lifestyle & Society'),
    ('Travel', 'Lifestyle & Society'),
    ('Health', 'Lifestyle & Society'),
    ('Fitness', 'Lifestyle & Society'),
    ('Pets', 'Lifestyle & Society'),
    ('DIY & Crafts', 'Lifestyle & Society');

-- Education & Training
INSERT INTO
    categories (name, theme)
VALUES
    ('Education', 'Education & Training'),
    ('Entrepreneurship', 'Education & Training'),
    ('Business', 'Education & Training'),
    ('Economy', 'Education & Training'),
    ('Personal Finance', 'Education & Training'),
    ('History', 'Education & Training');

-- News, Opinion & Society
INSERT INTO
    categories (name, theme)
VALUES
    ('News', 'News, Opinion & Society'),
    ('Politics', 'News, Opinion & Society'),
    ('Environment', 'News, Opinion & Society'),
    ('Psychology', 'News, Opinion & Society');

-- Other / Niche
INSERT INTO
    categories (name, theme)
VALUES
    ('Cars', 'Other / Niche'),
    ('Astrology', 'Other / Niche'),
    ('Sports', 'Other / Niche'),
    ('Animals', 'Other / Niche');