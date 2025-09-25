import React, { createContext, useContext, useState, ReactNode } from "react";

interface Sucursal {
  id: string;
  nombre: string;
  direccion: string;
}

interface TurnData {
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  date?: string;
  time?: string;
  barber?: string;
  sucursal?: Sucursal;
}

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  birthdate: string;
  rol: string;
  points: number;
  token: string;
  createdAt: string;
}

interface TurnContextProps {
  turnData: TurnData;
  updateTurnData: (data: Partial<TurnData>) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

const TurnContext = createContext<TurnContextProps | undefined>(undefined);

export const TurnProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [turnData, setTurnData] = useState<TurnData>({});
  const [user, setUser] = useState<User | null>(null);

  // Función para actualizar los datos del turno
  const updateTurnData = (data: Partial<TurnData>) => {
    console.log("Actualizando turnData en el contexto:", data); // Verifica los datos
    setTurnData((prev) => ({ ...prev, ...data }));
  };

  // Función para actualizar los datos del usuario
  const updateUser = (newUser: User | null) => {
    console.log("Actualizando user en el contexto:", newUser); // Verifica los datos
    setUser(newUser);
  };

  return (
    <TurnContext.Provider
      value={{
        turnData,
        updateTurnData,
        user,
        setUser: updateUser, // Usamos la función updateUser para setUser
      }}
    >
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