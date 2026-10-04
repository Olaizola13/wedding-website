# Configuración de la subida privada de fotos

La página de recuerdos sube las fotos directamente desde el navegador del invitado a una cuenta de Cloudinary. No usa Google Fotos, no pide instalar ninguna aplicación y no muestra el contenido almacenado.

## 1. Crear el destino de las fotos

1. Crea o abre una cuenta de Cloudinary.
2. En **Settings → Upload → Upload presets**, crea un preset **Unsigned**.
3. Configura el preset para que guarde los archivos en una carpeta dedicada, por ejemplo `boda-2026`.
4. Restringe los formatos permitidos a formatos fotográficos (`jpg`, `jpeg`, `png`, `webp`, `heic` y `heif`).
5. Si las fotos no deben tener una URL pública, establece el tipo de entrega del preset como **Authenticated**.
6. Guarda el nombre del preset y el **Cloud name** de la cuenta. El API secret no se usa ni debe añadirse nunca a esta web.

## 2. Conectar la web

En `memories.html`, completa los atributos de `data-upload-panel`:

```html
data-cloud-name="TU_CLOUD_NAME" data-upload-preset="TU_PRESET_UNSIGNED"
```

Al pulsar el botón, el navegador permite elegir varias fotos y comienza la subida automáticamente. Los invitados solo pueden enviar archivos: la web no contiene ninguna galería ni funcionalidad para listar, leer o borrar fotos.

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
