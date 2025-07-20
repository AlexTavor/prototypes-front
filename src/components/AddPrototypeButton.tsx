import { useState } from "react";
import styled from "styled-components";
import { EditPrototypeModal } from "./EditPrototypeModal";
import type { Prototype } from "../types";
import { useIsAdmin } from "../hooks/useIsAdmin";
import { usePrototypes } from "../context/PrototypeContext";

// --- Styled Components ---
const StyledButton = styled.button`
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 9999px;
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    font-size: 2rem;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transition: background-color 0.2s ease, transform 0.2s ease;

    &:hover {
        background-color: ${({ theme }) => theme.colors.primaryHover};
        transform: scale(1.1);
    }
`;

// --- Component ---
export function AddPrototypeButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { prototypes, addPrototype } = usePrototypes();
    const isAdmin = useIsAdmin();

    const handleSave = async (prototype: Omit<Prototype, "id">) => {
        await addPrototype(prototype);
        setIsModalOpen(false);
    };

    if (!isAdmin) {
        return null;
    }

    return (
        <>
            <StyledButton
                onClick={() => setIsModalOpen(true)}
                title="Add New Prototype"
            >
                +
            </StyledButton>

            {isModalOpen && (
                <EditPrototypeModal
                    prototypeToEdit={null}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    existingTitles={prototypes.map((p) => p.title)}
                />
            )}
        </>
    );
}
