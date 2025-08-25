# 🏫 CoE Backend – Plataforma de Capacitaciones

Backend desarrollado en **NestJS** para la plataforma de capacitaciones del Centro de Excelencia (CoE).  
Permite a los colaboradores subir, consultar y gestionar capacitaciones, con **insignias automáticas 🏅** al completar cursos.

---

## 🚀 Tecnologías utilizadas
- **NestJS** (Node.js framework)  
- **MongoDB Atlas** (base de datos en la nube)  
- **Mongoose** (ODM para MongoDB)  
- **JWT Authentication** (con access y refresh tokens)  
- **MinIO / S3** (almacenamiento de archivos)  
- **Brevo (SMTP)** (notificaciones por correo)  
- **Docker Compose** (para MinIO local)  

---

## ⚙️ Funcionalidades principales
- 👤 **Gestión de usuarios** (registro, login, roles: admin, instructor, learner).  
- 🔐 **Autenticación JWT** (tokens de acceso y refresh).  
- 📚 **Gestión de cursos y capítulos** (crear, listar, publicar).  
- 📈 **Progreso del usuario** (seguimiento de capítulos completados).  
- 🏅 **Insignias automáticas** al completar cursos.  
- 📩 **Notificaciones por correo** cuando se publican cursos.  
- ☁️ **Almacenamiento de archivos** (PDF, videos, guías).  

---

## 🛠️ Requisitos
- Node.js 18+  
- MongoDB Atlas (o local)  
- Cuenta en Brevo (para correos)  
- Docker (si usas MinIO local)  

---

## 🔧 Instalación y ejecución local

```bash
# 1. Clonar el repo
git clone https://github.com/hinca100/coe-backend.git
cd coe-backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Ejecutar en modo desarrollo
npm run start:dev