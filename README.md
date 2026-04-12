# 🌳 YourTree

**Tu link-in-bio personal y plataforma para compartir enlaces y debatir**

[![Demo](https://img.shields.io/badge/Demo-Online-brightgreen)](https://demo.treedlink.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**YourTree** es una aplicación web que permite a los usuarios crear **perfiles públicos** (árboles de enlaces) para compartir sus redes sociales, webs y recursos favoritos de forma sencilla y visual. Además, incluye un sistema de **foros** para debatir temas de interés.

Es mi **Proyecto Fin de Grado** del Ciclo Superior de Desarrollo de Aplicaciones Web (DAW) – Curso 2025-2026.

## ✨ Características principales

- Creación de perfiles públicos tipo Linktree ("YourTree")
- Página de "Recent Pages" con los árboles más nuevos
- Sistema de foros con comentarios y modales
- Autenticación segura con JWT
- Subida de imágenes (perfiles, etc.)
- Diseño responsivo (mobile-first)
- Despliegue con Docker + Docker Compose
- Backend limpio con arquitectura por capas (controllers, repository, models...)

**Demo en vivo:** [https://demo.treedlink.com](https://demo.treedlink.com)

## 🖼️ Capturas de pantalla

*(Aquí vas a pegar 4-5 imágenes: homepage, crear árbol, Recent_Pages, foro, perfil de usuario. Súbelas a la carpeta /docs o directamente al repo y pon el enlace con markdown)*

![Homepage](https://github.com/nicowooow/Proyecto-FP/blob/main/screenshots/home.png)
![Recent Pages](https://github.com/nicowooow/Proyecto-FP/blob/main/screenshots/recent.png)

## 🛠️ Tecnologías utilizadas

### Frontend (React + Vite)
- React 18
- Vite (build tool rápido)
- Tailwind CSS (estilos) ← **pendiente de mejorar**
- pnpm (gestor de paquetes recomendado)
- ESLint + configuración moderna

### Backend (Node.js + Express)
- Node.js + Express
- PostgreSQL (base de datos)
- JWT para autenticación
- bcrypt (hash de contraseñas)
- Multer (subida de archivos)
- Nodemailer (envío de emails)
- Arquitectura por capas (repository pattern)

### DevOps
- Docker + Docker Compose (todo se levanta con un comando)
- Nginx (en frontend para producción)

## 🚀 Instalación y ejecución rápida

### Opción recomendada: Docker Compose (la más fácil)

```bash
git clone https://github.com/nicowooow/Proyecto-FP.git
cd Proyecto-FP
docker-compose up --build