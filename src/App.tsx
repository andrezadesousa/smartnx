"use client";

import { useEffect, useState } from "react";
import CharacterList from "./components/CharacterList";
import Hero from "./components/Hero";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "antd/dist/antd.css";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { createWhiteLabelTheme, darkTheme, lightTheme } from "./themes";

const GlobalStyle = createGlobalStyle`
  /* CSS Variables aplicadas dinamicamente ao tema */
  :root {
    --bg-900: ${(props: any) => props.theme.background};
    --text-900: ${(props: any) => props.theme.text};
    --accent-700: ${(props: any) => props.theme.primary};
    --button: ${(props: any) => props.theme.primary};
    --white: ${(props: any) => props.theme.card};
    --gray-50: ${(props: any) => props.theme.muted};
    --gray-100: ${(props: any) => props.theme.muted};
    --gray-200: ${(props: any) => props.theme.border};
    --gray-300: ${(props: any) => props.theme.border};
    --gray-900: ${(props: any) => props.theme.text};
  }

  * {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  }
`;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark" | "whiteLabel">(() => {
    const saved = localStorage.getItem("app-theme");
    return (saved as "light" | "dark" | "whiteLabel") || "light";
  });
  const [customColors, setCustomColors] = useState(() => {
    const saved = localStorage.getItem("custom-colors");
    return saved
      ? JSON.parse(saved)
      : {
          primary: "#F0141E",
          background: "#FFFFFF",
          text: "#000000",
        };
  });

  // Estado de busca
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Handlers para Hero
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  const handleReset = () => {
    setSearchQuery("");
  };

  const handleCustomColorsChange = (colors: {
    primary: string;
    background: string;
    text: string;
  }) => {
    setCustomColors(colors);
    localStorage.setItem("custom-colors", JSON.stringify(colors));
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "whiteLabel") => {
    setTheme(newTheme);
    localStorage.setItem("app-theme", newTheme);
  };

  const getThemeObject = () => {
    if (theme === "light") return lightTheme;
    if (theme === "dark") return darkTheme;
    return createWhiteLabelTheme(customColors);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen" role="status" aria-live="polite">
        <img src="/loading.gif" alt="Loading" className="loading-image" />
      </div>
    );
  }

  return (
    <ThemeProvider theme={getThemeObject()}>
      <GlobalStyle />
      <div className="custom-theme">
        <Header
          themeName={theme}
          setThemeName={handleThemeChange}
          customColors={customColors}
          onCustomColorsChange={handleCustomColorsChange}
        />
        <main className="main-content">
          <Hero
            thumbnailUrl={null}
            onSearch={handleSearch}
            onReset={handleReset}
            isSearching={isSearching}
            themeName={theme}
          />
          <CharacterList
            searchQuery={searchQuery}
            onLoadingChange={setIsSearching}
          />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
