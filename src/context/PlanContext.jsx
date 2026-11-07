import { createContext, useContext, useMemo, useState } from "react";
import { guardarPlan } from "../api/planApi.js";
import { META_INICIAL, planInicial } from "../data/planBase.js";
import { useSesion } from "./SesionContext.jsx";
import { verificarIntegridad } from "../utils/integridad.js";
import { calcularFila, totalesPlan } from "../utils/plan.js";

const PlanContext = createContext(null);
const FILA_VACIA = {
  instituto: "", horasSemanales: 0, horasDirecta: 0, horasIndirecta: 0,
  horasNAS: 0, atencionesDirectas: 0, atencionesIndirectas: 0, totalAtenciones: 0, nuevo: true,
};

export function PlanProvider({ children }) {
  const { sesion } = useSesion();
  const [datos, setDatos] = useState(planInicial);
  const [pct, setPct] = useState(META_INICIAL);
  const [bitacora, setBitacora] = useState([]);
  const [verificado, setVerificado] = useState(null);
  const filas = useMemo(() => datos.map((f) => calcularFila(f, pct)), [datos, pct]);
  const totales = useMemo(() => totalesPlan(filas, pct), [filas, pct]);

  function registrar(accion, detalle) {
    setVerificado(null);
    if (!sesion) return;
    setBitacora((b) => [{
      fechaHora: new Date().toISOString(), adminId: sesion.adminId, nombre: sesion.nombre,
      sesionId: sesion.sesionId, accion, detalle,
    }, ...b]);
  }
  function cambiarCelda(indice, campo, valor) {
    const fila = datos[indice];
    setDatos((prev) => prev.map((f, i) => (i === indice ? { ...f, [campo]: valor } : f)));
    registrar("modificar", `${fila.instituto || "Registro nuevo"} · ${campo}: ${fila[campo]} → ${valor}`);
  }
  function agregarRegistro() {
    setDatos((prev) => [...prev, { ...FILA_VACIA }]);
    registrar("agregar", "Nuevo registro creado (pendiente de nombre)");
  }
  function eliminarNuevo(indice) {
    const fila = datos[indice];
    if (!fila.nuevo) return;
    setDatos((prev) => prev.filter((_, i) => i !== indice));
    registrar("eliminar", `Registro nuevo eliminado: ${fila.instituto || "sin nombre"}`);
  }
  function cambiarPct(valor) {
    registrar("cambiar_meta", `Meta: ${pct}% → ${valor}%`);
    setPct(valor);
  }
  function verificar() {
    const resultado = {
      errores: verificarIntegridad(datos, pct), fechaHora: new Date().toISOString(),
      adminId: sesion?.adminId ?? null, nombre: sesion?.nombre ?? null, sesionId: sesion?.sesionId ?? null,
    };
    setVerificado(resultado);
    return resultado;
  }
  async function guardar() {
    if (!sesion) return { ok: false, errores: ["Debe iniciar sesión de administrador."] };
    if (!verificado || verificado.errores.length > 0) return { ok: false, errores: ["Debe verificar la integridad antes de guardar."] };
    const res = await guardarPlan({
      pct, filas: datos,
      autorizadoPor: { adminId: sesion.adminId, nombre: sesion.nombre, sesionId: sesion.sesionId },
      fechaHoraAutorizacion: verificado.fechaHora, fechaHoraEnvio: new Date().toISOString(), bitacora,
    });
    if (res.ok) {
      setBitacora([]);
      setVerificado(null);
    }
    return res;
  }
  function restablecer() {
    setDatos(planInicial);
    setPct(META_INICIAL);
    setBitacora([]);
    setVerificado(null);
  }

  return <PlanContext.Provider value={{ filas, totales, pct, bitacora, verificado, cambiarCelda, cambiarPct, agregarRegistro, eliminarNuevo, verificar, guardar, restablecer }}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  return useContext(PlanContext);
}
