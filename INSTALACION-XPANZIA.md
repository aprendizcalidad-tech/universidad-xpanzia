# Instalación nueva de Xpanzia Group

Fecha de preparación: 29 de septiembre de 2026.

## 1. Extraer y abrir el proyecto

Extrae todo el ZIP. En Visual Studio Code selecciona Archivo > Abrir carpeta > `xpanzia-campus`.

Dentro de esa carpeta deben estar `web`, `google-apps-script`, `.github`, `tests` y estas instrucciones. La carpeta `.github` debe quedar en la raíz del repositorio, no dentro de otra carpeta. No inicialices Git en la carpeta padre del ZIP.

El proyecto incluye todos los archivos. No necesitas copiar config.js ni demo.js de la universidad anterior.

## 2. Crear un Apps Script nuevo

Entra en https://script.google.com/ con la cuenta que administrará los recursos y enviará los correos de Xpanzia. Selecciona Nuevo proyecto. Ponle el nombre `Universidad Xpanzia Group`.

En el editor:

| Archivo local | Qué hacer en Apps Script |
| --- | --- |
| `google-apps-script/Code.gs` | Reemplaza TODO el contenido de Código.gs. Puede conservar ese nombre. |
| `google-apps-script/Seed.gs` | Pulsa + junto a Archivos > Secuencia de comandos. Nómbralo Seed y pega todo el contenido. |
| `google-apps-script/Certificate.gs` | Crea otra secuencia de comandos llamada Certificate y pega TODO el contenido, incluida la imagen codificada. |
| `google-apps-script/appsscript.json` | En Configuración del proyecto activa Mostrar el archivo de manifiesto appsscript.json. Abre ese archivo y reemplaza todo su contenido por el archivo incluido. |

No añadas un segundo Code.gs si ya pegaste el código en Código.gs. No pegues etiquetas de Markdown ni los delimitadores de los bloques de código.

## 3. Definir administradores

En Configuración del proyecto > Propiedades de la secuencia de comandos > Añadir propiedad:

| Propiedad | Valor |
| --- | --- |
| `ADMIN_EMAILS` | Tu correo real y, si hay más administradores, sus correos separados por comas. |
| `ALLOWED_DOMAINS` | Opcional: dominio autorizado sin @, por ejemplo `empresa.com`. Omítelo si autorizarás personas individualmente. |

Ejemplo de formato de ADMIN_EMAILS (reemplazar por correos reales):

`administrador@empresa.com,formacion@empresa.com`

Guarda las propiedades. No copies IDs de la instalación anterior. Los administradores tienen acceso global a los datos de ESTE campus.

## 4. Instalar base de datos, carpeta, diploma y automatización

Selecciona Código.gs en el editor. En el selector de funciones de la barra superior elige `instalarXpanzia` y pulsa Ejecutar. Si no aparece, guarda y recarga el editor. El selector aparece al abrir un archivo .gs, no el manifiesto JSON.

Autoriza el acceso solicitado por TU proyecto y tu cuenta. La función usa Sheets, Drive, Slides y correo para este campus.

Al finalizar se crean:

- Un Google Sheets nuevo llamado `Xpanzia Group — Base de datos`.
- Una carpeta privada nueva para certificados.
- Una plantilla de Google Slides con fondo rojo y dorado y el logo original incorporado. No necesitas subir el logo a Drive ni ponerlo manualmente.
- Un activador `procesarPendientes` que revisa los certificados pendientes aproximadamente cada 5 minutos.
- Un curso de ejemplo.

En Registro de ejecución aparecen los enlaces a la base de datos y a la plantilla. Ábrelos y guárdalos. Las propiedades con sus IDs se crean automáticamente.

No hace falta ejecutar prepararCertificadoPremium por separado en esta primera instalación. Si después editas el diseño en Certificate.gs, ejecuta prepararCertificadoPremium para crear una nueva plantilla.

## 5. Implementar la aplicación web

En Apps Script: Implementar > Nueva implementación > engranaje / Seleccionar tipo > Aplicación web.

