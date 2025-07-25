import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/setupTests.ts",
        env: {
            VITE_BASE_URL: "http://localhost:8080",
            VITE_ADMIN_EMAIL: "admin@example.com",
        },
    },
});

