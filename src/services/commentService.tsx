import type { Comment } from "../types";

const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Fetches all comments for a specific prototype.
 * @param prototypeId The ID of the prototype.
 * @returns A promise that resolves to an array of comments.
 */
export async function getCommentsForPrototype(
    prototypeId: number
): Promise<Comment[]> {
    const response = await fetch(
        `${BASE_URL}/api/prototypes/${prototypeId}/comments`
    );
    if (!response.ok) {
        throw new Error("Failed to fetch comments.");
    }
    return response.json();
}

/**
 * Creates a new comment for a prototype.
 * @param prototypeId The ID of the prototype.
 * @param content The content of the comment.
 */
export async function createComment(
    prototypeId: number,
    content: string
): Promise<void> {
    const response = await fetch(
        `${BASE_URL}/api/prototypes/${prototypeId}/comments`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
            credentials: "include",
        }
    );
    if (!response.ok) {
        throw new Error("Failed to create comment.");
    }
}

/**
 * Updates an existing comment. If content is empty, the comment is deleted.
 * @param commentId The ID of the comment to update.
 * @param content The new content for the comment.
 */
export async function updateComment(
    commentId: number,
    content: string
): Promise<void> {
    const response = await fetch(`${BASE_URL}/api/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Failed to update comment.");
    }
}

/**
 * Deletes a comment by its ID.
 * @param commentId The ID of the comment to delete.
 */
export async function deleteComment(commentId: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/api/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Failed to delete comment.");
    }
}
