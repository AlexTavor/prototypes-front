import { useState, useEffect } from "react";
import styled from "styled-components";
import type { Prototype } from "../types";

// --- Props Definition ---
interface EditPrototypeModalProps {
    // The prototype to edit, or null if creating a new one
    prototypeToEdit: Prototype | null;
    onClose: () => void;
    onSave: (prototype: Prototype | Omit<Prototype, "id">) => void;
    existingTitles: string[]; // Pass all other titles for duplicate check
}

// --- Styled Components ---

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background-color: ${({ theme }) => theme.colors.surface};
    padding: 2rem;
    border-radius: 0.5rem;
    width: 90%;
    max-width: 40rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const TextArea = styled.textarea`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textMain};
    border-radius: 0.375rem;
    min-height: 4rem;
    resize: vertical;
    font-family: inherit;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
`;

const Button = styled.button`
    padding: 0.75rem 1.5rem;
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
        &:disabled {
            background-color: ${({ theme }) => theme.colors.secondary};
            cursor: not-allowed;
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

const ErrorMessage = styled.p`
    color: #ef4444; /* red-500 */
    font-size: 0.875rem;
    margin: -1rem 0 0 0.25rem;
`;

// --- Component ---

export function EditPrototypeModal({
    prototypeToEdit,
    onClose,
    onSave,
    existingTitles,
}: EditPrototypeModalProps) {
    const [formData, setFormData] = useState<Omit<Prototype, "id">>({
        title: "",
        description: "",
        imageUrl: "",
        playUrl: "",
        githubUrl: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Populate form if we are editing an existing prototype
    useEffect(() => {
        if (prototypeToEdit) {
            setFormData({
                title: prototypeToEdit.title,
                description: prototypeToEdit.description,
                imageUrl: prototypeToEdit.imageUrl,
                playUrl: prototypeToEdit.playUrl,
                githubUrl: prototypeToEdit.githubUrl,
            });
        }
    }, [prototypeToEdit]);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        // Title validation
        if (!formData.title) {
            newErrors.title = "Title cannot be empty.";
        } else if (formData.title.length > 255) {
            newErrors.title = "Title cannot exceed 255 characters.";
        } else {
            const otherTitles = prototypeToEdit
                ? existingTitles.filter((t) => t !== prototypeToEdit.title)
                : existingTitles;
            if (otherTitles.includes(formData.title)) {
                newErrors.title = "This title already exists.";
            }
        }

        // Description validation
        if (formData.description.length > 255) {
            newErrors.description = "Description cannot exceed 255 characters.";
        }

        // URL validations
        if (formData.imageUrl.length > 255) {
            newErrors.imageUrl = "Image URL cannot exceed 255 characters.";
        }
        if (formData.playUrl && !formData.playUrl.startsWith("http")) {
            newErrors.playUrl = "URL must start with http.";
        } else if (formData.playUrl.length > 255) {
            newErrors.playUrl = "Play URL cannot exceed 255 characters.";
        }
        if (formData.githubUrl && !formData.githubUrl.startsWith("http")) {
            newErrors.githubUrl = "URL must start with http.";
        } else if (formData.githubUrl.length > 255) {
            newErrors.githubUrl = "GitHub URL cannot exceed 255 characters.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave(
                prototypeToEdit
                    ? { id: prototypeToEdit.id, ...formData }
                    : formData
            );
        }
    };

    return (
        <ModalOverlay role="dialog">
            <ModalContent>
                <h2>
                    {prototypeToEdit ? "Edit Prototype" : "Add New Prototype"}
                </h2>
                <Form onSubmit={handleSubmit}>
                    <TextArea
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Title"
                        maxLength={255}
                    />
                    {errors.title && (
                        <ErrorMessage>{errors.title}</ErrorMessage>
                    )}

                    <TextArea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description"
                        maxLength={255}
                    />
                    {errors.description && (
                        <ErrorMessage>{errors.description}</ErrorMessage>
                    )}

                    <TextArea
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="Image URL"
                        maxLength={255}
                    />
                    {errors.imageUrl && (
                        <ErrorMessage>{errors.imageUrl}</ErrorMessage>
                    )}
                    {formData.imageUrl && (
                        <img
                            src={formData.imageUrl}
                            alt="Preview"
                            width="100"
                        />
                    )}

                    <TextArea
                        name="playUrl"
                        value={formData.playUrl}
                        onChange={handleChange}
                        placeholder="Play URL"
                        maxLength={255}
                    />
                    {errors.playUrl && (
                        <ErrorMessage>{errors.playUrl}</ErrorMessage>
                    )}

                    <TextArea
                        name="githubUrl"
                        value={formData.githubUrl}
                        onChange={handleChange}
                        placeholder="GitHub URL"
                        maxLength={255}
                    />
                    {errors.githubUrl && (
                        <ErrorMessage>{errors.githubUrl}</ErrorMessage>
                    )}

                    <ButtonContainer>
                        <Button
                            type="button"
                            className="secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="primary">
                            Save
                        </Button>
                    </ButtonContainer>
                </Form>
            </ModalContent>
        </ModalOverlay>
    );
}
