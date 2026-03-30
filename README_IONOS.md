# Guía de Despliegue en IONOS tras subida FTP

Has generado con éxito la versión de producción de **TaskPro Manager**. Sigue estos pasos para desplegarla en tu hosting de IONOS:

### 1. Preparar los Archivos
La carpeta `dist/` contiene todo lo necesario para que la aplicación funcione.
- Entra en la carpeta `dist/` de este proyecto.
- Verás archivos como `index.html`, una carpeta `assets/` y el archivo `.htaccess` que he configurado para ti.

### 2. Subida por FTP
1. Usa un cliente FTP (como FileZilla) o el administrador de archivos de IONOS.
2. Conéctate a tu servidor de IONOS.
3. Sube **todo el contenido** de la carpeta `dist/` a la carpeta raíz de tu dominio (normalmente `/clickandbuilds/NombreDeTuProyecto` o directamente en la carpeta asignada al dominio).

### 3. Configuración de la Base de Datos
Como IONOS utiliza MySQL/MariaDB, debes configurar la base de datos para que funcione con el esquema "Documental" que solicitaste:
1. Accede a tu panel de IONOS -> **Bases de Datos MySQL**.
2. Crea una nueva base de datos y anota el nombre, usuario y contraseña.
3. Abre **phpMyAdmin**.
4. Importa o ejecuta el contenido de nuestro archivo `database/schema.sql`.
   - *Nota: Asegúrate de que tu aplicación esté configurada para conectar a esta base de datos si tienes un backend (actualmente la app usa IndexedDB localmente, pero el script SQL está listo para cuando implementes el servidor).*

### 4. Archivo .htaccess (Importante)
He incluido automáticamente un archivo `.htaccess` en la carpeta `dist/`. Este archivo es **crítico** en IONOS para que:
- Las rutas de React (como `/projects`, `/calendar`) funcionen sin dar error 404 al recargar la página.
- El servidor Apache de IONOS sepa que debe redirigir todas las peticiones al `index.html`.

### 5. Verificación
Una vez subidos los archivos, accede a tu dominio. Deberías ver la pantalla de login (Usuario: `benpay` / Pass: `Traducete1!`).

---
**¡Todo listo para producción!**
