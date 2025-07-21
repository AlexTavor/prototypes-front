import {
    useState,
    useEffect,
    useCallback,
    createContext,
    type ReactNode,
    useContext,
} from "react";
import {
    getCommentsForPrototype,
    createComment,
    updateComment,
    deleteComment,
} from "../services/commentService";
import type { Comment } from "../types";

interface CommentsContextType {
    comments: Comment[];
    isLoading: boolean;
    error: string | null;
    addComment: (content: string) => Promise<void>;
    editComment: (commentId: number, content: string) => Promise<void>;
    removeComment: (commentId: number) => Promise<void>;
}

const CommentsContext = createContext<CommentsContextType | undefined>(
    undefined
);

interface CommentsProviderProps {
    children: ReactNode;
    prototypeId: number;
}

export function CommentsProvider({
    children,
    prototypeId,
}: CommentsProviderProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshComments = useCallback(async () => {
        try {
            // Fetch comments for the specific prototype ID
            const data = await getCommentsForPrototype(prototypeId);
            setComments(data);
            setError(null);
        } catch (err) {
            if (err instanceof Error) {
                setError(`Failed to load comments: ${err.message}`);
            }
        } finally {
            // Ensure loading is only set to false on initial load
            if (isLoading) {
                setIsLoading(false);
            }
        }
    }, [prototypeId, isLoading]);

    useEffect(() => {
        refreshComments();
    }, [refreshComments]);

    const addComment = async (content: string) => {
        await createComment(prototypeId, content);
        await refreshComments();
    };

    const editComment = async (commentId: number, content: string) => {
        await updateComment(commentId, content);
        await refreshComments();
    };

    const removeComment = async (commentId: number) => {
        await deleteComment(commentId);
        await refreshComments();
    };

    const value = {
        comments,
        isLoading,
        error,
        addComment,
        editComment,
        removeComment,
    };

    return (
        <CommentsContext.Provider value={value}>
            {children}
        </CommentsContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useComments() {
    const context = useContext(CommentsContext);
    if (context === undefined) {
        throw new Error("useComments must be used within a CommentsProvider");
    }
    return context;
}
