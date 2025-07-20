import {
    useState,
    useEffect,
    useCallback,
    createContext,
    type ReactNode,
    useContext,
} from "react";
import {
    fetchPrototypes,
    savePrototype,
    deletePrototype,
} from "../services/prototypeService";
import type { Prototype } from "../types";

// Define the shape of the context data
interface PrototypesContextType {
    prototypes: Prototype[];
    isLoading: boolean;
    error: string | null;
    addPrototype: (prototype: Omit<Prototype, "id">) => Promise<void>;
    updatePrototype: (prototype: Prototype) => Promise<void>;
    removePrototype: (id: number) => Promise<void>;
}

// Create the context with a default undefined value
const PrototypesContext = createContext<PrototypesContextType | undefined>(
    undefined
);

// Create the Provider component
export function PrototypesProvider({ children }: { children: ReactNode }) {
    const [prototypes, setPrototypes] = useState<Prototype[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshPrototypes = useCallback(async () => {
        try {
            const data = await fetchPrototypes();
            setPrototypes(data);
            setError(null);
        } catch (err) {
            if (err instanceof Error) {
                setError(`Failed to load prototypes: ${err.message}`);
            }
        } finally {
            if (isLoading) {
                setIsLoading(false);
            }
        }
    }, [isLoading]);

    useEffect(() => {
        refreshPrototypes();
        window.addEventListener("focus", refreshPrototypes);
        return () => {
            window.removeEventListener("focus", refreshPrototypes);
        };
    }, [refreshPrototypes]);

    const addPrototype = async (prototype: Omit<Prototype, "id">) => {
        await savePrototype(prototype);
        await refreshPrototypes();
    };

    const updatePrototype = async (prototype: Prototype) => {
        await savePrototype(prototype);
        await refreshPrototypes();
    };

    const removePrototype = async (id: number) => {
        await deletePrototype(id);
        await refreshPrototypes();
    };

    const value = {
        prototypes,
        isLoading,
        error,
        addPrototype,
        updatePrototype,
        removePrototype,
    };

    return (
        <PrototypesContext.Provider value={value}>
            {children}
        </PrototypesContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePrototypes() {
    const context = useContext(PrototypesContext);
    if (context === undefined) {
        throw new Error(
            "usePrototypes must be used within a PrototypesProvider"
        );
    }
    return context;
}
