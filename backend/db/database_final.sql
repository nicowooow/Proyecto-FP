-- =====================================================
-- BASE DE DATOS: yourtree
-- =====================================================
-- create database yourtree;
-- drop database yourtree;

-- =====================================================
-- TABLA: roles
-- =====================================================
create table roles (
    id SERIAL,
    name VARCHAR(30) not null unique,
    description TEXT,
    primary key (id)
);

-- =====================================================
-- TABLA: payment_plans
-- =====================================================
create table payment_plans (
    id SERIAL,
    name VARCHAR(15) not null,
    price_month DECIMAL(5, 2) not null,
    price_year DECIMAL(5, 2) not null,
    primary key (id),
    unique (name)
);

-- =====================================================
-- TABLA: users
-- =====================================================
create table users (
    id SERIAL,
    username VARCHAR(60) not null,
    email VARCHAR(255) not null,
    password_hash VARCHAR(255) not null,
    status VARCHAR(20) default 'pending' check (status in ('active', 'inactive', 'banned', 'pending')),
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
-- ==================================================
CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    refresh_token TEXT NOT NULL UNIQUE,
    user_id INT NOT NULL,
    token_version INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_refresh_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- TABLA: profiles
-- =====================================================
create table profiles (
    id SERIAL,
    user_id INT not null,
    plan_id INT not null,
    first_name VARCHAR(50) not null,
    last_name VARCHAR(50),
    birth_date DATE check (birth_date >= '1900-01-01' AND birth_date <= CURRENT_DATE),
    phone VARCHAR(25),
    recovery_email VARCHAR(255),
    bio TEXT,
    image_url VARCHAR(1024),
    theme VARCHAR(10) default 'light' check (theme in ('dark','light')),
    is_monthly_plan BOOLEAN,
    is_public BOOLEAN default true,
    created_at TIMESTAMP default CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    primary key (id),
    unique (user_id),
    constraint fk_profiles_user_id foreign key (user_id) references users (id) on delete cascade,
    constraint fk_profiles_plan_id foreign key (plan_id) references payment_plans (id)
);
CREATE INDEX idx_profiles_user_id on profiles (user_id);
CREATE INDEX idx_profiles_plan_id on profiles (plan_id);

-- =====================================================
-- TABLA: categories
-- =====================================================
create table categories (
    id SERIAL,
    name VARCHAR(50) not null,
    theme VARCHAR(30) not null,
    primary key (id),
    unique (name)
);

-- =====================================================
-- TABLA: links
-- =====================================================
create table links (
    id SERIAL,
    profile_id INT not null,
    title VARCHAR(100),
    url TEXT not null,
    position INT not null,
    is_visible BOOLEAN default true,
    primary key (id),
    constraint fk_links_profile_id foreign key (profile_id) references profiles (id) on delete cascade
);
CREATE INDEX idx_links_profile_id on links (profile_id);

-- =====================================================
-- TABLA: forums
-- =====================================================
create table forums (
    id SERIAL,
    profile_id INT not null,
    title VARCHAR(150),
    description TEXT not null,
    is_sensitive BOOLEAN default FALSE,
    is_public BOOLEAN default true,
    status varchar(20) default 'active' check (status in ('active', 'hidden', 'deleted')),
    likes INT default 0,
    shares INT default 0,
    created_at TIMESTAMP default CURRENT_TIMESTAMP,
    primary key (id),
    constraint fk_forums_profile_id foreign key (profile_id) references profiles (id) on delete cascade
);
CREATE INDEX idx_forums_profile_id on forums (profile_id);

-- =====================================================
-- TABLA: forum_comments
-- =====================================================
create table forum_comments (
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
CREATE INDEX idx_forum_comments_forum_id on forum_comments (forum_id);
CREATE INDEX idx_forum_comments_profile_id on forum_comments (profile_id);
