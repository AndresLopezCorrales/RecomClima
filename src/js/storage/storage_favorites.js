const FAVORITES_KEY = "ciudades_favoritas";

export function guardarFavorito(nombre, lat, lon) {
    let favoritos = obtenerFavoritos();

    //Evitar duplicados
    const existe = favoritos.find(f =>
        f.nombre === nombre || (f.lat === lat && f.lon === lon)
    );

    if (existe) {
        return false;
    }

    // Agregar nuevo favorito
    favoritos.push({
        nombre,
        lat,
        lon,
        fecha: new Date().toISOString()
    });

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritos));
    return true;
}

export function eliminarFavorito(nombre) {
    let favoritos = obtenerFavoritos();
    favoritos = favoritos.filter(f => f.nombre !== nombre);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritos));
}

export function esFavorito(nombre) {
    const favoritos = obtenerFavoritos();
    return favoritos.some(f => f.nombre === nombre);
}

export function obtenerFavoritos() {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
}

export function limpiarFavoritos() {
    localStorage.removeItem(FAVORITES_KEY);
}