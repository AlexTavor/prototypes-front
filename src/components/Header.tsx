import { HeaderContainer, Nav } from "../styles";
import { AuthButton } from "./AuthButton";

export function Header() {
    return (
        <HeaderContainer>
            <Nav>
                <a href="#about">About</a> |{" "}
                <a href="#prototypes">Prototypes</a> | <AuthButton />
            </Nav>
        </HeaderContainer>
    );
}
