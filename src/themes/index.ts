import { DefaultTheme } from "styled-components";

export const lightTheme: DefaultTheme = {
  background: "#FFFFFF",
  text: "#000000",
  primary: "#F0141E",
  card: "#FFFFFF",
  accent: "#131313",
  muted: "#F5F5F5",
  border: "#E5E5E5",
};

export const darkTheme: DefaultTheme = {
  background: "#000000",
  text: "#FFFFFF",
  primary: "#F0141E",
  card: "#131313",
  accent: "#FFFFFF",
  muted: "#1A1A1A",
  border: "#333333",
};

export const whiteLabelTheme: DefaultTheme = {
  background: "#F8F9FA",
  text: "#131313",
  primary: "#6366F1",
  card: "#FFFFFF",
  accent: "#F0141E",
  muted: "#F1F5F9",
  border: "#E2E8F0",
};

export const createWhiteLabelTheme = (colors: {
  primary: string;
  background: string;
  text: string;
}): DefaultTheme => {
  const isLightBackground = isLightColor(colors.background);

  return {
    background: colors.background,
    text: colors.text,
    primary: colors.primary,
    card: isLightBackground
      ? "#FFFFFF"
      : adjustBrightness(colors.background, 10),
    accent: colors.text,
    muted: isLightBackground
      ? adjustBrightness(colors.background, -5)
      : adjustBrightness(colors.background, 15),
    border: isLightBackground
      ? adjustBrightness(colors.background, -10)
      : adjustBrightness(colors.background, 20),
  };
};

function isLightColor(color: string): boolean {
  const hex = color.replace("#", "");
  const r = Number.parseInt(hex.substr(0, 2), 16);
  const g = Number.parseInt(hex.substr(2, 2), 16);
  const b = Number.parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
}

function adjustBrightness(color: string, percent: number): string {
  const hex = color.replace("#", "");
  const r = Number.parseInt(hex.substr(0, 2), 16);
  const g = Number.parseInt(hex.substr(2, 2), 16);
  const b = Number.parseInt(hex.substr(4, 2), 16);

  const adjust = (value: number) => {
    const adjusted = Math.round(value + (value * percent) / 100);
    return Math.max(0, Math.min(255, adjusted));
  };

  const newR = adjust(r).toString(16).padStart(2, "0");
  const newG = adjust(g).toString(16).padStart(2, "0");
  const newB = adjust(b).toString(16).padStart(2, "0");

  return `#${newR}${newG}${newB}`;
}
