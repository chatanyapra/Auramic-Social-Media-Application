import { createContext, useContext } from "react";
import { ThemeContextProps } from "../types/types";
  
export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ThemeContext.Provider;

export default function useTheme(){
    return useContext(ThemeContext);
}