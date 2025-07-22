import { render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { http, HttpResponse } from "msw";
import App from "../App";
import { mockPrototypes, mockComments, mockAboutData } from "../mocks/data";
import { getLoginUrl } from "../services/authService";
import { theme, GlobalStyle } from "../styles";
import { server } from "../mocks/server";

// --- Test Utilities ---
const renderWithTheme = (ui: React.ReactElement) => {
    return render(
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            {ui}
        </ThemeProvider>
    );
};

// --- Test Suite ---
describe("Guest User Flow", () => {
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

    it("should display public content and a login button", async () => {
        renderWithTheme(<App />);

        // Check for public content
        expect(
            await screen.findByRole("heading", { name: /About The Developer/i })
        ).toBeInTheDocument();
        expect(
            await screen.findByRole("heading", { name: /Prototypes/i })
        ).toBeInTheDocument();
        expect(
            await screen.findByText(mockPrototypes[0].title)
        ).toBeInTheDocument();

        // The login button should be visible and have the correct link
        const loginButton = await screen.findByRole("link", { name: /Login/i });
        expect(loginButton).toBeInTheDocument();
        expect(loginButton).toHaveAttribute("href", getLoginUrl());
    });

    it("should not display admin or user-specific controls", async () => {
        renderWithTheme(<App />);

        // Wait for content to ensure the page has loaded
        await screen.findByText(mockPrototypes[0].title);

        // Admin-only buttons should NOT be present
        expect(
            screen.queryByRole("button", { name: /Add New Prototype/i })
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /Edit/i })
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /Delete/i })
        ).not.toBeInTheDocument();

        // Commenting features for logged-in users should NOT be present
        expect(
            screen.queryByRole("button", { name: /\+ Add Comment/i })
        ).not.toBeInTheDocument();

        // Find the first prototype card to check its contents
        const prototypeCard = screen
            .getByText(mockPrototypes[0].title)
            .closest("div");

        // Ensure the edit button for comments is not there
        const commentEditButton = within(prototypeCard!).queryByTitle(
            /Edit Comment/i
        );
        expect(commentEditButton).not.toBeInTheDocument();
    });

    it("should allow guests to view prototypes and comments", async () => {
        renderWithTheme(<App />);

        // Find the specific prototype card by its unique title first
        const prototype1Card = (
            await screen.findByText(mockPrototypes[0].title)
        ).closest("div.sc-dntSTA") as HTMLElement;

        // Search for elements within that specific card
        expect(
            within(prototype1Card!).getByText(mockPrototypes[0].description)
        ).toBeInTheDocument();

        expect(
            await within(prototype1Card!).findByText(mockComments[0].content)
        ).toBeInTheDocument();
        expect(
            within(prototype1Card!).getByText(mockComments[0].authorName)
        ).toBeInTheDocument();
    });

    it("should provide functional public links for prototypes", async () => {
        renderWithTheme(<App />);

        const prototype1Card = (
            await screen.findByText(mockPrototypes[0].title)
        ).closest("div.sc-dntSTA") as HTMLElement;

        const playLink = within(prototype1Card).getByRole("link", {
            name: /Play Now/i,
        });
        expect(playLink).toBeInTheDocument();
        expect(playLink).toHaveAttribute("href", mockPrototypes[0].playUrl);

        // And do the same for the other link to be safe
        const sourceLink = within(prototype1Card).getByRole("link", {
            name: /View Source/i,
        });
        expect(sourceLink).toBeInTheDocument();
        expect(sourceLink).toHaveAttribute("href", mockPrototypes[0].githubUrl);
    });
});
