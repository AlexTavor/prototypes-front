import styled, { createGlobalStyle } from "styled-components";

// --- Theme Definition ---
// Central place for all our style variables
export const theme = {
    colors: {
        background: "#0f172a",
        surface: "#1e293b",
        primary: "#0891b2",
        primaryHover: "#06b6d4",
        secondary: "#334155",
        secondaryHover: "#475569",
        textMain: "#cbd5e1",
        textMuted: "#94a3b8",
        border: "#334155",
        disabled: "#64748b",
    },
};

// --- Global Styles ---
// Injects base styles, resets, and font settings
export const GlobalStyle = createGlobalStyle`
  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Helvetica, Arial, sans-serif;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textMain};
  }
`;

// --- App Layout Components ---
export const AppContainer = styled.div`
    min-height: 100vh;
`;

export const Main = styled.main`
    max-width: 56rem;
    margin: 0 auto;
    padding: 1rem 2rem;
`;

// --- Header Components ---
export const HeaderContainer = styled.header`
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid
        ${({ theme }) => {
            return theme.colors.border;
        }};
`;

export const Nav = styled.nav`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 4rem;
    gap: 2rem;

    a {
        font-size: 1.125rem;
        color: ${({ theme }) => theme.colors.textMain};
        text-decoration: none;
        transition: color 0.3s ease;

        &:hover {
            color: ${({ theme }) => theme.colors.primaryHover};
        }
    }
`;

// --- Section Components ---
const Section = styled.section`
    padding: 4rem 0;
`;

export const AboutSection = styled(Section)`
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
    gap: 3rem;

    @media (min-width: 768px) {
        grid-template-columns: auto 1fr;
    }
`;

export const PrototypesListSection = styled(Section)`
    display: flex;
    flex-direction: column;
    gap: 4rem;
`;

export const SectionTitle = styled.h2`
    font-size: 2.25rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 2rem;
    color: ${({ theme }) => theme.colors.textMain};
`;

export const StatusMessage = styled.div`
    padding: 4rem 0;
    text-align: center;
    font-size: 1.25rem;
`;

// --- About Section Specific Components ---
export const ProfileImage = styled.img`
    width: 12rem;
    height: 12rem;
    border-radius: 9999px;
    object-fit: cover;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    border: 2px solid ${({ theme }) => theme.colors.primary}50; /* 50 for opacity */
    justify-self: center;

    @media (min-width: 768px) {
        justify-self: start;
    }
`;

export const AboutContent = styled.div`
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.75;

    h3,
    strong {
        color: ${({ theme }) => theme.colors.textMain};
    }

    a {
        color: ${({ theme }) => theme.colors.primary};
        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
    }
`;

// --- Prototype Card Components ---
export const PrototypeCardContainer = styled.div`
    background-color: ${({ theme }) => theme.colors.surface};
    border-radius: 0.5rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 8px 10px -6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.02);
    }
`;

export const PrototypeImageContainer = styled.div`
    height: 200px;
    background-color: #000;
`;

export const PrototypeImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
`;

export const CardBody = styled.div`
    padding: 2rem;
`;

export const CardTitle = styled.h3`
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 0.75rem 0;
`;

export const CardDescription = styled.p`
    color: ${({ theme }) => theme.colors.textMuted};
    margin: 0 0 1.5rem 0;
    line-height: 1.6;
`;

export const CardLinks = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
`;

interface CardButtonProps {
    variant?: "primary" | "secondary";
}

export const CardButton = styled.a<CardButtonProps>`
    color: #ffffff;
    font-weight: 600;
    padding: 0.75rem 1.25rem;
    border-radius: 0.375rem;
    text-decoration: none;
    transition: background-color 0.3s ease;
    display: inline-block;
    background-color: ${({ theme, variant }) =>
        variant === "primary" ? theme.colors.primary : theme.colors.secondary};

    &:hover {
        background-color: ${({ theme, variant }) =>
            variant === "primary"
                ? theme.colors.primaryHover
                : theme.colors.secondaryHover};
    }
`;
