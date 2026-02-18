import { ciudadNoEncontrada, forecastNoExiste, mostrarClima, mostrarPronostico } from "../UI/show_weather.js";
import { guardarCiudad } from "../storage/storage_city.js";
import { fetchWithCircuitBreaker, weatherBreaker, geoBreaker, forecastBreaker } from "./circuit_breaker.js";

const API_KEY = "96b98a5a2c16d6e27269fa143d8c62bb";
const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";
const ONECALL_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

export async function buscarClimaPorCoords(lat, lon, nombre) {
    try {
        const res = await fetchWithCircuitBreaker(
            `${ONECALL_URL}?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`,
            {},
            weatherBreaker
        );

        const data = await res.json();
        data.name = nombre;

        if (!data.coord) {
            data.coord = { lat: parseFloat(lat), lon: parseFloat(lon) };
        }

        mostrarClima(data);
        guardarCiudad(nombre, lat, lon);
        await buscarPronostico(lat, lon);

    } catch (error) {
        if (navigator.onLine) {
            ciudadNoEncontrada();
            forecastNoExiste();
        }
    }
}

export async function buscarClima(ciudad) {
    try {
        const geoRes = await fetchWithCircuitBreaker(
            `${GEO_URL}?q=${ciudad}&limit=1&appid=${API_KEY}`,
            {},
            geoBreaker
        );

        const geoData = await geoRes.json();

        if (!geoData.length) {
            throw new Error("Ciudad no encontrada");
        }

        const { lat, lon, name, country } = geoData[0];

        const weatherRes = await fetchWithCircuitBreaker(
            `${ONECALL_URL}?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`,
            {},
            weatherBreaker
        );

        const weatherData = await weatherRes.json();
        weatherData.name = `${name}, ${country}`;

        mostrarClima(weatherData);
        guardarCiudad(`${name}, ${country}`, lat, lon);
        await buscarPronostico(lat, lon);

    } catch (error) {
        if (navigator.onLine) {
            ciudadNoEncontrada();
            forecastNoExiste();
        }
    }
}

export async function buscarPronostico(lat, lon) {
    try {
        const res = await fetchWithCircuitBreaker(
            `${FORECAST_URL}?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`,
            {},
            forecastBreaker
        );

        const data = await res.json();
        mostrarPronostico(data);

    } catch (error) {
        if (navigator.onLine) {
            forecastNoExiste();
        }
    }
}

export async function buscarSugerencias(ciudad) {
    try {
        const res = await fetchWithCircuitBreaker(
            `${GEO_URL}?q=${ciudad}&limit=5&appid=${API_KEY}`,
            {},
            geoBreaker
        );

        return await res.json();

    } catch (error) {
        return [];
    }
}