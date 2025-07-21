// src/components/CommentCard.tsx
import { useState } from "react";
import styled from "styled-components";
import type { Comment } from "../types";
import { useUser } from "../hooks/useUser";
import { useIsAdmin } from "../hooks/useIsAdmin";
import { useComments } from "../context/CommentsContext";

// --- Styled Components ---

const CommentCardContainer = styled.div`
    background-color: ${({ theme }) => theme.colors.background};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 0.375rem;
    padding: 1rem 1.5rem;
`;

const CommentHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
`;

const AuthorInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

const AuthorAvatar = styled.img`
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    object-fit: cover;
`;

const AuthorName = styled.span`
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textMain};
`;

const EditButton = styled.button`
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: pointer;
    font-size: 1.25rem;
    padding: 0.25rem;
    line-height: 1;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

const CommentBody = styled.div`
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.6;
    white-space: pre-wrap; // Preserve line breaks
`;

const CommentTextarea = styled.textarea`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textMain};
    border-radius: 0.375rem;
    min-height: 5rem;
    resize: vertical;
    font-family: inherit;
    font-size: 1rem;
`;

const ActionsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 0.75rem;
`;

const ActionButton = styled.button`
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.375rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &.primary {
        background-color: ${({ theme }) => theme.colors.primary};
        color: white;
        &:hover {
            background-color: ${({ theme }) => theme.colors.primaryHover};
        }
    }

    &.secondary {
        background-color: ${({ theme }) => theme.colors.secondary};
        color: white;
        &:hover {
            background-color: ${({ theme }) => theme.colors.secondaryHover};
        }
    }
`;

// --- Component ---

interface CommentCardProps {
    comment: Comment;
}

export function CommentCard({ comment }: CommentCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

    const { user } = useUser();
    const isAdmin = useIsAdmin();
    const { editComment } = useComments();

    // A user can edit a comment if they are an admin, or if it's their own comment.
    const canEdit = isAdmin || (user && user.sub === comment.userId);

    const handleSave = async () => {
        if (editedContent.trim() && editedContent !== comment.content) {
            await editComment(comment.id, editedContent);
        }
        setIsEditing(false);
    };

    const handleAbort = () => {
        setEditedContent(comment.content);
        setIsEditing(false);
    };

    return (
        <CommentCardContainer>
            <CommentHeader>
                <AuthorInfo>
                    <AuthorAvatar
                        src={comment.authorAvatarUrl}
                        alt={comment.authorName}
                    />
                    <AuthorName>{comment.authorName}</AuthorName>
                </AuthorInfo>
                {canEdit && !isEditing && (
                    <EditButton
                        onClick={() => setIsEditing(true)}
                        title="Edit Comment"
                    >
                        🖊️
                    </EditButton>
                )}
            </CommentHeader>

            {isEditing ? (
                <>
                    <CommentTextarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        autoFocus
                    />
                    <ActionsContainer>
                        <ActionButton
                            className="secondary"
                            onClick={handleAbort}
                        >
                            Abort
                        </ActionButton>
                        <ActionButton className="primary" onClick={handleSave}>
                            Save
                        </ActionButton>
                    </ActionsContainer>
                </>
            ) : (
                <CommentBody>{comment.content}</CommentBody>
            )}
        </CommentCardContainer>
    );
}
