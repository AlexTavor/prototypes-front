import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import App from "../App";
import { theme, GlobalStyle } from "../styles";
import { server } from "../mocks/server";
import { mockPrototypes, mockComments, mockAboutData } from "../mocks/data";
import { http, HttpResponse } from "msw";

const renderWithTheme = (ui: React.ReactElement) => {
    return render(
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            {ui}
        </ThemeProvider>
    );
};

describe("App Integration Test", () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    beforeEach(() => {
        server.use(
            http.get(`${BASE_URL}/api/user`, () => {
                return new HttpResponse(null, { status: 401 });
            }),
            http.get(`${BASE_URL}/api/prototypes`, () => {
                return HttpResponse.json(mockPrototypes);
            }),
            http.get(`${BASE_URL}/api/prototypes/:prototypeId/comments`, () => {
                return HttpResponse.json(mockComments);
            }),
            http.get("/about.json", () => {
                return HttpResponse.json(mockAboutData);
            })
        );
    });

    afterEach(() => {
        server.resetHandlers();
    });

    it("renders the main layout and content", async () => {
        renderWithTheme(<App />);

        // Wait for the "About" heading
        expect(
            await screen.findByRole("heading", { name: /About The Developer/i })
        ).toBeInTheDocument();

        // Check the "Prototypes" heading
        expect(
            await screen.findByRole("heading", { name: /Prototypes/i })
        ).toBeInTheDocument();

        // Check for the "Login" button
        expect(
            await screen.findByRole("link", { name: /Login/i })
        ).toBeInTheDocument();

        // Wait for the prototype data
        expect(
            await screen.findByText("Mocked Prototype 1")
        ).toBeInTheDocument();
        expect(
            await screen.findByText("A cool project about futuristic things.")
        ).toBeInTheDocument();
    });
});
