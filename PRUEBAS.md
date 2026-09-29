# Validación de esta entrega

Fecha: 29 de septiembre de 2026.

Pruebas realizadas sobre esta copia:

- 17 comprobaciones del backend: autenticación, límites de intentos, permisos, calificación en servidor, inscripción y envíos de evaluación repetidos, certificados, revocación y protección de reportes.
- Caché por ejecución y bloqueos: lectura única de tablas, actualización de filas con espacios, separación de lecturas y escrituras y no reenvío de certificados ya enviados.
- Plantilla de Slides con servicios simulados: campos dinámicos, guardado del PDF, limpieza temporal y conservación del certificado previo si falla el registro.
- Recorrido en Chromium de escritorio y celular: ingreso demo, inscripción, conexión fallida simulada, avance confirmado, evaluación fallida y aprobada, certificados de curso y ruta, verificación, editor de cursos y rutas, autorización de personas, revocación y descarga CSV.
- Vistas del diploma con nombres y títulos largos, cierre del diálogo y ancho móvil.
- Integridad: la composición y las imágenes del diploma coinciden entre la vista previa y el generador de Google. Configuración vacía e independiente, sin el endpoint anterior. Logo original sin modificaciones.

Las pruebas de Google usan servicios simulados. No se enviaron correos ni se desplegó una aplicación en la cuenta del usuario. Falta probar el PDF exportado por Google y el correo real después de la instalación. Tampoco se hizo una prueba de carga masiva.

Las imágenes en previews se generaron con datos de demostración. La configuración incluida para instalar está en modo real (`demo: false`), sin URL de API, y requiere completar la conexión.

## Repetir pruebas (opcional, para soporte técnico)

La web no necesita Node ni compilación para publicarse. Estos comandos sirven solo para desarrollar y ejecutar pruebas. Requieren Node 20 o posterior, npm y un navegador instalado por Playwright.

```powershell
npm install
npx playwright install chromium
npm test
npm run test:browser
```

Los tests de navegador levantan servidores locales temporales en 127.0.0.1:8765 y :8767 y habilitan la demostración únicamente en las respuestas de prueba. No cambian config.js ni la base de datos real.
