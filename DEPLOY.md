# Guía de Despliegue - AlgoGuardian MVP

Esta guía detalla los pasos para desplegar AlgoGuardian en internet.

## 1. Requisitos Previos
*   Tener el código subido a un repositorio de **GitHub**.
*   Cuentas en los servicios de hosting recomendados (o similares):
    *   **Backend + Base de Datos**: [Railway](https://railway.app/) (Recomendado por simplicidad) o [Render](https://render.com/).
    *   **Frontend**: [Vercel](https://vercel.com/) o [Netlify](https://www.netlify.com/).

---

## 2. Base de Datos y Backend (Railway)

Recomiendo Railway porque permite desplegar Backend y PostgreSQL en el mismo proyecto muy fácilmente.

1.  **Crear Proyecto**: En Railway, "New Project" > "Provision PostgreSQL".
2.  **Conectar GitHub**: Añade un servicio "GitHub Repo" y selecciona tu repositorio `algoguardian`.
3.  **Configurar Directorio**:
    *   Como es un monorepo (frontend y backend juntos), debes configurar el servicio del backend para que use la carpeta correcta.
    *   En *Settings* > *Root Directory*, pon: `backend`.
4.  **Variables de Entorno (Variables)**:
    *   `DATABASE_URL`: Railway la pone automáticamente si están en el mismo proyecto. Si no, copia la "Connection URL" de PostgreSQL.
    *   `PORT`: `3000` (o deja que Railway asigne uno, pero asegúrate de que el código use `process.env.PORT`).
    *   `JWT_SECRET`: Genera una cadena aleatoria larga.
    *   `FRONTEND_URL`: La URL que te dará Vercel en el siguiente paso (ej: `https://algoguardian.vercel.app`). *Por ahora puedes poner `*` para probar, pero cámbialo luego por seguridad.*
5.  **Comando de Inicio (Start Command)**:
    *   `npm run start` (Asegúrate de que en `backend/package.json` el script `start` sea `node dist/server.js` o similar tras el build).
    *   **Importante**: Para que la base de datos se actualice, puedes añadir un comando de build personalizado o ejecutar `npx prisma migrate deploy` antes de iniciar.
    *   Comando Build sugerido: `npm install && npx prisma generate && npm run build`

---

## 3. Frontend (Vercel)

1.  **Importar Proyecto**: En Vercel, "Add New..." > "Project" > Importa tu repositorio de GitHub.
2.  **Configurar Framework**: Vercel detectará Vite automáticamente.
3.  **Configurar Directorio Raíz (Root Directory)**:
    *   Edita y selecciona la carpeta raíz del proyecto (donde está el `package.json` del frontend, que parece ser la raíz `algoguardian (1)` o `.`). Si el `package.json` del frontend está en la raíz, déjalo así.
4.  **Variables de Entorno**:
    *   `VITE_API_URL`: La URL de tu backend en Railway (ej: `https://algoguardian-backend-production.up.railway.app/api`). **Importante**: Añade `/api` al final si tus rutas empiezan así.
5.  **Desplegar**: Haz clic en "Deploy".

---

## 4. Finalización y Verificación

1.  **Actualizar CORS en Backend**:
    *   Una vez tengas la URL final del frontend (ej: `https://algoguardian.vercel.app`), vuelve a Railway > Variables y actualiza `FRONTEND_URL` con ese valor exacto.
    *   Redespliega el backend.

2.  **Base de Datos (Migraciones)**:
    *   Si usas Railway, puedes abrir la consola interactiva del servicio backend y ejecutar:
        ```bash
        npx prisma migrate deploy
        ```
    *   O asegurarte de que este comando se ejecute en el proceso de build.

3.  **Usuarios Iniciales (Seed)**:
    *   Para crear los usuarios Admin/Free/Premium iniciales en producción, puedes ejecutar el script de seed desde la consola de Railway:
        ```bash
        npx ts-node src/scripts/seedUsers.ts
        ```
    *   (Asegúrate de que `ts-node` esté disponible o compila el script y ejecútalo con `node`).

## Resumen de Variables

| Variable | Dónde | Valor Ejemplo |
| :--- | :--- | :--- |
| `DATABASE_URL` | Backend (Railway) | `postgresql://user:pass@host:port/db` |
| `JWT_SECRET` | Backend (Railway) | `super-secret-key-123` |
| `FRONTEND_URL` | Backend (Railway) | `https://algoguardian.vercel.app` |
| `VITE_API_URL` | Frontend (Vercel) | `https://backend-app.railway.app/api` |
