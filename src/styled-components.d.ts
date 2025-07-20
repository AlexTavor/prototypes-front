import "styled-components";
import { theme } from "./styles";

type AppTheme = typeof theme;

declare module "styled-components" {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface DefaultTheme extends AppTheme {}
}
