import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import App from "../App";
import { theme, GlobalStyle } from "../styles";
import { mockPrototypes, mockUser, mockComments } from "../mocks/data";
import { useUser } from "../hooks/useUser";
import { useIsAdmin } from "../hooks/useIsAdmin";
import type { Comment } from "../types/index";

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

describe("Logged-in User (Non-Admin) Flow", () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    let currentComments: Comment[];

    beforeEach(() => {
        // Stateful mock for comments
        currentComments = JSON.parse(JSON.stringify(mockComments));

        mockedUseUser.mockReturnValue({ user: mockUser, isLoading: false });
        mockedUseIsAdmin.mockReturnValue(false);

        server.use(
            http.get(`${BASE_URL}/api/user`, () => HttpResponse.json(mockUser)),
            http.get(`${BASE_URL}/api/prototypes`, () =>
                HttpResponse.json(mockPrototypes)
            ),

            http.get(`${BASE_URL}/api/prototypes/:prototypeId/comments`, () => {
                return HttpResponse.json(currentComments);
            }),

            http.put(
                `${BASE_URL}/api/comments/:commentId`,
                async ({ request, params }) => {
                    const { commentId } = params;
                    const { content } = (await request.json()) as {
                        content: string;
                    };

                    let updatedComment: Comment | undefined;

                    currentComments = currentComments.map((comment) => {
                        if (comment.id === Number(commentId)) {
                            updatedComment = { ...comment, content };
                            return updatedComment;
                        }
                        return comment;
                    });

                    return HttpResponse.json(updatedComment);
                }
            )
        );
    });

    afterEach(() => {
        server.resetHandlers();
        vi.clearAllMocks();
    });

    it("shows user info, logout button, but no admin controls", async () => {
        renderWithTheme(<App />);

        expect(await screen.findByText(/Logout/i)).toBeInTheDocument();
        expect(screen.getByAltText(mockUser.name)).toHaveAttribute(
            "src",
            mockUser.picture
        );
        expect(
            screen.queryByRole("link", { name: /Login/i })
        ).not.toBeInTheDocument();
        expect(
            screen.queryByTitle(/Add New Prototype/i)
        ).not.toBeInTheDocument();

        await screen.findByText(mockPrototypes[0].title);
        expect(
            screen.queryByRole("button", { name: "Edit" })
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Delete" })
        ).not.toBeInTheDocument();
    });

    it("can edit their own comment but not others'", async () => {
        renderWithTheme(<App />);

        // ---- narrow the search area to the first prototype card ----
        const prototype1Card = (
            await screen.findByText(mockPrototypes[0].title)
        ).closest("div.sc-dntSTA") as HTMLElement;

        // ---------- own comment ----------
        const myCommentText = mockComments[0].content;
        const myCommentCard = (
            await within(prototype1Card).findByText(myCommentText)
        ).closest("div.sc-eVqvcJ") as HTMLElement;

        const editButton = within(myCommentCard).getByTitle(/Edit Comment/i);
        expect(editButton).toBeInTheDocument();

        // ---------- someone else’s comment ----------
        const otherCommentText = mockComments[1].content;
        const otherCommentCard = (
            await within(prototype1Card).findByText(otherCommentText)
        ).closest("div.sc-eVqvcJ") as HTMLElement;

        const noEditButton =
            within(otherCommentCard).queryByTitle(/Edit Comment/i);
        expect(noEditButton).not.toBeInTheDocument();
    });

    it("can successfully save an edited comment", async () => {
        renderWithTheme(<App />);
        const user = userEvent.setup();

        // ---- narrow the search area to the first prototype card ----
        const prototype1Card = (
            await screen.findByText(mockPrototypes[0].title)
        ).closest("div.sc-dntSTA") as HTMLElement;

        // ---------- own comment ----------
        const myCommentText = mockComments[0].content;
        const myCommentCard = (
            await within(prototype1Card).findByText(myCommentText)
        ).closest("div.sc-eVqvcJ") as HTMLElement;

        const editButton = within(myCommentCard).getByTitle(/Edit Comment/i);
        await user.click(editButton);

        const textarea = within(myCommentCard).getByRole("textbox");
        expect(textarea).toHaveValue(myCommentText);

        const editedText = "I have updated my comment.";
        await user.clear(textarea);
        await user.type(textarea, editedText);

        const saveButton = within(myCommentCard).getByRole("button", {
            name: /Save/i,
        });
        await user.click(saveButton);

        expect(
            await within(myCommentCard).findByText(editedText)
        ).toBeInTheDocument();
        expect(
            within(myCommentCard).queryByRole("textbox")
        ).not.toBeInTheDocument();
    });
});
