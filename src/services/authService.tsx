const BASE_URL = import.meta.env.VITE_BASE_URL;

export function getLoginUrl(): string {
    return `${BASE_URL}/oauth2/authorization/google`;
}

export async function logout() {
    const response = await fetch(`${BASE_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Logout failed.");
    }

    window.location.reload();
}

/**
 * Fetches the current user's data
 * @return A promise that resolves to the user data.
 * @throws Will throw an error if the user is not authenticated.
 */
export async function getUser() {
    const response = await fetch(`${BASE_URL}/api/user`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("User not authenticated");
    }
    return response.json();
}
