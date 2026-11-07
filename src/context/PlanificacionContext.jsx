import { createContext, useState } from "react";
import { parametrosIniciales } from "../data/parametros.js";
import { profesionales as profesionalesIniciales } from "../data/profesionales.js";

const PlanificacionContext = createContext(null);

export function PlanificacionProvider({ children }) {
  const [parametros, setParametros] = useState(parametrosIniciales);
  const [profesionales] = useState(profesionalesIniciales);
  const [historial, setHistorial] = useState([]);

  function cambiarParametro(campo, nuevoValor, autor, justificacion) {
    setHistorial((h) => [{
      fecha: new Date().toISOString(), autor, campo,
      valorAnterior: parametros[campo], valorNuevo: nuevoValor, justificacion,
    }, ...h]);
    setParametros((p) => ({ ...p, [campo]: nuevoValor }));
  }

  return (
    <PlanificacionContext.Provider value={{ parametros, profesionales, historial, cambiarParametro }}>
      {children}
    </PlanificacionContext.Provider>
  );
}

export { PlanificacionContext };
