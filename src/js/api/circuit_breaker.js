import { noInternet } from "../UI/show_weather.js";

class CircuitBreaker {
    constructor(maxFailures = 3, resetTimeout = 15000) {
        this.failureCount = 0;
        this.circuitOpen = false;
        this.nextTry = null;
        this.halfOpen = false;
        this.maxFailures = maxFailures;
        this.resetTimeout = resetTimeout;
    }

    isOpen() {
        if (this.circuitOpen) {
            if (Date.now() > this.nextTry) {
                this.halfOpen = true;
                this.circuitOpen = false;
            } else {
                return true;
            }
        }
        return false;
    }

    onSuccess() {
        this.failureCount = 0;
        this.circuitOpen = false;
        this.halfOpen = false;
    }

    onFailure() {
        this.failureCount++;
        this.halfOpen = false;

        if (this.failureCount >= this.maxFailures) {
            this.circuitOpen = true;
            this.nextTry = Date.now() + this.resetTimeout;
            console.warn("Circuit breaker abierto por 15 segundos");
        }
    }
}

export const weatherBreaker = new CircuitBreaker();
export const geoBreaker = new CircuitBreaker();
export const forecastBreaker = new CircuitBreaker();

function isOfflineError(error) {
    return (
        !navigator.onLine ||
        error instanceof TypeError && (
            error.message === "Failed to fetch" ||
            error.message === "Network request failed" ||
            error.message.includes("NetworkError")
        )
    );
}

function forzarPantallaSinConexion() {
    noInternet();
}

export async function fetchWithRetry(url, options = {}, retries = 2) {
    for (let i = 0; i <= retries; i++) {
        try {
            if (!navigator.onLine) {
                forzarPantallaSinConexion();
                throw new Error("Sin conexión a internet");

            }

            const response = await fetch(url, options);

            if (response.status >= 400 && response.status < 500) {
                throw new Error(`Error del cliente: ${response.status}`);
            }

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            return response;

        } catch (error) {
            if (isOfflineError(error)) {
                forzarPantallaSinConexion();
                throw error;
            }

            const isClientError = error.message.startsWith("Error del cliente");
            if (i === retries || isClientError) throw error;

            await new Promise(res => setTimeout(res, 500 * (i + 1)));
        }
    }
}

export async function fetchWithCircuitBreaker(url, options = {}, breaker = weatherBreaker) {
    if (!navigator.onLine) {
        forzarPantallaSinConexion();
        throw new Error("Sin conexión a internet");
    }

    if (breaker.isOpen()) {
        throw new Error("Servicio temporalmente no disponible. Intenta en unos segundos.");
    }

    try {
        const response = await fetchWithRetry(url, options);
        breaker.onSuccess();
        return response;

    } catch (error) {
        if (!isOfflineError(error)) {
            breaker.onFailure();
        }
        throw error;
    }
}