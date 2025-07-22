import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import { http, HttpResponse } from "msw";
import { vi } from "vitest";
import App from "../App";
import { server } from "../mocks/server";
import { theme, GlobalStyle } from "../styles";
import { useUser } from "../hooks/useUser";
import { useIsAdmin } from "../hooks/useIsAdmin";
import { mockPrototypes, mockAdmin, mockComments } from "../mocks/data";
import type { Prototype } from "../types";

vi.mock("../hooks/useUser");
vi.mock("../hooks/useIsAdmin");

const mockedUseUser = vi.mocked(useUser);
const mockedUseIsAdmin = vi.mocked(useIsAdmin);

const renderWithTheme = (ui: React.ReactElement) => {
    return render(
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            {ui}
        </ThemeProvider>
    );
};

describe("Admin Prototypes Flow", () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    let currentPrototypes: Prototype[];

    beforeEach(() => {
        // Create a deep copy to reset state before each test
        currentPrototypes = JSON.parse(JSON.stringify(mockPrototypes));

        // Set the hook return values for an ADMIN user
        mockedUseUser.mockReturnValue({ user: mockAdmin, isLoading: false });
        mockedUseIsAdmin.mockReturnValue(true);

        // --- MSW Handlers ---
        server.use(
            // Auth
            http.get(`${BASE_URL}/api/user`, () =>
                HttpResponse.json(mockAdmin)
            ),

            // Prototypes (Stateful)
            http.get(`${BASE_URL}/api/prototypes`, () => {
                return HttpResponse.json(currentPrototypes);
            }),
            http.post(`${BASE_URL}/api/prototypes`, async ({ request }) => {
                const newPrototype = (await request.json()) as Prototype;
                newPrototype.id = Math.floor(Math.random() * 1000);
                currentPrototypes.push(newPrototype);
                return HttpResponse.json(newPrototype, { status: 201 });
            }),
            http.put(`${BASE_URL}/api/prototypes/:id`, async ({ request }) => {
                const updatedPrototype = (await request.json()) as Prototype;
                currentPrototypes = currentPrototypes.map((p) =>
                    p.id === updatedPrototype.id ? updatedPrototype : p
                );
                return HttpResponse.json(updatedPrototype, { status: 200 });
            }),
            http.delete(`${BASE_URL}/api/prototypes/:id`, ({ params }) => {
                currentPrototypes = currentPrototypes.filter(
                    (p) => p.id !== Number(params.id)
                );
                return new HttpResponse(null, { status: 204 });
            }),

            // Comments (Static - not the focus of this test file)
            http.get(`${BASE_URL}/api/prototypes/:prototypeId/comments`, () => {
                return HttpResponse.json(mockComments);
            })
        );
    });

    afterEach(() => {
        server.resetHandlers();
        vi.clearAllMocks();
    });

    it("should display admin controls for prototypes", async () => {
        renderWithTheme(<App />);
        expect(
            await screen.findByTitle("Add New Prototype")
        ).toBeInTheDocument();
        const prototypeCard = (
            await screen.findByText(mockPrototypes[0].title)
        ).closest("div");
        expect(
            within(prototypeCard!).getByRole("button", { name: /Edit/i })
        ).toBeInTheDocument();
        expect(
            within(prototypeCard!).getByRole("button", { name: /Delete/i })
        ).toBeInTheDocument();
    });

    it("can add a new prototype", async () => {
        const user = userEvent.setup();
        renderWithTheme(<App />);

        await user.click(await screen.findByTitle("Add New Prototype"));

        const modal = await screen.findByRole("dialog");
        expect(
            within(modal).getByRole("heading", { name: /Add New Prototype/i })
        ).toBeInTheDocument();

        await user.type(
            within(modal).getByPlaceholderText("Title"),
            "A Brand New Prototype"
        );
        await user.type(
            within(modal).getByPlaceholderText("Description"),
            "This was added from a test."
        );

        await user.click(within(modal).getByRole("button", { name: /Save/i }));

        expect(
            await screen.findByText("A Brand New Prototype")
        ).toBeInTheDocument();
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("can edit an existing prototype", async () => {
        const user = userEvent.setup();
        renderWithTheme(<App />);

        const prototypeCard = (
            await screen.findByText(mockPrototypes[0].title)
        ).closest("div");
        await user.click(
            within(prototypeCard!).getByRole("button", { name: /Edit/i })
        );

        const modal = await screen.findByRole("dialog");
        expect(
            within(modal).getByRole("heading", { name: /Edit Prototype/i })
        ).toBeInTheDocument();

        const titleInput = within(modal).getByPlaceholderText("Title");
        await user.clear(titleInput);
        await user.type(titleInput, "Edited Prototype Title");

        await user.click(within(modal).getByRole("button", { name: /Save/i }));

        expect(
            await screen.findByText("Edited Prototype Title")
        ).toBeInTheDocument();
        expect(
            screen.queryByText(mockPrototypes[0].title)
        ).not.toBeInTheDocument();
    });

    it("can delete a prototype", async () => {
        const user = userEvent.setup();
        vi.spyOn(window, "confirm").mockImplementation(() => true);

        renderWithTheme(<App />);

        const prototypeTitle = mockPrototypes[0].title;
        const prototypeCard = (await screen.findByText(prototypeTitle)).closest(
            "div"
        );
        await user.click(
            within(prototypeCard!).getByRole("button", { name: /Delete/i })
        );

        expect(window.confirm).toHaveBeenCalledWith(
            `Are you sure you want to delete the prototype "${prototypeTitle}"?`
        );

        await waitFor(() => {
            expect(screen.queryByText(prototypeTitle)).not.toBeInTheDocument();
        });
    });
});
