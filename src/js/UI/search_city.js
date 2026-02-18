import { buscarClimaPorCoords, buscarClima, buscarSugerencias } from "../api/api_consumer.js";

const inputCity = document.getElementById("city");
const autoList = document.getElementById("autocomplete-list");
const form = document.getElementById("form-search-city");

let debounceTimer;
let shouldShowAutocomplete = true;

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);

    if (params.has('lat') && params.has('lon') && params.has('nombre')) {
        const lat = parseFloat(params.get('lat'));
        const lon = parseFloat(params.get('lon'));
        const nombre = decodeURIComponent(params.get('nombre'));

        buscarClimaPorCoords(lat, lon, nombre);
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearTimeout(debounceTimer);
    shouldShowAutocomplete = false;
    buscarClima(inputCity.value.trim());
    autoList.classList.add("hidden");
    inputCity.blur();
});


inputCity.addEventListener("keyup", (e) => {

    if (e.key === "Enter") {
        clearTimeout(debounceTimer);
        autoList.classList.add("hidden");
        shouldShowAutocomplete = false;
        return;
    }

    if (e.key === "Escape" || e.key === "Tab") return;

    shouldShowAutocomplete = true;

    clearTimeout(debounceTimer);

    const query = inputCity.value.trim();

    if (query.length < 3) {
        autoList.classList.add("hidden");
        return;
    }

    debounceTimer = setTimeout(async () => {
        if (!shouldShowAutocomplete) return;
        const ciudades = await buscarSugerencias(query);
        mostrarSugerencias(ciudades);
    }, 500);
});

inputCity.addEventListener("focus", async () => {

    if (!shouldShowAutocomplete) return;

    const query = inputCity.value.trim();

    if (query.length < 3) return;

    const ciudades = await buscarSugerencias(query);
    mostrarSugerencias(ciudades);
});

function mostrarSugerencias(ciudades) {

    if (!shouldShowAutocomplete) return;

    autoList.innerHTML = "";

    if (!ciudades.length) {
        autoList.classList.add("hidden");
        return;
    }

    ciudades.forEach(ciudad => {

        const item = document.createElement("div");
        item.className = "p-2 hover:bg-blue-200 cursor-pointer";

        item.textContent = `${ciudad.name}, ${ciudad.country}`;

        item.addEventListener("click", () => {
            inputCity.value = `${ciudad.name}, ${ciudad.country}`;
            autoList.classList.add("hidden");
            shouldShowAutocomplete = false;

            buscarClimaPorCoords(
                ciudad.lat,
                ciudad.lon,
                `${ciudad.name}, ${ciudad.country}`
            );
        });

        autoList.appendChild(item);
    });

    autoList.classList.remove("hidden");
}