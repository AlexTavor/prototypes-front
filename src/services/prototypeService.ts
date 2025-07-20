import type { Prototype } from "../types";

const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}/api/prototypes`;

/**
 * Fetches the list of game prototypes from the server.
 */
export async function fetchPrototypes(): Promise<Prototype[]> {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
        throw new Error("Failed to fetch prototypes.");
    }
    return response.json();
}

/**
 * Saves a prototype (creates a new one or updates an existing one).
 * @param prototype The prototype data to save.
 */
export async function savePrototype(
    prototype: Omit<Prototype, "id"> & { id?: number }
): Promise<Prototype> {
    const isUpdating = prototype.id != null;
    const url = isUpdating ? `${API_BASE_URL}/${prototype.id}` : API_BASE_URL;
    const method = isUpdating ? "PUT" : "POST";

    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(prototype),
        credentials: "include", // Important for sending session cookies
    });

    if (!response.ok) {
        throw new Error("Failed to save prototype.");
    }
    return response.json();
}

/**
 * Deletes a prototype by its ID.
 * @param id The ID of the prototype to delete.
 */
export async function deletePrototype(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to delete prototype.");
    }
}
