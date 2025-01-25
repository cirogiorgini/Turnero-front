import React, { createContext, useContext, useState, ReactNode } from "react";

interface TurnData {
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    date?: string;
    time?: string;
    barber?: string
}

interface TurnContextProps {
    turnData: TurnData;
    updateTurnData: (data: Partial<TurnData>) => void;
}

const TurnContext = createContext<TurnContextProps | undefined>(undefined);

export const TurnProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [turnData, setTurnData] = useState<TurnData>({});

    const updateTurnData = (data: Partial<TurnData>) => {
        setTurnData((prev) => ({ ...prev, ...data }));
    };

    return (
        <TurnContext.Provider value={{ turnData, updateTurnData }}>
            {children}
        </TurnContext.Provider>
    );
};

export const useTurnContext = (): TurnContextProps => {
    const context = useContext(TurnContext);
    if (!context) {
        throw new Error("useTurnContext must be used within a TurnProvider");
    }
    return context;
};
