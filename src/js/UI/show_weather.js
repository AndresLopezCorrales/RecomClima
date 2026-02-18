import { recomendacion } from "./recoms.js";
import { obtenerCiudades } from "../storage/storage_city.js";
import { guardarFavorito, eliminarFavorito, esFavorito } from "../storage/storage_favorites.js";

const contenedorClima = document.getElementById("weather-result");
const contenedorForecast = document.getElementById("forecast-result");

export function noInternet() {
    contenedorClima.innerHTML = `
    <div class="col-span-full text-center py-12">
        <p class="text-gray-500 text-lg mb-4">No hay conexión a internet. Intenta más tarde</p>
    </div>
    `;

    contenedorForecast.innerHTML = ``;
}

export function ciudadNoEncontrada() {

    contenedorClima.innerHTML = `
    <div class="col-span-full text-center py-12">
        <p class="text-gray-500 text-lg mb-4">No existe esta ciudad</p>
    </div>
    `;
}

export function forecastNoExiste() {
    contenedorForecast.innerHTML = ``;
}

export function mostrarClima(data) {

    contenedorClima.innerHTML = "";

    const temp = data.main.temp;
    const clima = data.weather[0].description;
    const icon = data.weather[0].icon;

    // ⬅ Verificar si es favorito
    const esFav = esFavorito(data.name);
    const iconoFav = esFav ? '../img/ic_filled_heart.png' : '../img/ic_blank_heart.png';

    // Crear contenedor principal
    const container = document.createElement('div');

    // Botón de favorito
    const btnFavorito = document.createElement('button');
    btnFavorito.id = 'btn-favorito';
    btnFavorito.className = 'hover:scale-110 transition p-2';
    btnFavorito.dataset.nombre = data.name;
    btnFavorito.dataset.lat = data.coord?.lat || '';
    btnFavorito.dataset.lon = data.coord?.lon || '';
    btnFavorito.title = esFav ? 'Quitar de favoritos' : 'Agregar a favoritos';

    const imgFavorito = document.createElement('img');
    imgFavorito.src = iconoFav;
    imgFavorito.alt = 'Favorito';
    imgFavorito.className = 'w-8 h-8';
    btnFavorito.appendChild(imgFavorito);

    // Título de la ciudad
    const titulo = document.createElement('h2');
    titulo.className = 'text-2xl font-bold';
    titulo.textContent = data.name;

    // Icono del clima
    const imgClima = document.createElement('img');
    imgClima.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    imgClima.alt = clima;
    imgClima.className = 'mx-auto';

    // Temperatura
    const pTemp = document.createElement('p');
    pTemp.className = 'text-lg';
    pTemp.textContent = `${temp} °C`;

    // Descripción del clima
    const pClima = document.createElement('p');
    pClima.textContent = clima;

    // Recomendación
    const pRecomendacion = document.createElement('p');
    pRecomendacion.className = 'mt-4 font-semibold';
    pRecomendacion.textContent = recomendacion(temp, clima);

    // Ensamblar elementos
    container.appendChild(btnFavorito);
    container.appendChild(titulo);
    container.appendChild(imgClima);
    container.appendChild(pTemp);
    container.appendChild(pClima);
    container.appendChild(pRecomendacion);

    contenedorClima.appendChild(container);

    // Event listener para el botón de favorito
    btnFavorito.addEventListener('click', function () {
        const nombre = this.dataset.nombre;
        const lat = this.dataset.lat;
        const lon = this.dataset.lon;

        if (esFavorito(nombre)) {
            eliminarFavorito(nombre);
            imgFavorito.src = '../img/ic_blank_heart.png';
            this.title = 'Agregar a favoritos';
        } else {
            guardarFavorito(nombre, parseFloat(lat), parseFloat(lon));
            imgFavorito.src = '../img/ic_filled_heart.png';
            this.title = 'Quitar de favoritos';
        }
    });
}

