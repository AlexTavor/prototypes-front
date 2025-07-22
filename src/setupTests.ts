//import "cross-fetch/polyfill";
import "@testing-library/jest-dom";
import { server } from "./mocks/server";

// MSW setup is the same
beforeAll(() => {
    vi.stubEnv("VITE_BASE_URL", "http://localhost:8080");
    vi.stubEnv("VITE_ADMIN_EMAIL", "admin@example.com");
    server.listen();
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
