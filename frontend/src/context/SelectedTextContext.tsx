import { createContext, useContext, useState, ReactNode } from "react";

interface KeyValuePair {
    key: string;
    value: string;
}

interface SocketContextValue {
    selectedTextUser: KeyValuePair | null;
    setSelectedTextUser: (pair: KeyValuePair | null) => void;
}

interface SocketContextProviderProps {
    children: ReactNode;
}

const TextContext = createContext<SocketContextValue | undefined>(undefined);

export const useSelectTextContext = () => {
    const context = useContext(TextContext);
    if (context === undefined) {
        throw new Error('useSelectTextContext must be used within a SelectTextContextProvider');
    }
    return context;
};

export const SelectTextContextProvider = ({ children }: SocketContextProviderProps) => {
    const [selectedTextUser, setSelectedTextUser] = useState<KeyValuePair | null>(null);

    return (
        <TextContext.Provider value={{ selectedTextUser, setSelectedTextUser }}>
            {children}
        </TextContext.Provider>
    );
};
