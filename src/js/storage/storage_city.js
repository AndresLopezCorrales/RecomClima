const STORAGE_KEY = "ciudades_recientes";
const MAX_CIUDADES = 3;

export function guardarCiudad(nombre, lat, lon) {
    let ciudades = obtenerCiudades();

    // Evitar duplicados
    const existe = ciudades.find(c =>
        c.nombre === nombre || (c.lat === lat && c.lon === lon)
    );

    if (existe) {
        // Mover al inicio si ya existe
        ciudades = ciudades.filter(c => c.nombre !== nombre);
    }

    // Agregar al inicio
    ciudades.unshift({
        nombre,
        lat,
        lon,
        fecha: new Date().toISOString()
    });

    // Mantener solo las últimas 3
    ciudades = ciudades.slice(0, MAX_CIUDADES);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(ciudades));
}

export function obtenerCiudades() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

export function limpiarCiudades() {
    localStorage.removeItem(STORAGE_KEY);
}