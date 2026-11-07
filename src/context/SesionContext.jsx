import { createContext, useContext, useState } from "react";

const ADMIN_ACTUAL = {
  adminId: "ADM-001",
  nombre: "Administrador Principal",
};

const SesionContext = createContext(null);

export function SesionProvider({ children }) {
  const [sesion] = useState(() => ({
    ...ADMIN_ACTUAL,
    sesionId: crypto.randomUUID(),
    inicio: new Date().toISOString(),
  }));

  return <SesionContext.Provider value={{ sesion }}>{children}</SesionContext.Provider>;
}

export function useSesion() {
  return useContext(SesionContext);
}
