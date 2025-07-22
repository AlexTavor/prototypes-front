import { useState } from "react";
import styled from "styled-components";
import { useComments } from "../context/CommentsContext";
import { useUser } from "../hooks/useUser";
import { CommentCard } from "./CommentCard";
import { getLoginUrl } from "../services/authService";

// --- Styled Components ---

const CommentsSectionContainer = styled.div`
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const SectionTitle = styled.h4`
    font-size: 1.25rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textMain};
    margin: 0 0 1.5rem 0;
`;

const CommentsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const StatusMessage = styled.div`
    color: ${({ theme }) => theme.colors.textMuted};
    text-align: center;
`;

const AddCommentContainer = styled.div`
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

const AddCommentButton = styled.button`
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: ${({ theme }) => theme.colors.primaryHover};
    }
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
    margin-bottom: 0.75rem;
`;

const ActionsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
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

export function CommentsList() {
    const { comments, isLoading, error, addComment } = useComments();
    const { user } = useUser();
    const [isAdding, setIsAdding] = useState(false);
    const [newCommentContent, setNewCommentContent] = useState("");

    const handleSaveNewComment = async () => {
        if (newCommentContent.trim()) {
            await addComment(newCommentContent);
            setNewCommentContent("");
            setIsAdding(false);
        }
    };

    const handleAbort = () => {
        setNewCommentContent("");
        setIsAdding(false);
    };

    const renderContent = () => {
        if (isLoading) {
            return <StatusMessage>Loading comments...</StatusMessage>;
        }
        if (error) {
            return <StatusMessage>{error}</StatusMessage>;
        }
        if (comments.length === 0) {
            return (
                <StatusMessage>No comments yet. Be the first!</StatusMessage>
            );
        }
        return (
            <CommentsContainer>
                {comments.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} />
                ))}
            </CommentsContainer>
        );
    };

    return (
        <CommentsSectionContainer>
            <SectionTitle>Comments</SectionTitle>
            {renderContent()}
            <AddCommentContainer>
                {isAdding ? (
                    <>
                        <CommentTextarea
                            placeholder="Write a comment..."
                            value={newCommentContent}
                            onChange={(e) =>
                                setNewCommentContent(e.target.value)
                            }
                            autoFocus
                        />
                        <ActionsContainer>
                            <ActionButton
                                className="secondary"
                                onClick={handleAbort}
                            >
                                Abort
                            </ActionButton>
                            <ActionButton
                                className="primary"
                                onClick={handleSaveNewComment}
                            >
                                Save
                            </ActionButton>
                        </ActionsContainer>
                    </>
                ) : (
                    <AddCommentButton
                        role={user ? "button" : "link"}
                        onClick={() =>
                            user
                                ? setIsAdding(true)
                                : (window.location.href = getLoginUrl())
                        }
                    >
                        {user ? "+ Add Comment" : "Login to comment"}
                    </AddCommentButton>
                )}
            </AddCommentContainer>
        </CommentsSectionContainer>
    );
}
