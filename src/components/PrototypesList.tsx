import { PrototypeCard } from "./PrototypeCard";
import { PrototypesListSection, SectionTitle, StatusMessage } from "../styles";
import { AddPrototypeButton } from "./AddPrototypeButton";
import { usePrototypes } from "../context/PrototypeContext";

export function PrototypesList() {
    const { prototypes, isLoading, error } = usePrototypes();

    if (isLoading) {
        return (
            <PrototypesListSection id="prototypes">
                <StatusMessage>Loading Prototypes...</StatusMessage>
            </PrototypesListSection>
        );
    }

    if (error) {
        return (
            <PrototypesListSection id="prototypes">
                <StatusMessage>Error: {error}</StatusMessage>
            </PrototypesListSection>
        );
    }

    return (
        <PrototypesListSection id="prototypes">
            <SectionTitle>Prototypes</SectionTitle>
            <AddPrototypeButton />
            {prototypes && prototypes.length > 0 ? (
                prototypes.map((proto) => (
                    <PrototypeCard key={proto.id} prototype={proto} />
                ))
            ) : (
                <StatusMessage>No prototypes found.</StatusMessage>
            )}
        </PrototypesListSection>
    );
}
