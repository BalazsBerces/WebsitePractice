const API_URL = "http://localhost:8080";

export async function request(url, options = {}) {
    const response = await fetch(API_URL + url, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        },
        ...options
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP error: ${response.status}`);
    }

    const text = await response.text();

    return text ? JSON.parse(text) : null;
}