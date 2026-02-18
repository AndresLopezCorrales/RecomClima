import { obtenerFavoritos, eliminarFavorito } from "../storage/storage_favorites.js";

function mostrarFavoritos() {
    const contenedor = document.getElementById("lista-favoritos");
    const favoritos = obtenerFavoritos();

    if (!favoritos.length) {
        contenedor.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-gray-500 text-lg mb-4">No tienes favoritos guardados</p>
                <p class="text-gray-400">Busca una ciudad y agrégala a favoritos con la ♥</p>
            </div>
        `;
        return;
    }

    contenedor.innerHTML = '';

    favoritos.forEach(ciudad => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-6 flex flex-col items-center text-center w-72';

        const header = document.createElement('div');
        header.className = 'flex items-center justify-between w-full mb-4';

        const btnEliminar = document.createElement('button');
        btnEliminar.className = 'text-red-500 hover:text-red-700 transition';
        btnEliminar.textContent = '✕';
        btnEliminar.title = 'Eliminar';
        btnEliminar.dataset.nombre = ciudad.nombre;
        btnEliminar.addEventListener('click', function () {
            eliminarFav(this);
        });

        header.appendChild(btnEliminar);

        const btnVerClima = document.createElement('button');
        btnVerClima.className = 'flex flex-col items-center gap-2';
        btnVerClima.dataset.lat = ciudad.lat;
        btnVerClima.dataset.lon = ciudad.lon;
        btnVerClima.dataset.nombre = ciudad.nombre;
        btnVerClima.addEventListener('click', function () {
            verClima(this);
        });

        const titulo = document.createElement('h3');
        titulo.className = 'font-bold text-xl text-gray-800 hover:text-blue-600 transition';
        titulo.textContent = ciudad.nombre;

        const texto = document.createElement('span');
        texto.className = 'text-sm text-gray-500';
        texto.textContent = 'Ver clima →';

        btnVerClima.appendChild(titulo);
        btnVerClima.appendChild(texto);

        card.appendChild(header);
        card.appendChild(btnVerClima);

        contenedor.appendChild(card);
    });
}

function eliminarFav(btn) {
    const nombre = btn.dataset.nombre;

    const card = btn.closest('.bg-white');
    card.classList.add('opacity-50', 'scale-95', 'transition-all', 'duration-300');

    setTimeout(() => {
        if (confirm(`¿Eliminar "${nombre}" de favoritos?`)) {
            eliminarFavorito(nombre);
            mostrarFavoritos();
        } else {
            card.classList.remove('opacity-50', 'scale-95');
        }
    }, 200);
}

function verClima(btn) {
    const lat = btn.dataset.lat;
    const lon = btn.dataset.lon;
    const nombre = btn.dataset.nombre;

    const params = new URLSearchParams({
        lat: lat,
        lon: lon,
        nombre: nombre
    });

    window.location.href = `../views/search_city.html?${params.toString()}`;
}

document.addEventListener('DOMContentLoaded', mostrarFavoritos);