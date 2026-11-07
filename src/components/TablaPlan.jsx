import CeldaEditable from "./CeldaEditable.jsx";
import { fmtEntero, minutosAFormato, parseEntero, parseHoras } from "../utils/plan.js";

const HORAS = { formato: minutosAFormato, parsear: parseHoras };
const NUMERO = { formato: fmtEntero, parsear: parseEntero };

export default function TablaPlan({ filas, totales, pct, editable = false, onCambiar, onEliminar }) {
  function celda(f, indice, campo, tipo) {
    const t = tipo === "horas" ? HORAS : NUMERO;
    if (!editable) return t.formato(f[campo]);
    return <CeldaEditable valor={f[campo]} formato={t.formato} parsear={t.parsear} alerta={f.alertas.some((a) => a.campo === campo)} onGuardar={(v) => onCambiar(indice, campo, v)} />;
  }
  return <div className="tabla-plan-wrap"><table className="plan-tabla">
    <caption>Médico terapéutico · Socio educativo</caption>
    <thead><tr>
      <th>Instituto</th><th>Suma de horas semanales</th><th>Tiempo (Hrs/Semana) Atención Directa</th><th>Tiempo (Hrs/Semana) Atención Indirecta</th><th>Tiempo (Hrs/Semana) Actividad no asistencial - NAS</th><th>Atención Anual Directa Grupal e Individual</th><th>Atención Anual Indirecta</th><th>Total Atenciones en Planificación por Año</th><th className="col-meta">Meta Gestión al {pct}%</th>{editable && <th></th>}
    </tr></thead>
    <tbody>{filas.map((f, i) => <tr key={i}>
      <td>{editable && f.nuevo ? <CeldaEditable valor={f.instituto} formato={(v) => v} parsear={(t) => (t.trim() ? t.trim() : null)} onGuardar={(v) => onCambiar(i, "instituto", v)} /> : f.instituto || <em>Sin nombre</em>}</td>
      <td>{celda(f, i, "horasSemanales", "horas")}</td><td>{celda(f, i, "horasDirecta", "horas")}</td><td>{celda(f, i, "horasIndirecta", "horas")}</td><td>{celda(f, i, "horasNAS", "horas")}</td><td>{celda(f, i, "atencionesDirectas", "numero")}</td><td>{celda(f, i, "atencionesIndirectas", "numero")}</td><td>{celda(f, i, "totalAtenciones", "numero")}</td><td className="col-meta">{fmtEntero(f.metaGestion)}</td>
      {editable && <td>{f.nuevo && <button className="boton-mini" onClick={() => onEliminar(i)} title="Eliminar registro nuevo">✕</button>}</td>}
    </tr>)}</tbody>
    <tfoot>
      <tr className="total"><td>Total general</td><td>{fmtEntero(totales.horasSemanales / 60)}</td><td>{minutosAFormato(totales.horasDirecta)}</td><td>{minutosAFormato(totales.horasIndirecta)}</td><td>{minutosAFormato(totales.horasNAS)}</td><td>{fmtEntero(totales.atencionesDirectas)}</td><td>{fmtEntero(totales.atencionesIndirectas)}</td><td>{fmtEntero(totales.totalAtenciones)}</td><td className="col-meta">{fmtEntero(totales.metaGestion)}</td>{editable && <td></td>}</tr>
      <tr className="meta"><td>Meta gestión al {pct}%</td><td colSpan="4"></td><td>{fmtEntero(totales.metaDirectas)}</td><td>{fmtEntero(totales.metaIndirectas)}</td><td>{fmtEntero(totales.metaDirectas + totales.metaIndirectas)}</td><td></td>{editable && <td></td>}</tr>
    </tfoot>
  </table></div>;
}
