# Configuración de la subida privada de fotos

La página de recuerdos sube las fotos directamente desde el navegador del invitado a una cuenta de Cloudinary. No usa Google Fotos, no pide instalar ninguna aplicación y no muestra el contenido almacenado.

## Configuración actual

- Cloud name: `ty23k8cn`.
- Preset unsigned: `boda-2026-guests`.
- Carpeta de destino: `boda-2026`.
- Formatos permitidos aplicados en Cloudinary: `jpg`, `jpeg`, `png`, `webp`, `heic` y `heif`.
- Prueba real realizada el 7 de octubre de 2026: foto recibida en esa carpeta con tipo `authenticated`; acceso sin firma rechazado con HTTP 401.
- Foto de prueba en Media Library: `wedding-upload-setup-test` (public ID `nwjcgkjeer7pnpdpwdgz`). Se ha conservado para que podáis comprobar la recepción.
- La publicación en el alojamiento de la web todavía debe verificarse; el éxito de la prueba en Cloudinary no confirma que la web pública tenga los cambios.

## 1. Crear el destino de las fotos

1. Crea o abre una cuenta de Cloudinary.
2. En **Settings → Upload → Upload presets**, crea un preset **Unsigned**.
3. Configura el preset para que guarde los archivos en una carpeta dedicada, por ejemplo `boda-2026`.
4. Restringe los formatos permitidos a formatos fotográficos (`jpg`, `jpeg`, `png`, `webp`, `heic` y `heif`).
5. Si las fotos no deben tener una URL pública, establece el tipo de entrega del preset como **Authenticated**.
6. Guarda el nombre del preset y el **Cloud name** de la cuenta. El API secret no se usa ni debe añadirse nunca a esta web.

El preset debe usar nombres únicos y no permitir sobrescribir archivos. El límite de la web es de 25 MB por foto, pero también se aplica el límite de tu cuenta de Cloudinary; compruébalo antes de abrir la recepción a invitados. El preset no admite un límite de tamaño propio.

## 2. Conectar la web

La web ya está conectada al entorno `ty23k8cn` mediante el preset `boda-2026-guests`:

```html
data-cloud-name="ty23k8cn" data-upload-preset="boda-2026-guests"
```

Al pulsar el botón, el navegador permite elegir varias fotos y comienza la subida automáticamente. Los invitados solo pueden enviar archivos: la web no contiene ninguna galería ni funcionalidad para listar, leer o borrar fotos.

La web acepta fotos JPG, PNG, WebP, HEIC y HEIF, no vídeos. Mantén la página abierta hasta ver la confirmación. Si falla parte de una selección, el botón de reintento vuelve a enviar solo las fotos que no se confirmaron, no las que ya llegaron correctamente.

## Ver y descargar vuestras fotos

1. Inicia sesión en [Cloudinary Console](https://console.cloudinary.com/) con la cuenta propietaria.
2. Abre **Media Library** en el entorno cuyo Cloud name has configurado en la web.
3. Abre la carpeta del preset (por ejemplo, `boda-2026`). Ahí podrás ver y descargar las fotos que envían los invitados.
4. Comprueba que una foto de prueba aparece en esa carpeta y tiene tipo de entrega **Authenticated**. Que la web no muestre una galería no convierte las URLs públicas en privadas.

No añadas enlaces de administración ni credenciales a la página de invitados.

### Control que debe aplicarse en el preset

La validación del navegador mejora la experiencia, pero un invitado puede saltársela. Las restricciones reales deben permanecer configuradas en el preset `boda-2026-guests`:

- **Asset folder:** una carpeta exclusiva para la boda, por ejemplo `boda-2026`.
- **Allowed formats:** confirmado: `jpg`, `jpeg`, `png`, `webp`, `heic` y `heif` solamente.
- **Disallow public ID:** activado; Cloudinary asignará nombres únicos.
- **Delivery type:** `Authenticated` si quieres que las fotos no tengan una URL pública.
- **Moderation:** manual, si quieres aprobar cada foto antes de usarla o mostrarla.

El nombre del preset aparece necesariamente en el código público. Cuando quieras cerrar la recepción, desactiva o elimina el preset; quitar solo el botón de la web no bloquea las subidas realizadas directamente contra la API.

## Publicar y comprobar

Los cambios locales no activan la página pública: publica `memories.html`, `js/memories-upload.js`, `js/translations/memories.js` y `css/pages.css` mediante el alojamiento actual de la web. Prueba una subida desde la URL pública y confirma que aparece en vuestra Media Library antes de compartir el enlace o imprimir el QR.

## 3. Crear el QR físico

El QR impreso debe apuntar a la URL pública de esta página, por ejemplo:

```text
https://tu-dominio.example/memories.html?lang=es
```

El QR no se muestra ni se genera en la propia web. Por seguridad, iOS y Android exigen que el invitado pulse el botón antes de abrir su biblioteca de fotos; una página no puede abrirla automáticamente nada más escanear un QR.

## Recomendaciones antes de imprimir

- Haz una subida de prueba desde un iPhone y desde un Android.
- Comprueba en la Media Library de Cloudinary que los archivos llegan a la carpeta configurada.
- Imprime el QR con suficiente contraste y prueba el papel definitivo con varios teléfonos.
- Desactiva o cambia el preset después de la boda para cerrar la recepción de archivos.