- Descripción: `Xpanzia versión inicial`.
- Ejecutar como: **Yo**.
- Quién tiene acceso: **Cualquier usuario** (el endpoint debe responder también sin una sesión de Google).

Pulsa Implementar, completa la autorización y copia la URL que termina en `/exec`. No uses `/dev` ni el enlace del editor. Si la cuenta empresarial no permite esa opción, el administrador de Google Workspace debe revisar la política de publicación.

El endpoint público sigue validando códigos de acceso, sesiones y roles para las operaciones privadas. El catálogo y la verificación de certificados son públicos.

## 6. Conectar el sitio

En VS Code abre `web/config.js` y completa:

```javascript
window.UC_CONFIG = {
  name: 'Universidad Xpanzia Group',
  company: 'Xpanzia Group',
  apiUrl: 'PEGA_AQUI_LA_NUEVA_URL_QUE_TERMINA_EN_EXEC',
  demo: false
};
```

Conserva las comillas. Usa la URL del NUEVO Apps Script de Xpanzia. No pegues el enlace de la universidad anterior.

## 7. Crear el repositorio y subirlo desde VS Code

En GitHub crea un repositorio NUEVO, por ejemplo `UNIVERSIDAD-XPANZIA`. Para el primer push déjalo vacío, sin README, licencia ni .gitignore generado por GitHub. El plan de GitHub debe admitir Pages con la visibilidad elegida. Un repositorio público permite Pages con GitHub Free.

En la terminal de VS Code, estando DENTRO de `xpanzia-campus`, ejecuta uno por uno:

```powershell
git init
git add .
git commit -m "Universidad Xpanzia Group"
git branch -M main
```

Copia la dirección HTTPS del nuevo repositorio y úsala en el siguiente comando, reemplazando TU_USUARIO:

```powershell
git remote add origin https://github.com/TU_USUARIO/UNIVERSIDAD-XPANZIA.git
git push -u origin main
```

Si aparece 403, inicia sesión en GitHub con la cuenta que es dueña del nuevo repositorio o que tenga permiso de escritura. Un aviso LF/CRLF de Windows no es un error de subida.

Si sale `remote origin already exists`, revisa `git remote -v`. Asegúrate de trabajar en la carpeta nueva. Solo si esa carpeta es la correcta, cambia la dirección con `git remote set-url origin URL_DEL_REPOSITORIO_NUEVO`.

## 8. Activar GitHub Pages

En el NUEVO repositorio: Settings > Pages > Build and deployment > Source > **GitHub Actions**.

Ya se incluye `.github/workflows/pages.yml`. Publica únicamente `web`, no los archivos del servidor ni las pruebas.

Abre Actions. Si el primer intento falló antes de activar Pages, abre ese intento y pulsa Re-run all jobs. También puedes abrir el flujo Publicar Universidad Corporativa y elegir Run workflow en main.

Cuando termine en verde, Settings > Pages mostrará la dirección pública. Tendrá la forma:

`https://TU_USUARIO.github.io/UNIVERSIDAD-XPANZIA/`

## 9. Terminar la configuración desde el campus

Abre tu nueva dirección pública y pulsa Ingresar al campus. Usa un correo incluido en ADMIN_EMAILS. Recibirás un código de ocho dígitos. Revisa también spam.

Entra en Administración > Configuración y guarda:

- Nombre de la empresa: `Xpanzia Group`.
- Responsable institucional del certificado: `Xpanzia Group` o el área responsable. El logo permanece como firma institucional.
- Dirección pública del campus: la URL NUEVA de GitHub Pages, con https://.
- Intentos diarios y la información real de tratamiento de datos de la empresa.

Sin la URL pública guardada no se habilitan las nuevas inscripciones. Esa dirección también se incorpora al enlace de verificación del certificado.

En Administración > Personas puedes autorizar correos individuales. Para añadir administradores, edita ADMIN_EMAILS en las propiedades del Apps Script. Después deben salir e ingresar de nuevo.

## 10. Prueba real antes de abrirlo a toda la empresa

