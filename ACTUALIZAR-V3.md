# Actualización V3 de Xpanzia: escuelas, imágenes y rendimiento

Esta es una actualización sobre el campus que ya tienes. No crea otra universidad. Mantiene los usuarios, cursos, evaluaciones, certificados y configuración existentes.

## 1. Copiar los archivos locales

Extrae el ZIP y copia su contenido SOBRE la carpeta de tu proyecto `xpanzia-campus`. Acepta reemplazar los archivos coincidentes. No borres las carpetas completas: este paquete contiene solo la actualización.

`web/config.js` no se incluye, para conservar la URL de tu Apps Script y `demo: false`. Tampoco debes cambiar tu repositorio ni el manifiesto de Apps Script.

## 2. Actualizar Apps Script antes de publicar la web

Abre el proyecto EXISTENTE de Xpanzia:

1. Reemplaza TODO Código.gs con el contenido de `google-apps-script/Code.gs` de este ZIP.
2. Reemplaza TODO Certificate.gs con `google-apps-script/Certificate.gs` de este ZIP.
3. Crea un archivo de Secuencia de comandos llamado `Campus` y pega TODO `google-apps-script/Campus.gs`. Si ya existe, reemplázalo. No crees dos copias.
4. Conserva Seed.gs y appsscript.json tal como están.
5. Guarda.
6. Abre Campus.gs. Arriba selecciona **actualizarCampusV3** y pulsa Ejecutar.
7. Espera el mensaje **Campus V3 listo**. La función crea la tabla Schools, incorpora las seis escuelas originales y las escuelas personalizadas de los cursos que ya existan, y relaciona esos cursos con sus escuelas. No borra expedientes. Puedes repetirla si falla: completa la migración sin duplicarla.
8. Abre Certificate.gs y ejecuta **prepararCertificadoPremium** para asegurar que la plantilla usa el logo transparente incluido.
9. Implementar > Administrar implementaciones > lápiz > Versión nueva > Implementar. Usa la implementación existente para conservar la URL /exec.

NO ejecutes instalar ni instalarXpanzia para esta actualización. NO cambies SPREADSHEET_ID ni los IDs de certificados. El activador existente procesarPendientes sigue siendo necesario.

## 3. Subir desde Visual Studio Code

En la terminal, dentro de la carpeta del proyecto, ejecuta:

```powershell
git add web/app.js web/demo.js web/index.html web/styles.css web/assets/xpanzia-logo.png google-apps-script/Code.gs google-apps-script/Certificate.gs google-apps-script/Campus.gs
git commit -m "Administrar escuelas y portadas; optimizar campus"
git push
```

Espera Actions en verde. Abre tu campus y recarga con Ctrl+F5. Cierra e inicia sesión si conservabas una pantalla de edición abierta.

## 4. Administrar escuelas

Ingresa como administrador. Abre **Administración > Escuelas**.

- **Crear escuela:** escribe nombre, descripción opcional, símbolo y orden. Un número menor aparece antes.
- **Imagen:** usa Subir desde tu equipo, espera “Imagen preparada” y pulsa Guardar escuela. También puedes pegar un enlace DIRECTO HTTPS a una imagen y pulsar Aplicar enlace.
- **Editar:** cambia nombre, descripción, orden, símbolo o imagen. Los cursos relacionados siguen perteneciendo a la misma escuela aunque la renombres.
- **Eliminar:** funciona cuando la escuela ya no tiene cursos. Si tiene cursos, incluidos borradores, ve a Cursos > Editar y cámbialos primero de escuela. Así evitas cursos sin categoría y conservas sus avances y certificados.

El administrador puede eliminar incluso las escuelas iniciales cuando estén vacías. Si elimina todas, debe crear una antes de añadir cursos.

## 5. Poner una portada al curso

**Administración > Cursos > Editar > Imagen de portada**.

Selecciona JPG, PNG o WebP de hasta 8 MB, espera la optimización y pulsa Guardar curso. O pega una URL HTTPS pública de imagen, pulsa Aplicar enlace y guarda. Quitar imagen restaura la portada de color.

La imagen subida se guarda como una miniatura JPEG optimizada dentro del registro del curso o escuela en Sheets. No exige otro servicio ni subir archivos manualmente a Drive. Es una portada, no un repositorio de imágenes originales. Para máxima resolución usa una URL directa pública. Los enlaces de compartir documentos de Drive no son necesariamente enlaces directos de imagen.

Las portadas y los cursos publicados son públicos. Usa imágenes autorizadas para esa difusión. Los materiales del aula siguen usando los visores y permisos existentes.

## 6. Cambios de rendimiento

- La apertura combina el catálogo y el perfil en una petición.
- El catálogo público tiene caché en servidor y se invalida al cambiar cursos, escuelas, rutas o ajustes. No contiene respuestas correctas ni expedientes de estudiantes.
- El navegador reutiliza el catálogo durante 45 segundos y agrupa peticiones idénticas en curso.
- Cada navegador mantiene como máximo dos solicitudes activas hacia Apps Script.
- Cuando otro guardado ocupa el servidor, se devuelve BUSY antes de modificar datos. El navegador reintenta con pausas variables. Los errores de red de escrituras no se reenvían a ciegas.
- Los PDF se generan en el activador, fuera del bloqueo compartido de guardados. Si todavía no existe el PDF actualizado, Descargar PDF muestra que está en preparación. No genera Slides mientras el estudiante espera la descarga.
- El procesador evita ejecutar dos lotes al mismo tiempo y revisa hasta 100 certificados por ciclo, con un presupuesto de tiempo de unos 200 segundos para el bucle. Eso NO implica generar 100 PDFs en cada ciclo.
- Las imágenes locales se reducen antes de enviarse. Las portadas se cargan de forma diferida en el navegador.
- Se detectan ediciones antiguas de cursos/escuelas para evitar sobrescribir los cambios de otro administrador.

Un alumno que ya tiene el catálogo abierto puede necesitar recargar para ver cambios de otro administrador. La caché no crea sincronización en tiempo real.

## 7. Comprobación en tu instalación

1. Crea una escuela de prueba y comprueba que aparece en Inicio.
2. Sube una portada y guarda.
3. Edita un curso, asigna la escuela y su portada.
4. Renombra la escuela y comprueba que el curso muestra el nuevo nombre.
5. Intenta eliminarla con ese curso: debe impedirlo.
6. Devuelve el curso a su escuela anterior y elimina la escuela de prueba.
7. Entra como estudiante, completa una lección y comprueba que sigue guardando el avance.
8. Aprueba un curso, espera el activador, descarga el PDF y comprueba el correo.

La generación de Google y la entrega real de correo deben probarse en tu cuenta. Las comprobaciones locales usan servicios simulados y no envían correos.

Si aparece “Falta la tabla Schools”, ejecuta actualizarCampusV3 y publica la versión nueva. Si dice “Acción no reconocida”, la implementación sigue usando el código anterior o no copiaste Campus.gs.

## Sobre los 100 usuarios

Lee CAPACIDAD-Y-PRUEBAS.md. Se ha optimizado el sistema y comprobado el aislamiento de 100 expedientes simulados. **No se ha certificado la concurrencia de 100 usuarios reales en Google.** Apps Script ejecutado como propietario tiene límites de concurrencia y correo que un cambio de código no elimina. Esta entrega no migra a Firebase.
