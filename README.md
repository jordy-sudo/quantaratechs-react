# Quantara Techs

Landing de Quantara Techs con React, Vite y una API Express para enviar las consultas por SMTP. Los ejemplos de soluciones son ilustrativos: no representan clientes, testimonios ni resultados medidos.

## Desarrollo local

Usa Node.js 22.12 o superior. Instala las dependencias con `npm ci`, copia `.env.example` a `.env` si todavía no existe y completa las variables de correo.

```sh
npm run dev:full
```

La web se abre en http://localhost:5173 y la API en http://127.0.0.1:3001. Vite envía las peticiones `/api` al servidor Express. En Windows con scripts de PowerShell deshabilitados, usa `npm.cmd` en lugar de `npm`. Reinicia la API después de cambiar `.env`.

## Correo de contacto

`MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME` y `MAIL_PASSWORD` son obligatorias. `MAIL_TO` indica el destinatario; si está vacío, se usa `MAIL_USERNAME`. `MAIL_FROM_NAME` configura el nombre del remitente. El puerto 465 usa TLS directo; 587 usa STARTTLS obligatorio. No se desactiva la validación de certificados.

Para Zoho, confirma el servidor correspondiente a tu cuenta y región en su configuración SMTP. Si la cuenta utiliza doble factor, genera una contraseña de aplicación. Conserva las credenciales únicamente en `.env` o en las variables del servidor, nunca en `VITE_*`, el frontend ni Git.

```sh
npm run mail:verify
```

Esta orden comprueba conexión, TLS y autenticación sin enviar mensajes. Un error `EAUTH / 535` significa que el proveedor rechazó el inicio de sesión; no es una confirmación de entrega.

`CONTACT_EMAIL` es el correo público que aparece en la web. Si no se define, se muestra `MAIL_USERNAME`. Se entrega mediante `/api/public-config`; esa ruta no devuelve contraseñas, servidor SMTP ni destinatarios internos.

La cuenta comercial configurada es `Comercial@quantaratechs.com`, tanto para autenticación SMTP como para recibir consultas. Su contraseña de aplicación se configura únicamente en `MAIL_PASSWORD` dentro de `.env` o del entorno del servidor.

El formulario único envía nombre, correo, empresa opcional, servicio y mensaje. El remitente es la cuenta autenticada y el correo del visitante se usa como `Reply-To`. El servidor valida tipos, longitudes y servicio, escapa HTML, limita el cuerpo a 16 KB y aplica un máximo de cinco solicitudes por IP cada 15 minutos. El contador reside en memoria del proceso; para varias instancias se requiere un almacén compartido compatible con express-rate-limit.

La interfaz informa éxito únicamente cuando SMTP acepta los destinatarios y la API devuelve una referencia. Ante error conserva los datos y no cuenta una conversión. La aceptación SMTP confirma el envío al proveedor; la recepción final se comprueba en el buzón destinatario, incluida la carpeta de spam. Los logs registran la referencia y el código de error, sin guardar el contenido del formulario ni las credenciales.

## Producción y comprobaciones

```sh
npm test
npm run lint
npm run build
npm start
```

La compilación genera `dist/` con HTML prerenderizado y lo hidrata con React. Los servicios, soluciones y preguntas frecuentes están disponibles en el HTML inicial. Express sirve la web y la API desde el mismo origen; `vite preview` por sí solo sirve archivos y no sustituye al servidor de correo.

Configura `NODE_ENV=production`, `SITE_URL` y las variables SMTP en el servidor. Si existe un proxy inverso conocido, configura `TRUST_PROXY_HOPS` con el número real de saltos para el límite por IP. El servidor envía cabeceras de seguridad, compresión y caché de recursos. `robots.txt`, `sitemap.xml`, canonical y metadatos sociales apuntan al dominio `https://www.quantaratechs.com/`; actualízalos si cambia el dominio.

Las pruebas de Node cubren la entrega aceptada y rechazada mediante un transporte simulado, validaciones, inyección de cabeceras, escape HTML, límites de envío, orígenes, cuerpos inválidos y rutas inexistentes. No envían correos reales.

## Despliegue en Netlify

