import { useState, useEffect } from "react";
import { getUser } from "../services/authService";
import type { User } from "../types";

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUser(); //
                setUser(userData);
            } catch (_) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, isLoading };
}
