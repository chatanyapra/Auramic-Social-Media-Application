import { createContext, useContext } from "react";

interface ThemeContextProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    textColor: string;
    setTextColor: (color: string) => void;
  }
  
export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ThemeContext.Provider;

export default function useTheme(){
    return useContext(ThemeContext);
}