`netlify.toml` configura Node.js 24, `npm run build`, la publicación de `dist/` y las funciones de `netlify/functions/`. La función `api` publica `/api/*` mediante su configuración de rutas y reutiliza la API Express, sin iniciar un servidor con `listen`. Netlify sirve los archivos de la web desde su CDN. El proxy de Vite solo se usa en desarrollo; publicar únicamente `dist/` deja la API sin desplegar y produce un 404 al enviar el formulario.

En **Project configuration → Environment variables** de Netlify, configura las siguientes variables para el contexto de producción y con alcance **Functions** (o todos los alcances):

- `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME` y `MAIL_PASSWORD`: los datos SMTP del proveedor; `MAIL_PASSWORD` debe contener la contraseña de aplicación real.
- `MAIL_TO`, `MAIL_FROM_NAME` y `MAIL_ENCRYPTION`: los valores correspondientes de `.env.example`.
- `CONTACT_EMAIL=Comercial@quantaratechs.com` y `SITE_URL=https://www.quantaratechs.com`.

Configura las credenciales en el panel, CLI o API de Netlify: el archivo `.env` local no se publica y las variables declaradas en `netlify.toml` no llegan a las funciones en ejecución. Después de guardar las variables, despliega el repositorio completo mediante la integración Git de Netlify. Arrastrar solo `dist/` al panel no publica esta API. Cada cambio de variables requiere un nuevo despliegue.

Comprueba que `/api/health` responde `200` con `{"status":"ok"}` y `/api/public-config` devuelve el correo público en JSON. Envía una consulta desde el formulario y verifica la referencia de envío y su llegada al buzón. Un `503` con referencia indica que la API ya funciona pero falló la configuración o entrega SMTP; revisa el código de error en los logs de la función `api`.

El adaptador usa la IP que Netlify entrega en `context.ip`, sin depender de `TRUST_PROXY_HOPS` ni de cabeceras enviadas por el visitante. El límite de solicitudes se conserva en cada instancia activa de la función; varias instancias o un arranque nuevo tienen contadores independientes. Las pruebas también ejecutan el adaptador de Netlify con solicitudes web reales y transporte SMTP simulado.

## Contenido y medición

- `src/sections/about-our-apps.jsx`: servicios ofrecidos.
- `src/sections/our-latest-creation.jsx`: ejemplos de solución y sus detalles. Sustituir por casos reales cuando haya autorización para publicarlos.
- `src/sections/process.jsx` y `faq.jsx`: proceso de trabajo y preguntas frecuentes.
- `shared/contact.js`: servicios y límites compartidos entre formulario y API.
- `src/global.css`: identidad visual, adaptación móvil y movimiento reducido.

`src/lib/analytics.js` prepara eventos `contact_cta_click`, `contact_error` y `generate_lead` en `window.dataLayer` y como eventos `quantara:analytics`. `generate_lead` solo se dispara tras un envío confirmado por la API. No se incluyen nombres, correos ni mensajes. El proveedor de analítica no está conectado: estos eventos quedan listos para integrarlo sin inventar un identificador de cuenta.

`shared/site-contact.js` centraliza el correo comercial, el WhatsApp `+593 99 870 7704` y el mensaje de asesoría. El botón flotante permanece fijo a la derecha, respeta las áreas seguras del móvil y abre el chat con el mensaje preparado; el visitante decide cuándo enviarlo. Los clics generan `whatsapp_click`, sin contarlos como un mensaje recibido o una conversión confirmada. El icono procede de Simple Icons (CC0).

Las fuentes Poppins se sirven localmente bajo la licencia incluida en `public/assets/fonts/OFL.txt`. La demostración de automatización y las vistas de soluciones se construyen en HTML/CSS y usan datos de ejemplo, sin imágenes externas ni dependencia del antiguo dominio de recursos.

Las animaciones de entrada, aparición al desplazarse e interacción están en `src/animations.css`. `src/lib/use-scroll-reveal.js` utiliza IntersectionObserver y conserva el contenido visible cuando JavaScript no está disponible o el visitante prefiere movimiento reducido. El nombre visible de la empresa es **Quantara Techs**; el dominio continúa siendo `quantaratechs.com`.
