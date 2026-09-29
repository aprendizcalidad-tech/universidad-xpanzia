# Funcionamiento de Xpanzia

GitHub Pages publica exclusivamente la carpeta web. Apps Script valida el acceso, guarda el avance y califica. Google Sheets almacena personas, cursos, intentos, autorizaciones y certificados. Google Drive guarda materiales y PDFs. Google Slides proporciona la plantilla del diploma. MailApp envía códigos y certificados desde la cuenta propietaria.

No se usa Google Forms: las evaluaciones están integradas en el aula. El logo está incluido en web y codificado dentro de Certificate.gs, sin enlaces de terceros.

El modo real usa `demo: false`; los datos van a Sheets y Drive. La sesión se guarda en sessionStorage, con una clave específica de Xpanzia. El modo demo usa datos ficticios en localStorage con claves independientes del campus original y no envía correos.

Los dos campus tienen que usar diferentes proyectos de Apps Script, hojas, carpetas y repositorios. Si la misma cuenta Google opera ambos, comparten las cuotas y limitaciones de esa cuenta. Duplicar el proyecto no duplica la cuota de correo.

Los administradores se autorizan mediante ADMIN_EMAILS. Los estudiantes se autorizan mediante invitaciones de Administración > Personas o ALLOWED_DOMAINS. El nombre “invitaciones” se refiere a autorizar correos; no se envía automáticamente un correo de invitación.

Al aprobar se registra el certificado y el activador procesa los PDFs/correos pendientes. La descarga y el envío usan el mismo generador y archivo en Drive. La vista previa HTML es una representación visual y no confirma que la exportación real de Google se haya completado.

Se conserva el prefijo UC del código de certificados. La verificación consulta la base de ESTA instalación. Una URL equivocada podría llevar a otra universidad aunque el diseño sea similar.

## Operación

La tarea programada procesa hasta 12 certificados por ciclo y usa reintentos si hay errores. No existe un tiempo de entrega garantizado. Mantén acceso a la cuenta propietaria, revisa Ejecuciones, activadores y cuotas cuando aumente el uso. Esta versión conserva la arquitectura del campus original; no incluye una prueba de carga para miles de usuarios simultáneos.

El catálogo publicado (incluidas las lecciones) es público en la API. Las respuestas correctas no se entregan en el catálogo real. Los archivos privados deben mantener sus permisos de Drive. Las tablas privadas, evaluaciones, descargas personales y administración requieren sesión. Nunca subas exportaciones de alumnos o evaluaciones reales con sus respuestas al repositorio.

Los reportes legibles se generan desde las tablas internas en Sheets. No cambies a mano las columnas id/data_json. Puedes usar las hojas Reporte_* para seguimiento y conectar una herramienta de reportes si lo necesitas.
