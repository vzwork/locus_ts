import { ThemeProvider, TypeBackground, createTheme } from "@mui/material";
import { ReactNode } from "react";
import useStateTheme from "./data/_0_ManagerTheme/useThemeMode";

// declaring custom theme color
// declare module '@mui/material/styles' {
//   interface Palette {
//     custom: Palette['primary'];
//   }

//   interface PaletteOptions {
//     custom?: PaletteOptions['primary'];
//   }
// }

declare module "@mui/material/styles" {
  interface TypeBackground {
    transperent?: string;
  }
}

const themeLight = createTheme({
  palette: {
    mode: "light",
    background: {
      paper: "#eee",
      default: "#c9d0d1",
      transperent: "rgba(255, 255, 255, 0.6)",
    },
    primary: {
      main: "#577894",
    },
    secondary: {
      main: "#ab3094",
    },
    info: {
      main: "#aaa",
    },
  },
});

const themeDark = createTheme({
  palette: {
    mode: "dark",
    background: {
      paper: "#333",
      default: "#000",
      transperent: "rgba(30, 30, 30, 0.7)",
    },
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#5c4b40",
    },
    info: {
      main: "#555",
    },
  },
});

interface IChildrenTheme {
  children: ReactNode;
}

export default function Theme({ children }: IChildrenTheme) {
  const stateTheme = useStateTheme();

  return (
    <>
      <ThemeProvider theme={stateTheme === "light" ? themeLight : themeDark}>
        {children}
      </ThemeProvider>
    </>
  );
}
