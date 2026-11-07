import { useState } from "react";
import TablaPlan from "../components/TablaPlan.jsx";
import { usePlan } from "../context/PlanContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";

const fechaLocal = (iso) => new Date(iso).toLocaleString("es-CL");

export default function Admin() {
  const { sesion } = useSesion();
  const { filas, totales, pct, bitacora, verificado, cambiarCelda, cambiarPct, agregarRegistro, eliminarNuevo, verificar, guardar, restablecer } = usePlan();
  const [borradorPct, setBorradorPct] = useState(pct);
  const [mensaje, setMensaje] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const verificadoOk = verificado !== null && verificado.errores.length === 0;
  let estado = { tipo: "borrador", texto: "Sin verificar" };
  if (verificado && verificadoOk) estado = { tipo: "ok", texto: `Verificado por ${verificado.nombre} el ${fechaLocal(verificado.fechaHora)}` };
  else if (verificado) estado = { tipo: "error", texto: `Verificación con ${verificado.errores.length} error(es)` };

  function confirmarPct() {
    const v = Number(borradorPct);
    if (Number.isFinite(v) && v >= 1 && v <= 100) cambiarPct(v);
    else setBorradorPct(pct);
  }
  function onVerificar() {
    const resultado = verificar();
    setMensaje(resultado.errores.length === 0
      ? { tipo: "ok", texto: "Integridad verificada. Ya puede guardar." }
      : { tipo: "error", texto: `Se encontraron ${resultado.errores.length} problema(s). Corríjalos antes de guardar.` });
  }
  async function onGuardar() {
    setGuardando(true);
    const resultado = await guardar();
    setGuardando(false);
    if (resultado.ok) {
      const fecha = resultado.fechaHoraGuardado ?? new Date().toISOString();
      setMensaje({ tipo: "ok", texto: `Guardado en base de datos por ${sesion.nombre} el ${fechaLocal(fecha)}.` });
    } else {
      setMensaje({ tipo: "error", texto: resultado.errores.join(" ") });
    }
  }

  return <>
    <h1>Administración</h1>
    <div className="nota">Los cambios se registran con el administrador de la sesión. Para guardar en base de datos debe verificar la integridad primero.</div>
    <div className="panel sesion-activa">Sesión iniciada como <strong>{sesion.nombre}</strong> ({sesion.adminId}) desde {fechaLocal(sesion.inicio)}</div>
    <h2>Parámetros</h2>
    <div className="formulario">
      <label>% meta de gestión<input type="number" min="1" max="100" value={borradorPct} onChange={(e) => setBorradorPct(e.target.value)} onBlur={confirmarPct} onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()} /></label>
      <div className="acciones ancho-total">
        <button className="boton" onClick={agregarRegistro}>+ Agregar registro</button>
        <button className="boton boton--secundario" onClick={onVerificar}>Verificar integridad</button>
        <button className="boton" onClick={onGuardar} disabled={!verificadoOk || guardando}>{guardando ? "Guardando..." : "Guardar en base de datos"}</button>
        <button className="boton boton--secundario" onClick={restablecer}>Descartar cambios</button>
      </div>
    </div>
    <div className={`estado estado--${estado.tipo}`}>{estado.texto}</div>
    {mensaje && <div className={`alerta alerta--${mensaje.tipo}`}>{mensaje.texto}</div>}
    {verificado && verificado.errores.length > 0 && <div className="alerta alerta--error"><strong>Errores de integridad</strong><ul>{verificado.errores.map((error, i) => <li key={i}>{error}</li>)}</ul></div>}
    <h2>Plan editable</h2>
    <TablaPlan filas={filas} totales={totales} pct={pct} editable onCambiar={cambiarCelda} onEliminar={eliminarNuevo} />
    <h2>Bitácora de la sesión</h2>
    {bitacora.length === 0 ? <p className="nota">Sin cambios registrados.</p> : <div className="tabla-wrap"><table><thead><tr><th>Fecha y hora</th><th>Administrador</th><th>Acción</th><th>Detalle</th></tr></thead><tbody>{bitacora.map((b, i) => <tr key={i}><td>{fechaLocal(b.fechaHora)}</td><td>{b.nombre} ({b.adminId})</td><td>{b.accion}</td><td>{b.detalle}</td></tr>)}</tbody></table></div>}
  </>;
}
