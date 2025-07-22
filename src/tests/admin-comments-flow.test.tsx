import { render, screen, within } from "@testing-library/react";
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
import type { Comment } from "../types";

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

describe("Admin Comments Flow", () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    let currentComments: Comment[];

    beforeEach(() => {
        // Create a deep copy to reset state before each test
        currentComments = JSON.parse(JSON.stringify(mockComments));

        // Set the hook return values for an ADMIN user
        mockedUseUser.mockReturnValue({ user: mockAdmin, isLoading: false });
        mockedUseIsAdmin.mockReturnValue(true);

        // --- MSW Handlers ---
        server.use(
            // Auth
            http.get(`${BASE_URL}/api/user`, () =>
                HttpResponse.json(mockAdmin)
            ),

            // Prototypes (Static - not the focus of this test file)
            http.get(`${BASE_URL}/api/prototypes`, () => {
                return HttpResponse.json(mockPrototypes);
            }),

            // Comments (Stateful)
            http.get(`${BASE_URL}/api/prototypes/:prototypeId/comments`, () => {
                return HttpResponse.json(currentComments);
            }),
            http.put(
                `${BASE_URL}/api/comments/:commentId`,
                async ({ request, params }) => {
                    const { content } = (await request.json()) as {
                        content: string;
                    };
                    let updatedComment: Comment | undefined;
                    currentComments = currentComments.map((c) => {
                        if (c.id === Number(params.commentId)) {
                            updatedComment = { ...c, content };
                            return updatedComment;
                        }
                        return c;
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

    it("can see edit buttons on all comments", async () => {
        renderWithTheme(<App />);
        const prototypeCard = (
            await screen.findByText(mockPrototypes[0].title)
        ).closest("div");

        // Find the comment cards within the prototype card by getting the parent of the text element
        const otherUserComment = (
            await within(prototypeCard!).findByText(mockComments[0].content)
        ).parentElement!;
        const adminUserComment = (
            await within(prototypeCard!).findByText(mockComments[1].content)
        ).parentElement!;

        // Verify edit button exists on another user's comment
        expect(
            within(otherUserComment).getByTitle(/Edit Comment/i)
        ).toBeInTheDocument();
        // Verify edit button exists on the admin's own comment
        expect(
            within(adminUserComment).getByTitle(/Edit Comment/i)
        ).toBeInTheDocument();
    });

    it("can successfully edit another user's comment", async () => {
        const user = userEvent.setup();
        renderWithTheme(<App />);

        const prototypeCard = (
            await screen.findByText(mockPrototypes[0].title)
        ).closest("div");
        const otherUserCommentCard = (
            await within(prototypeCard!).findByText(mockComments[0].content)
        ).parentElement!;

        await user.click(
            within(otherUserCommentCard).getByTitle(/Edit Comment/i)
        );

        const textarea = within(otherUserCommentCard).getByRole("textbox");
        const editedText = "Admin has edited this comment.";
        await user.clear(textarea);
        await user.type(textarea, editedText);

        await user.click(
            within(otherUserCommentCard).getByRole("button", { name: /Save/i })
        );

        // Assert that the new text is present and the textarea is gone
        expect(
            await within(otherUserCommentCard).findByText(editedText)
        ).toBeInTheDocument();
        expect(
            within(otherUserCommentCard).queryByRole("textbox")
        ).not.toBeInTheDocument();
    });
});
