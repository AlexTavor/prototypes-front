import { useState, useEffect } from "react";
import { getUser } from "../services/authService";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

export function useIsAdmin() {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const user = await getUser();
                if (user && user.email === ADMIN_EMAIL) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error("Failed to check admin status:", error);
                setIsAdmin(false);
            }
        };

        checkAdminStatus();
    }, []);

    return isAdmin;
}
