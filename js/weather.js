document.addEventListener('DOMContentLoaded', () => {
    // --- Live Valladolid forecast for the wedding weekend ---
    const weatherDays = document.querySelector('.weather-days');
    const language = document.documentElement.lang || 'en';
    if (weatherDays) {
        const weatherCopy = {
            en: {
                unavailable: 'The detailed forecast is not available yet. Please check again closer to the date.',
                updated: 'Latest forecast loaded',
                conditions: ['Clear sky', 'Mainly clear', 'Partly cloudy', 'Overcast', 'Foggy', 'Foggy', 'Light drizzle', 'Drizzle', 'Heavy drizzle', 'Freezing drizzle', 'Freezing drizzle', 'Light rain', 'Rain', 'Heavy rain', 'Freezing rain', 'Freezing rain', 'Light snow', 'Snow', 'Heavy snow', 'Snow grains', 'Light showers', 'Showers', 'Heavy showers', 'Snow showers', 'Snow showers', 'Thunderstorms', 'Thunderstorms with hail', 'Thunderstorms with hail']
            },
            es: {
                unavailable: 'La previsión detallada aún no está disponible. Vuelve a consultarla cuando se acerque la fecha.',
                updated: 'Última previsión cargada',
                conditions: ['Cielo despejado', 'Mayormente despejado', 'Parcialmente nuboso', 'Cubierto', 'Niebla', 'Niebla', 'Llovizna débil', 'Llovizna', 'Llovizna intensa', 'Llovizna helada', 'Llovizna helada', 'Lluvia débil', 'Lluvia', 'Lluvia intensa', 'Lluvia helada', 'Lluvia helada', 'Nieve débil', 'Nieve', 'Nieve intensa', 'Granos de nieve', 'Chubascos débiles', 'Chubascos', 'Chubascos fuertes', 'Chubascos de nieve', 'Chubascos de nieve', 'Tormentas', 'Tormentas con granizo', 'Tormentas con granizo']
            },
            de: {
                unavailable: 'Die detaillierte Vorhersage ist noch nicht verfügbar. Bitte schaut kurz vor dem Termin noch einmal nach.',
                updated: 'Aktuelle Vorhersage geladen',
                conditions: ['Klarer Himmel', 'Überwiegend klar', 'Teilweise bewölkt', 'Bedeckt', 'Nebel', 'Nebel', 'Leichter Nieselregen', 'Nieselregen', 'Starker Nieselregen', 'Gefrierender Nieselregen', 'Gefrierender Nieselregen', 'Leichter Regen', 'Regen', 'Starker Regen', 'Gefrierender Regen', 'Gefrierender Regen', 'Leichter Schnee', 'Schnee', 'Starker Schnee', 'Schneegriesel', 'Leichte Schauer', 'Schauer', 'Starke Schauer', 'Schneeschauer', 'Schneeschauer', 'Gewitter', 'Gewitter mit Hagel', 'Gewitter mit Hagel']
            }
        };
        const weatherCodes = [0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99];
        const weatherIcons = { 0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️', 51: '🌦️', 53: '🌦️', 55: '🌧️', 56: '🌧️', 57: '🌧️', 61: '🌦️', 63: '🌧️', 65: '🌧️', 66: '🌧️', 67: '🌧️', 71: '🌨️', 73: '🌨️', 75: '❄️', 77: '🌨️', 80: '🌦️', 81: '🌧️', 82: '⛈️', 85: '🌨️', 86: '❄️', 95: '⛈️', 96: '⛈️', 99: '⛈️' };
        const copy = weatherCopy[language] || weatherCopy.en;
        const endpoint = 'https://api.open-meteo.com/v1/forecast?latitude=41.652&longitude=-4.7245&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Europe%2FMadrid&start_date=2026-10-16&end_date=2026-10-17';

        fetch(endpoint)
            .then(response => {
                if (!response.ok) throw new Error('Forecast unavailable');
                return response.json();
            })
            .then(data => {
                document.querySelectorAll('[data-weather-date]').forEach(card => {
                    const index = data.daily.time.indexOf(card.dataset.weatherDate);
                    if (index < 0) return;
                    const code = data.daily.weather_code[index];
                    const codeIndex = weatherCodes.indexOf(code);
                    card.querySelector('[data-weather-condition]').textContent = copy.conditions[codeIndex] || copy.unavailable;
                    card.querySelector('.weather-condition-icon').textContent = weatherIcons[code] || '🌤️';
                    card.querySelector('[data-weather-temperature]').textContent = `${Math.round(data.daily.temperature_2m_min[index])}° / ${Math.round(data.daily.temperature_2m_max[index])}°`;
                    card.querySelector('[data-weather-rain]').textContent = `${data.daily.precipitation_probability_max[index]}%`;
                });
                document.querySelector('[data-weather-updated]').textContent = copy.updated;
            })
            .catch(() => {
                document.querySelectorAll('[data-weather-condition]').forEach(element => { element.textContent = copy.unavailable; });
                document.querySelector('[data-weather-updated]').textContent = copy.unavailable;
            })
            .finally(() => weatherDays.setAttribute('aria-busy', 'false'));
    }
});
