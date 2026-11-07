import { usePlanificacion } from "../context/usePlanificacion.jsx";

export default function Historial() {
  const { historial } = usePlanificacion();
  return <>
    <h1>Historial de cambios</h1>
    {historial.length === 0 ? <p className="nota">Aún no hay cambios registrados en esta sesión.</p> : (
      <div className="tabla-wrap"><table><thead><tr><th>Fecha</th><th>Autor</th><th>Parámetro</th><th>Anterior</th><th>Nuevo</th><th>Justificación</th></tr></thead>
        <tbody>{historial.map((h, i) => <tr key={i}><td>{new Date(h.fecha).toLocaleString("es-CL")}</td><td>{h.autor}</td><td>{h.campo}</td><td>{String(h.valorAnterior)}</td><td>{String(h.valorNuevo)}</td><td>{h.justificacion}</td></tr>)}</tbody>
      </table></div>
    )}
    <p className="nota">El historial se guarda en memoria mientras la página esté abierta. Para persistirlo, conviene guardarlo en base de datos o en un archivo que Blue Prism escriba.</p>
  </>;
}
