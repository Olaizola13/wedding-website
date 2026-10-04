document.addEventListener('DOMContentLoaded', () => {
    const panel = document.querySelector('[data-upload-panel]');
    if (!panel) return;

    const input = panel.querySelector('[data-photo-input]');
    const button = panel.querySelector('.memories-primary-button');
    const progress = panel.querySelector('[data-upload-progress]');
    const progressBar = panel.querySelector('[data-upload-progress-bar]');
    const status = panel.querySelector('[data-upload-status]');
    const cloudName = panel.dataset.cloudName;
    const uploadPreset = panel.dataset.uploadPreset;
    const language = document.documentElement.lang || 'en';

    const messages = {
        en: {
            configuration: 'Photo upload is not configured yet.',
            uploading: (current, total) => `Uploading photo ${current} of ${total}…`,
            success: (total) => `${total === 1 ? 'Photo' : `${total} photos`} uploaded. Thank you!`,
            error: 'Some photos could not be uploaded. Please check your connection and try again.',
            tooLarge: 'Each photo must be smaller than 25 MB.'
        },
        es: {
            configuration: 'La subida de fotos todavía no está configurada.',
            uploading: (current, total) => `Subiendo foto ${current} de ${total}…`,
            success: (total) => `${total === 1 ? 'Foto subida' : `${total} fotos subidas`}. ¡Gracias!`,
            error: 'No se han podido subir algunas fotos. Comprueba tu conexión e inténtalo de nuevo.',
            tooLarge: 'Cada foto debe ocupar menos de 25 MB.'
        },
        de: {
            configuration: 'Der Foto-Upload ist noch nicht eingerichtet.',
            uploading: (current, total) => `Foto ${current} von ${total} wird hochgeladen…`,
            success: (total) => `${total === 1 ? 'Foto' : `${total} Fotos`} hochgeladen. Vielen Dank!`,
            error: 'Einige Fotos konnten nicht hochgeladen werden. Prüft eure Verbindung und versucht es erneut.',
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
        button.classList.toggle('is-uploading', busy);
        button.setAttribute('aria-disabled', String(busy));
    };

    button.addEventListener('click', () => input.click());

    const uploadPhoto = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        formData.append('context', `original_filename=${file.name}`);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) throw new Error(`Upload failed with status ${response.status}`);
    };

    input.addEventListener('change', async () => {
        const files = Array.from(input.files || []);
        if (!files.length) return;

        if (!cloudName || !uploadPreset) {
            showStatus(copy.configuration, 'error');
            input.value = '';
            return;
        }

        if (files.some(file => file.size > 25 * 1024 * 1024)) {
            showStatus(copy.tooLarge, 'error');
            input.value = '';
            return;
        }

        setBusy(true);
        progressBar.style.width = '0%';

        try {
            for (let index = 0; index < files.length; index += 1) {
                showStatus(copy.uploading(index + 1, files.length));
                await uploadPhoto(files[index]);
                progressBar.style.width = `${Math.round(((index + 1) / files.length) * 100)}%`;
            }
            showStatus(copy.success(files.length), 'success');
        } catch (error) {
            console.error('Wedding photo upload failed:', error);
            showStatus(copy.error, 'error');
        } finally {
            setBusy(false);
            input.value = '';
        }
    });
});
