export function recomendacion(temp, clima) {

    clima = clima.toLowerCase();

    if (clima.includes("lluvia") || clima.includes("rain")) {
        return "Ideal para visitar museos, galerías o tomar un café acogedor";
    }

    if (clima.includes("nieve") || clima.includes("snow")) {
        return "Perfecto para hacer un muñeco de nieve o disfrutar bebidas calientes";
    }

    if (clima.includes("tormenta") || clima.includes("thunder")) {
        return "Mejor quedarse en interiores y disfrutar una película";
    }

    if (clima.includes("niebla") || clima.includes("fog") || clima.includes("mist")) {
        return "Ideal para fotos atmosféricas, pero conduce con precaución";
    }

    if (temp >= 35) {
        return "Mucho calor, mantente hidratado y busca sombra";
    }

    if (temp >= 30) {
        return "Perfecto para la playa o piscina";
    }

    if (temp >= 20 && temp < 30) {
        return "Excelente clima para pasear por parques o hacer turismo";
    }

    if (temp >= 10 && temp < 20) {
        return "Clima fresco, ideal para caminar o andar en bicicleta";
    }

    if (temp >= 0 && temp < 10) {
        return "Hace frío, abrígate y disfruta lugares cerrados";
    }

    if (temp < 0) {
        return "Temperaturas bajo cero, evita exposición prolongada al exterior";
    }

    if (clima.includes("nubes") || clima.includes("cloud")) {
        return "Buen día para explorar la ciudad sin tanto sol";
    }

    return "Buen clima para disfrutar el día";
}