export function mostrarPronostico(data) {
    // Limpiar contenedor
    contenedorForecast.innerHTML = '';

    const pronosticoDiario = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    // Título
    const titulo = document.createElement('h3');
    titulo.className = 'text-xl md:text-2xl text-center font-bold mb-6';
    titulo.textContent = 'Pronóstico 5 días';

    // Contenedor de tarjetas
    const containerTarjetas = document.createElement('div');
    containerTarjetas.className = 'flex flex-col md:flex-row gap-3 md:gap-4 overflow-x-auto pb-2';

    pronosticoDiario.forEach(dia => {
        const fecha = new Date(dia.dt_txt);
        const diaSemana = fecha.toLocaleDateString('es-MX', { weekday: 'short' });
        const fechaCompleta = fecha.toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'short'
        });
        const temp = Math.round(dia.main.temp);
        const icon = dia.weather[0].icon;
        const descripcion = dia.weather[0].description;

        // Tarjeta del día
        const tarjeta = document.createElement('div');
        tarjeta.className = 'flex md:flex-col items-center md:items-stretch bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 md:p-3 md:flex-1 md:min-w-0 gap-4 md:gap-0';

        // Sección de fecha
        const seccionFecha = document.createElement('div');
        seccionFecha.className = 'flex md:flex-col md:text-center flex-1 md:flex-none';

        const divFecha = document.createElement('div');
        divFecha.className = 'flex-1 md:flex-none';

        const pDiaSemana = document.createElement('p');
        pDiaSemana.className = 'font-bold text-lg md:text-base capitalize';
        pDiaSemana.textContent = diaSemana;

        const pFechaCompleta = document.createElement('p');
        pFechaCompleta.className = 'text-xs text-gray-500 mt-1';
        pFechaCompleta.textContent = fechaCompleta;

        divFecha.appendChild(pDiaSemana);
        divFecha.appendChild(pFechaCompleta);
        seccionFecha.appendChild(divFecha);

        // Sección de icono
        const seccionIcono = document.createElement('div');
        seccionIcono.className = 'flex items-center justify-center md:my-2';

        const imgIcono = document.createElement('img');
        imgIcono.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        imgIcono.alt = descripcion;
        imgIcono.className = 'w-16 h-16 md:w-20 md:h-20 md:mx-auto';

        seccionIcono.appendChild(imgIcono);

        // Sección de temperatura y descripción
        const seccionTemp = document.createElement('div');
        seccionTemp.className = 'flex md:flex-col items-center md:items-stretch text-right md:text-center gap-2 md:gap-1';

        const divTemp = document.createElement('div');
        divTemp.className = 'md:mb-1';

        const pTemp = document.createElement('p');
        pTemp.className = 'text-2xl md:text-xl font-bold text-gray-800';
        pTemp.textContent = `${temp}°C`;

        divTemp.appendChild(pTemp);

        const pDescripcion = document.createElement('p');
        pDescripcion.className = 'text-sm md:text-xs text-gray-600 capitalize md:mt-2 max-w-[120px] md:max-w-none';
        pDescripcion.textContent = descripcion;

        seccionTemp.appendChild(divTemp);
        seccionTemp.appendChild(pDescripcion);

        // Ensamblar tarjeta
        tarjeta.appendChild(seccionFecha);
        tarjeta.appendChild(seccionIcono);
        tarjeta.appendChild(seccionTemp);

        containerTarjetas.appendChild(tarjeta);
    });

    contenedorForecast.appendChild(titulo);
    contenedorForecast.appendChild(containerTarjetas);
}

export function mostrarCiudadesRecientes() {
    const contenedor = document.getElementById("ciudades-recientes");
    const ciudades = obtenerCiudades();

    if (!ciudades.length) {
        const mensaje = document.createElement('p');
        mensaje.className = 'text-gray-500';
        mensaje.textContent = 'No hay búsquedas recientes';
        contenedor.innerHTML = '';
        contenedor.appendChild(mensaje);
        return;
    }

    contenedor.innerHTML = '';

    ciudades.forEach(ciudad => {
        const btn = document.createElement('button');
        btn.className = 'w-full text-center p-3 m-7 bg-white rounded-lg hover:bg-blue-50 shadow-md shadow-blue-900 transition';
        btn.dataset.lat = ciudad.lat;
        btn.dataset.lon = ciudad.lon;
        btn.dataset.nombre = ciudad.nombre;

        const p = document.createElement('p');
        p.className = 'font-semibold';
        p.textContent = ciudad.nombre;

        btn.appendChild(p);

        btn.addEventListener('click', () => {
            const lat = parseFloat(btn.dataset.lat);
            const lon = parseFloat(btn.dataset.lon);
            const nombre = btn.dataset.nombre;

            const params = new URLSearchParams({
                lat: lat,
                lon: lon,
                nombre: nombre
            });

            window.location.href = `./views/search_city.html?${params.toString()}`;
        });

        contenedor.appendChild(btn);
    });
}