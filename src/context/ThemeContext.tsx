import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { DefaultTheme } from "styled-components";
import { createWhiteLabelTheme, darkTheme, lightTheme } from "../themes";

interface ThemeContextType {
  theme: "light" | "dark" | "whiteLabel";
  setTheme: (theme: "light" | "dark" | "whiteLabel") => void;
  customColors: { primary: string; background: string; text: string };
  setCustomColors: (colors: {
    primary: string;
    background: string;
    text: string;
  }) => void;
  getCurrentThemeObject: () => DefaultTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<"light" | "dark" | "whiteLabel">(
    () => {
      const saved = localStorage.getItem("app-theme");
      return (saved as "light" | "dark" | "whiteLabel") || "light";
    }
  );

  const [customColors, setCustomColorsState] = useState(() => {
    const saved = localStorage.getItem("custom-colors");
    return saved
      ? JSON.parse(saved)
      : {
          primary: "#F0141E",
          background: "#FFFFFF",
          text: "#000000",
        };
  });

  const setTheme = (newTheme: "light" | "dark" | "whiteLabel") => {
    setThemeState(newTheme);
    localStorage.setItem("app-theme", newTheme);
  };

  const setCustomColors = (colors: {
    primary: string;
    background: string;
    text: string;
  }) => {
    setCustomColorsState(colors);
    localStorage.setItem("custom-colors", JSON.stringify(colors));
  };

  const getCurrentThemeObject = (): DefaultTheme => {
    switch (theme) {
      case "light":
        return lightTheme;
      case "dark":
        return darkTheme;
      case "whiteLabel":
        return createWhiteLabelTheme(customColors);
      default:
        return lightTheme;
    }
  };

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    const themeObj = getCurrentThemeObject();

    root.style.setProperty("--bg-900", themeObj.background);
    root.style.setProperty("--text-900", themeObj.text);
    root.style.setProperty("--accent-700", themeObj.primary);
    root.style.setProperty("--button", themeObj.primary);
    root.style.setProperty("--white", themeObj.card);
  }, [theme, customColors]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        customColors,
        setCustomColors,
        getCurrentThemeObject,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
