import type { AboutData } from "../types";

const API_URL = "/about.json";

/**
 * Fetches the about data from the server.
 * @returns A promise that resolves to an AboutData object.
 * @throws Will throw an error if the network response is not ok.
 */
export async function fetchAboutData(): Promise<AboutData> {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error("Failed to fetch about data.");
    }
    return await response.json();
}
