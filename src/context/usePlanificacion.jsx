import { useContext } from "react";
import { PlanificacionContext } from "./PlanificacionContext.jsx";

export function usePlanificacion() {
  return useContext(PlanificacionContext);
}
