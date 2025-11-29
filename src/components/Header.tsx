import React from "react";
import { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Palette, Heart } from "lucide-react";

const logoUrl =
  "https://www.smartnx.com/wp-content/themes/smartnx/plataforma-cxaas/SmartNX-logo-header.png";

interface HeaderProps {
  themeName: "light" | "dark" | "whiteLabel";
  setThemeName: (theme: "light" | "dark" | "whiteLabel") => void;
  customColors?: { primary: string; background: string; text: string };
  onCustomColorsChange?: (colors: {
    primary: string;
    background: string;
    text: string;
  }) => void;
}

const Header = ({
  themeName,
  setThemeName,
  customColors,
  onCustomColorsChange,
}: HeaderProps) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tempColors, setTempColors] = useState(
    customColors || {
      primary: "#F0141E",
      background: "#FFFFFF",
      text: "#000000",
    }
  );

  const handleThemeSelect = (theme: "light" | "dark" | "whiteLabel") => {
    setThemeName(theme);
    setShowThemeMenu(false);
    if (theme === "whiteLabel") {
      setShowColorPicker(true);
    }
  };

  const handleColorChange = (
    colorType: keyof typeof tempColors,
    value: string
  ) => {
    setTempColors((prev) => ({ ...prev, [colorType]: value }));
  };

  const applyCustomColors = () => {
    onCustomColorsChange?.(tempColors);
    setShowColorPicker(false);
  };

  const getThemeIcon = () => {
    switch (themeName) {
      case "light":
        return <Sun size={20} />;
      case "dark":
        return <Moon size={20} />;
      case "whiteLabel":
        return <Palette size={20} />;
      default:
        return <Sun size={20} />;
    }
  };

  return (
    <HeaderWrapper
      as={motion.header}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <Container>
        <Left>
          <Logo src={logoUrl} alt="logo" />
        </Left>
        <Right>
          <HeaderText>Andreza Sousa - Teste de Front-end</HeaderText>

          <ThemeContainer>
            <ThemeButton onClick={() => setShowThemeMenu(!showThemeMenu)}>
              {getThemeIcon()}
            </ThemeButton>

            <AnimatePresence>
              {showThemeMenu && (
                <ThemeMenu
                  as={motion.div}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ThemeOption onClick={() => handleThemeSelect("light")}>
                    <Sun size={16} /> Tema claro
                  </ThemeOption>
                  <ThemeOption onClick={() => handleThemeSelect("dark")}>
                    <Moon size={16} /> Tema escuro
                  </ThemeOption>
                  <ThemeOption onClick={() => handleThemeSelect("whiteLabel")}>
                    <Palette size={16} /> Escolha sua cor
                  </ThemeOption>
                </ThemeMenu>
              )}
            </AnimatePresence>
          </ThemeContainer>
        </Right>
      </Container>

      <AnimatePresence>
        {showColorPicker && (
          <ColorPickerOverlay
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowColorPicker(false)}
          >
            <ColorPickerModal
              as={motion.div}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ColorPickerTitle>Customize suas cores</ColorPickerTitle>

              <ColorInputGroup>
                <ColorInputLabel>Cor Primária</ColorInputLabel>
                <ColorInputWrapper>
                  <ColorInput
                    type="color"
                    value={tempColors.primary}
                    onChange={(e) =>
                      handleColorChange("primary", e.target.value)
                    }
                  />
                  <ColorTextInput
                    type="text"
                    value={tempColors.primary}
                    onChange={(e) =>
                      handleColorChange("primary", e.target.value)
                    }
                  />
                </ColorInputWrapper>
              </ColorInputGroup>

              <ColorInputGroup>
                <ColorInputLabel>Cor de Fundo</ColorInputLabel>
                <ColorInputWrapper>
                  <ColorInput
                    type="color"
                    value={tempColors.background}
                    onChange={(e) =>
                      handleColorChange("background", e.target.value)
                    }
                  />
                  <ColorTextInput
                    type="text"
                    value={tempColors.background}
                    onChange={(e) =>
                      handleColorChange("background", e.target.value)
                    }
                  />
                </ColorInputWrapper>
              </ColorInputGroup>

              <ColorInputGroup>
                <ColorInputLabel>Cor do Texto</ColorInputLabel>
                <ColorInputWrapper>
                  <ColorInput
                    type="color"
                    value={tempColors.text}
                    onChange={(e) => handleColorChange("text", e.target.value)}
                  />
                  <ColorTextInput
                    type="text"
                    value={tempColors.text}
                    onChange={(e) => handleColorChange("text", e.target.value)}
                  />
                </ColorInputWrapper>
              </ColorInputGroup>

              <ColorPickerActions>
                <ColorPickerButton onClick={() => setShowColorPicker(false)}>
                  Cancelar
                </ColorPickerButton>
                <ColorPickerButton $primary onClick={applyCustomColors}>
                  Aplicar Cores
                </ColorPickerButton>
              </ColorPickerActions>
            </ColorPickerModal>
          </ColorPickerOverlay>
        )}
      </AnimatePresence>
    </HeaderWrapper>
  );
};

