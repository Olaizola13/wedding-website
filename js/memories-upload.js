document.addEventListener('DOMContentLoaded', () => {
    const panel = document.querySelector('[data-upload-panel]');
    if (!panel) return;

    const input = panel.querySelector('[data-photo-input]');
    const button = panel.querySelector('[data-choose-photos]');
    const progress = panel.querySelector('[data-upload-progress]');
    const progressBar = panel.querySelector('[data-upload-progress-bar]');
    const status = panel.querySelector('[data-upload-status]');
    const retryButton = panel.querySelector('[data-retry-photos]');
    let failedFiles = [];
    let uploadedCount = 0;
    const cloudName = panel.dataset.cloudName;
    const uploadPreset = panel.dataset.uploadPreset;
    const language = document.documentElement.lang || 'en';

    const messages = {
        en: {
            configuration: 'Photo upload is not configured yet.',
            uploading: (current, total) => `Uploading photo ${current} of ${total}…`,
            success: (total) => `${total === 1 ? 'Photo' : `${total} photos`} uploaded. Thank you!`,
            error: 'Some photos could not be uploaded. Please check your connection and try again.',
            partial: (uploaded, failed) => `${uploaded} uploaded; ${failed} not uploaded. Retry the remaining photos below. Keep this page open until uploads finish.`,
            invalid: 'Please select JPG, PNG, WebP, HEIC or HEIF photos only.',
            tooLarge: 'Each photo must be smaller than 25 MB.'
        },
        es: {
            configuration: 'La subida de fotos todavía no está configurada.',
            uploading: (current, total) => `Subiendo foto ${current} de ${total}…`,
            success: (total) => `${total === 1 ? 'Foto subida' : `${total} fotos subidas`}. ¡Gracias!`,
            error: 'No se han podido subir algunas fotos. Comprueba tu conexión e inténtalo de nuevo.',
            partial: (uploaded, failed) => `${uploaded} subidas; ${failed} pendientes. Reintenta las fotos pendientes con el botón de abajo. Mantén esta página abierta hasta que termine la subida.`,
            invalid: 'Selecciona solo fotos JPG, PNG, WebP, HEIC o HEIF.',
            tooLarge: 'Cada foto debe ocupar menos de 25 MB.'
        },
        de: {
            configuration: 'Der Foto-Upload ist noch nicht eingerichtet.',
            uploading: (current, total) => `Foto ${current} von ${total} wird hochgeladen…`,
            success: (total) => `${total === 1 ? 'Foto' : `${total} Fotos`} hochgeladen. Vielen Dank!`,
            error: 'Einige Fotos konnten nicht hochgeladen werden. Prüft eure Verbindung und versucht es erneut.',
            partial: (uploaded, failed) => `${uploaded} hochgeladen; ${failed} nicht hochgeladen. Versucht die verbleibenden Fotos mit dem Button unten erneut. Lasst diese Seite bis zum Ende des Uploads geöffnet.`,
            invalid: 'Bitte wählt nur JPG-, PNG-, WebP-, HEIC- oder HEIF-Fotos aus.',
            tooLarge: 'Jedes Foto muss kleiner als 25 MB sein.'
        }
    };
    const copy = messages[language] || messages.en;

    const showStatus = (message, type = '') => {
        progress.hidden = false;
        status.textContent = message;
        status.className = `upload-status${type ? ` is-${type}` : ''}`;
    };

    const setBusy = (busy) => {
        input.disabled = busy;
        button.disabled = busy;
        retryButton.disabled = busy;
        panel.setAttribute('aria-busy', String(busy));
        button.classList.toggle('is-uploading', busy);
        button.setAttribute('aria-disabled', String(busy));
    };

    button.addEventListener('click', () => {
        if (!cloudName || !uploadPreset) {
            showStatus(copy.configuration, 'error');
            return;
        }
        input.click();
    });

    const uploadPhoto = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 120000);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });
            if (!response.ok) throw new Error(`Upload failed with status ${response.status}`);
            const result = await response.json();
            if (!result.asset_id) throw new Error('Upload response did not confirm a stored photo');
        } finally {
            window.clearTimeout(timeout);
        }
    };

    const uploadFiles = async (files) => {
        setBusy(true);
        retryButton.hidden = true;
        failedFiles = [];
        progressBar.style.width = '0%';
        try {
            for (let index = 0; index < files.length; index += 1) {
                showStatus(copy.uploading(index + 1, files.length));
                try {
                    await uploadPhoto(files[index]);
                    uploadedCount += 1;
                } catch (error) {
                    console.error('Wedding photo upload failed:', error);
                    failedFiles.push(files[index]);
                }
                progressBar.style.width = `${Math.round(((index + 1) / files.length) * 100)}%`;
            }
            if (failedFiles.length) {
                showStatus(copy.partial(uploadedCount, failedFiles.length), 'error');
                retryButton.hidden = false;
            } else {
                showStatus(copy.success(uploadedCount), 'success');
            }
        } finally {
            setBusy(false);
            input.value = '';
        }
    };

    retryButton.addEventListener('click', () => uploadFiles([...failedFiles]));

    input.addEventListener('change', async () => {
        const files = Array.from(input.files || []);
        if (!files.length) return;

        if (!cloudName || !uploadPreset) {
            showStatus(copy.configuration, 'error');
            input.value = '';
            return;
        }

        const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence']);
        if (files.some(file => !allowedTypes.has(file.type) && !(!file.type && /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name)))) {
            showStatus(copy.invalid, 'error');
            input.value = '';
            return;
        }

        if (files.some(file => file.size > 25 * 1024 * 1024)) {
            showStatus(copy.tooLarge, 'error');
            input.value = '';
            return;
        }

        uploadedCount = 0;
        await uploadFiles(files);
    });
});