1. Completa tu perfil con un nombre que puedas reconocer en el diploma.
2. Inscríbete en el curso de ejemplo y completa sus tres lecciones.
3. Presenta la evaluación y aprueba con al menos 80 %.
4. Abre Certificaciones. Revisa Vista previa y luego Descargar PDF.
5. Abre el PDF descargado y comprueba fondo, logo, nombre, curso, fecha, código y enlace de verificación.
6. Espera el siguiente ciclo del activador para recibir el correo. No es instantáneo ni tiene un tiempo máximo garantizado.
7. Compara el PDF adjunto del correo con el descargado.
8. Abre la verificación en una ventana privada y comprueba el código.
9. En Sheets revisa Reporte_Formacion y Reporte_Certificados después del proceso automático.
10. Repite el acceso desde celular y con un estudiante que no sea administrador.

La entrega tiene pruebas locales automatizadas y revisión visual. La autorización, exportación real de Slides a PDF, entrega de correo y permisos de archivos deben comprobarse en tu nueva cuenta con este recorrido.

## Contenidos dentro del aula

En el editor del curso pega el enlace HTTPS del recurso en la lección. YouTube se visualiza integrado cuando el dueño permite inserción. Drive, Docs, Sheets y Slides usan sus visores. También se admiten enlaces directos a PDF, video, audio e imágenes. Los permisos de Google y las restricciones del proveedor siguen aplicándose. Un enlace restringido puede pedir iniciar sesión en Google.

Los archivos se suben a Google Drive, no al repositorio ni a Sheets. El campus guarda el enlace. Evita publicar archivos internos en GitHub. El catálogo y las lecciones de cursos publicados se entregan desde una ruta pública del backend; usa permisos de Drive para los materiales restringidos. Este modelo se conserva del campus original.

Las evaluaciones de esta versión se realizan dentro del campus y se califican en Apps Script. **Google Forms no interviene**. No hace falta crear formularios de Google para que esta copia funcione.

## Cambios posteriores

Para cambios visuales en web: guarda y ejecuta:

```powershell
git add .
git commit -m "Actualizar campus Xpanzia"
git push
```

Espera Actions en verde y recarga con Ctrl+F5.

Para cambios en .gs: copia el archivo completo a Apps Script, guarda y ve a Implementar > Administrar implementaciones > lápiz > Versión nueva > Implementar. Mantén la misma implementación para conservar la URL /exec. Un push a GitHub NO actualiza Apps Script.

Si cambias el diseño del diploma, ejecuta prepararCertificadoPremium antes de publicar la nueva versión. Los PDFs emitidos no se sustituyen automáticamente por cambios futuros sin una nueva versión de diseño. Los adjuntos ya enviados por correo no cambian.

## Problemas frecuentes

- **Campus sin conectar:** revisa apiUrl en web/config.js, demo:false y el último despliegue de Pages.
- **Modo demostración:** config.js aún tiene demo:true o el navegador conserva la versión anterior. Cámbialo, sube el cambio y usa Ctrl+F5.
- **No llegan códigos:** confirma ADMIN_EMAILS / autorizaciones, spam y cuota del remitente. Revisa Ejecuciones en Apps Script.
- **El código dice ser de otra empresa:** estás usando el endpoint o las propiedades de la instalación anterior.
- **Vista previa correcta, PDF incorrecto:** confirma que copiaste los TRES archivos .gs completos, ejecutaste instalarXpanzia y publicaste una versión nueva. Vista previa y exportación de Google son procesos distintos.
- **Certificado pendiente:** revisa Activadores > procesarPendientes y Ejecuciones. Puedes ejecutar procesarPendientes manualmente; procesa los pendientes reales y puede enviar correos. Revisa primero el error mostrado.
- **Sin reportes:** se actualizan durante procesarPendientes. No edites a mano las columnas data_json.
- **Certificado en blanco:** no borres datos ni reinstales. Conserva el PDF y el registro de la ejecución para diagnosticar la exportación.

También puedes ejecutar `revisarInstalacionXpanzia` desde el editor para ver el enlace de Sheets, si hay plantilla, activador, URL pública y cuota de correo restante.

## Referencias oficiales

- Apps Script, aplicaciones web: https://developers.google.com/apps-script/guides/web
- GitHub Pages, flujos personalizados: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
