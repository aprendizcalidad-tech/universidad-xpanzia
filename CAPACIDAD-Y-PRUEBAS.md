# Capacidad, pruebas y límite de esta entrega

## Qué significa “100 usuarios”

Almacenar 100 usuarios, tener 100 páginas abiertas y recibir 100 operaciones al mismo instante son situaciones distintas. Leer una lección ya cargada o reproducir un video de YouTube no mantiene una ejecución de Apps Script ocupada. Ingresar, guardar avances, enviar una evaluación y descargar un PDF sí requieren servidor.

Esta actualización reduce trabajo repetido y esperas, pero no convierte Apps Script en un servidor con capacidad garantizada para cualquier pico de 100 personas.

Google publica 30 ejecuciones simultáneas por usuario y 1.000 por script. La aplicación desplegada como “Yo” ejecuta con la identidad del propietario. El límite de 1.000 por script no elimina el límite por usuario. La caché también pasa por una ejecución de Apps Script; mejora duración/carga, no evita su cuota.

MailApp publica 100 destinatarios diarios para cuentas personales y 1.500 para cuentas Workspace, con condiciones y límites adicionales. Los códigos de acceso y certificados usan esa cuota. Por ejemplo, 100 accesos por correo más 100 certificados requieren más de 100 envíos. Es un límite material si usas Gmail personal. Revisa la cuota con revisarInstalacionXpanzia y las Ejecuciones de tu cuenta.

Si el requisito de negocio es asegurar una jornada con 100 personas realizando acciones juntas, falta validar una instalación de pruebas con tráfico real. Si se requiere mayor concurrencia que la permitida por el propietario de Apps Script, corresponde migrar autenticación y operaciones frecuentes a un backend como Firebase, con reglas de acceso, calificación segura y almacenamiento adecuados. Esa migración requiere configurar el proyecto y revisar sus cuotas/costos; no está incluida ni se considera gratuita automáticamente.

## Validación efectuada el 6 de octubre de 2026

- Pruebas anteriores de seguridad y flujo: 17 comprobaciones del backend.
- Migración ejecutada dos veces sin duplicar ni borrar registros y conservando una escuela personalizada existente.
- Creación, edición y eliminación de escuelas, protección de escuelas con cursos, asociación por ID y edición obsoleta.
- Validación de imágenes y rechazo de protocolos o contenidos no admitidos.
- 100 lecturas del catálogo con caché caliente sin releer Sheets, usando servicios simulados.
- 100 expedientes independientes de alumnos: inscripción, avance, aprobación y repetición del envío sin duplicar intentos ni certificados. Carga simulada SECUENCIAL: no demuestra concurrencia real.
- En navegador, 100 llamadas simultáneas del mismo cliente al catálogo se deduplicaron en una petición; se comprobó el máximo de dos peticiones activas y los reintentos BUSY. No equivale a 100 dispositivos independientes.
- Generación PDF fuera del bloqueo compartido y ausencia de reenvío del correo ya enviado, con servicios simulados.
- Recorrido visual de escritorio y celular, carga y eliminación de portadas, cambio de escuela, nombres con caracteres especiales, permisos y evaluación del curso.

No se ejecutó una prueba de carga sobre producción. No se enviaron correos reales ni se crearon recursos en la cuenta Google del usuario.

## Criterios para aceptar una prueba con 100 personas

En una instalación separada de pruebas con su propia hoja y datos ficticios:

1. Aumentar progresivamente el grupo: 10, 25, 50 y 100 participantes o sesiones independientes.
2. Medir apertura y consulta del curso, accesos, guardado de lecciones y evaluación. Probar también una ráfaga de evaluaciones al mismo tiempo.
3. Registrar latencia mediana y percentil 95, errores, reintentos y errores de cuota que muestre Apps Script. Fijar con la empresa el tiempo máximo aceptable antes de declarar la prueba aprobada.
4. Confirmar que cada evaluación confirmada tiene un solo intento y su certificado, que no hay expedientes cruzados y que no desaparece progreso.
5. Medir aparte cuánto tarda la cola de PDF y correo y comprobar el presupuesto diario de envíos de la cuenta.
6. Si aparecen límites de concurrencia o una demora no aceptable, no abrir la sesión masiva hasta adaptar el backend y repetir la prueba.

## Repetir pruebas locales

Para desarrollo, no para publicar la web:

```powershell
npm install
npx playwright install chromium
npm test
npm run test:browser
```

Requiere Node 20 o posterior. Los tests usan datos de demostración y servicios simulados. La web publicada sigue siendo estática y no necesita compilación ni Node.

## Fuentes oficiales consultadas

- https://developers.google.com/apps-script/guides/services/quotas
- https://developers.google.com/apps-script/guides/web
- https://developers.google.com/apps-script/reference/cache/cache
