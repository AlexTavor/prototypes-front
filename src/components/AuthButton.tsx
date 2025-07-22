import { useState, useEffect } from "react";
import styled from "styled-components";
import { getUser, getLoginUrl, logout } from "../services/authService";

interface User {
    name: string;
    picture: string;
}

// --- Styled Components ---

const LoginButton = styled.a`
    display: inline-block;
    padding: 0.5rem 1rem;
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    text-decoration: none;
    border-radius: 0.375rem;
    font-weight: 600;
    transition: background-color 0.2s ease-in-out;

    &:hover {
        background-color: ${({ theme }) => theme.colors.primaryHover};
        color: ${({ theme }) => theme.colors.textMain} !important;
    }
`;

const AuthContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

const ProfilePicture = styled.img`
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 9999px;
    object-fit: cover;
    border: 2px solid ${({ theme }) => theme.colors.surface};
`;

const LogoutButton = styled.div`
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textMuted};
    text-decoration: none;
    cursor: pointer;

    &:hover {
        color: ${({ theme }) => theme.colors.textMain};
    }
`;

const LoadingState = styled.div`
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 9999px;
    background-color: ${({ theme }) => theme.colors.surface};
`;

// --- Component ---

export function AuthButton() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUser();
                setUser(userData);
            } catch (_) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    };

    if (isLoading) {
        return <LoadingState />;
    }

    return user ? (
        <AuthContainer>
            <ProfilePicture src={user.picture} alt={user.name} />
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </AuthContainer>
    ) : (
        <LoginButton href={getLoginUrl()}>Login</LoginButton>
    );
}
