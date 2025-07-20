import { useState } from "react";
import styled from "styled-components";
import type { Prototype } from "../types";
import { useIsAdmin } from "../hooks/useIsAdmin";
import { EditPrototypeModal } from "./EditPrototypeModal";
import {
    PrototypeCardContainer,
    PrototypeImage,
    CardBody,
    CardTitle,
    CardDescription,
    CardLinks,
    CardButton as OriginalCardButton,
} from "../styles";
import { usePrototypes } from "../context/PrototypeContext";

// --- Styled Components ---
const CardButton = styled(OriginalCardButton)``;

const AdminActionsContainer = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const AdminButton = styled.button`
    background-color: transparent;
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: ${({ theme }) => theme.colors.surface};
        color: ${({ theme }) => theme.colors.textMain};
        border-color: ${({ theme }) => theme.colors.textMuted};
    }
`;

// --- Utility ---
const isValidUrl = (url: string): boolean => {
    try {
        return !!url && url.startsWith("http");
    } catch (error) {
        return false;
    }
};

// --- Component ---
interface PrototypeCardProps {
    prototype: Prototype;
}

export function PrototypeCard({ prototype }: PrototypeCardProps) {
    const { title, description, imageUrl, playUrl, githubUrl } = prototype;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { prototypes, updatePrototype, removePrototype } = usePrototypes();
    const isAdmin = useIsAdmin(); // Use the new hook

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.style.display = "none";
    };

    const handleDelete = async () => {
        // Using window.confirm is discouraged. Replace with a proper modal dialog.
        if (
            window.confirm(
                `Are you sure you want to delete the prototype "${title}"?`
            )
        ) {
            await removePrototype(prototype.id!);
        }
    };

    const handleSave = async (
        prototypeToSave: Prototype | Omit<Prototype, "id">
    ) => {
        await updatePrototype(prototypeToSave as Prototype);
        setIsModalOpen(false);
    };

    return (
        <>
            <PrototypeCardContainer>
                {isValidUrl(imageUrl) && (
                    <PrototypeImage
                        src={imageUrl}
                        alt={`Screenshot of ${title}`}
                        onError={handleImageError}
                        loading="lazy"
                    />
                )}
                <CardBody>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                    <CardLinks>
                        {isValidUrl(playUrl) && (
                            <CardButton
                                href={playUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="primary"
                            >
                                Play Now 🚀
                            </CardButton>
                        )}
                        {isValidUrl(githubUrl) && (
                            <CardButton
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="secondary"
                            >
                                View Source
                            </CardButton>
                        )}
                    </CardLinks>

                    {isAdmin && (
                        <AdminActionsContainer>
                            <AdminButton onClick={() => setIsModalOpen(true)}>
                                Edit
                            </AdminButton>
                            <AdminButton onClick={handleDelete}>
                                Delete
                            </AdminButton>
                        </AdminActionsContainer>
                    )}
                </CardBody>
            </PrototypeCardContainer>

            {isModalOpen && (
                <EditPrototypeModal
                    prototypeToEdit={prototype}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    existingTitles={prototypes.map((p) => p.title)}
                />
            )}
        </>
    );
}
