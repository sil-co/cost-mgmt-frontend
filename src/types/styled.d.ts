import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        bg: string;
        panel: string;
        panelSoft: string;
        text: string;
        textDim: string;
        primary: string;
        primaryAccent: string;
        danger: string;
        success: string;
        warning: string;
        border: string;
        shadow: string;
    }
}
