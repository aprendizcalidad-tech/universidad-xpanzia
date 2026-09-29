# Universidad Xpanzia Group

Proyecto COMPLETO e independiente. Incluye `web/config.js`, `web/demo.js`, el logo original, los certificados y todos los archivos de Apps Script. No es un parche para el campus anterior.

1. Extrae el ZIP en una carpeta NUEVA.
2. Abre en Visual Studio Code la carpeta `xpanzia-campus`, donde están `web`, `google-apps-script` y `.github`.
3. Sigue `INSTALACION-XPANZIA.md` en orden. Crearás un proyecto nuevo de Apps Script y un repositorio nuevo.
4. El archivo `web/config.js` tiene `demo: false` y la dirección de Apps Script vacía. El campus mostrará que falta conectar hasta que pegues la nueva URL `/exec`. Esto es intencional.

No reemplaces los archivos de la universidad anterior. No copies sus propiedades SPREADSHEET_ID, CERTIFICATE_FOLDER_ID o CERTIFICATE_PREMIUM_TEMPLATE_ID: la instalación genera recursos nuevos.

El logo proporcionado se usa sin alterar sus proporciones. El diploma lleva el mismo logo como firma institucional. Esto es una imagen de identidad corporativa, no una firma digital criptográfica.

Incluye un curso de ejemplo de gestión documental. Revisa o sustituye sus contenidos y evaluación desde Administración antes de abrir formación real. La copia no migra estudiantes, expedientes ni certificados del campus anterior.

Para ver el diseño sin conectar Google, cambia temporalmente `demo: false` a `demo: true` y abre `web/index.html` con Live Server. Usa solamente datos ficticios. Regresa a `false` para operar con Google.