export default Header;

const HeaderWrapper = styled.header`
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  padding: 1rem 0;
  transition: all 0.3s ease;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px ${(props) => props.theme.border};
  border-bottom: 2px solid ${(props) => props.theme.border};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 0 0.75rem;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;

const Right = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

const Logo = styled.img`
  height: 40px;

  @media (max-width: 768px) {
    height: 32px;
  }
`;

const HeaderText = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${(props) => props.theme.text};

  @media (max-width: 768px) {
    display: none;
  }
`;

const ThemeButton = styled.button`
  background: ${(props) => props.theme.primary}20;
  color: ${(props) => props.theme.primary};
  border: 2px solid ${(props) => props.theme.primary};
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(props) => props.theme.primary}40;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const ThemeContainer = styled.div`
  position: relative;
`;

const ThemeMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${(props) => props.theme.card};
  border: 2px solid ${(props) => props.theme.border};
  border-radius: 12px;
  box-shadow: 0 8px 32px ${(props) => props.theme.border};
  backdrop-filter: blur(10px);
  z-index: 1000;
  min-width: 160px;
  margin-top: 8px;
  overflow: hidden;
`;

const ThemeOption = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: ${(props) => props.theme.text};
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${(props) => props.theme.primary}20;
    color: ${(props) => props.theme.primary};
  }
`;

const ColorPickerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
`;

const ColorPickerModal = styled.div`
  background: ${(props) => props.theme.card};
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 2px solid ${(props) => props.theme.border};
`;

const ColorPickerTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  color: ${(props) => props.theme.text};
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
`;

const ColorInputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const ColorInputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${(props) => props.theme.text};
  font-weight: 600;
  font-size: 0.9rem;
`;

const ColorInputWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const ColorInput = styled.input`
  width: 60px;
  height: 40px;
  border: 2px solid ${(props) => props.theme.border};
  border-radius: 8px;
  cursor: pointer;
  background: ${(props) => props.theme.card};

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 6px;
  }
`;

const ColorTextInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 2px solid ${(props) => props.theme.border};
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.9rem;
  background: ${(props) => props.theme.card};
  color: ${(props) => props.theme.text};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary};
  }
`;

const ColorPickerActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const ColorPickerButton = styled.button<{ $primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border: 2px solid
    ${({ $primary, theme }) => ($primary ? theme.primary : theme.border)};
  background: ${({ $primary, theme }) =>
    $primary ? theme.primary : "transparent"};
  color: ${({ $primary, theme }) => ($primary ? "#FFFFFF" : theme.text)};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px
      ${({ $primary, theme }) =>
        $primary ? theme.primary + "50" : theme.border + "50"};
  }
`;
