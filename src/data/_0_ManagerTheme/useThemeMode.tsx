import { useState, useEffect } from "react";

import ManagerTheme from "./ManagerTheme";

const useThemeMode = () => {
  const managerTheme = ManagerTheme;

  const [theme, setTheme] = useState("");

  useEffect(() => {
    const listener = managerTheme.addListenerStateThemeMode((theme: string) => {
      setTheme(theme);
    });

    return () => {
      managerTheme.removeListenerStateThemeMode(listener);
    };
  }, []);

  return theme;
};

export default useThemeMode;
