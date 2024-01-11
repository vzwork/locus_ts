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
      default: "#c9d0d1",
      transperent: "rgba(240, 240, 240, 0.55)",
    },
    primary: {
      main: "#577894",
    },
    secondary: {
      main: "#bd874a",
    },
  },
});

const themeDark = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000",
      transperent: "rgba(30, 30, 30, 0.2)",
    },
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#5c4b40",
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
