import { Header } from "./components/Header";
import { About } from "./components/About";
import { PrototypesList } from "./components/PrototypesList";
import { AppContainer, Main } from "./styles";
import { PrototypesProvider } from "./context/PrototypeContext";

export default function App() {
    return (
        <AppContainer>
            <PrototypesProvider>
                <Header />
                <Main>
                    <About />
                    <PrototypesList />
                </Main>
            </PrototypesProvider>
        </AppContainer>
    );
}

