import AnilloProgreso from "./AnilloProgreso.jsx";
import { totales } from "../utils/calculos.js";

const pct = (parte, total) => (total ? (parte / total) * 100 : 0);

export default function DashboardCiudad({ ciudad }) {
  const { nombre, filas } = ciudad;
  const t = totales(filas);
  const directas = t.individual + t.grupal;
  const meta = filas.reduce((s, f) => s + f.metaHorasAsistenciales, 0);

  if (filas.length === 0) {
    return (
      <>
        <h2>Dashboard · {nombre}</h2>
        <p className="nota">Sin profesionales asignados en esta ciudad.</p>
      </>
    );
  }

  return (
    <>
      <h2>Dashboard · {nombre}</h2>
      <div className="tarjetas">
        <Tarjeta valor={filas.length} etiqueta="Profesionales" />
        <Tarjeta valor={t.horasContratadas} etiqueta="Horas contratadas" />
        <Tarjeta valor={t.horasDisponibles.toFixed(1)} etiqueta="Horas disponibles" />
        <Tarjeta valor={t.atenciones} etiqueta="Atenciones proyectadas" />
        <Tarjeta valor={meta.toFixed(0)} etiqueta="Meta de gestión (h)" />
        <Tarjeta valor={t.asignaciones} etiqueta="Asignaciones especiales (h)" />
      </div>
      <h2>Indicadores de {nombre}</h2>
      <div className="grid-anillos">
        <AnilloProgreso valor={pct(directas, meta)} color="var(--verde)" etiqueta="Cumplimiento meta" />
        <AnilloProgreso valor={pct(t.grupal, directas)} color="var(--magenta)" etiqueta="% atención grupal" />
        <AnilloProgreso valor={pct(t.indirecta, t.horasContratadas)} color="var(--naranja)" etiqueta="Atención indirecta" />
        <AnilloProgreso valor={pct(t.noAsistencial, t.horasContratadas)} color="var(--amarillo)" etiqueta="No asistenciales" />
      </div>
      <h2>Profesionales en {nombre}</h2>
      <div className="tabla-wrap"><table><thead><tr>
        <th>Profesional</th><th>Cargo</th><th>Individual</th><th>Grupal</th><th>Indirecta</th><th>No asist.</th><th>Atenciones</th><th>Cumplimiento</th>
      </tr></thead><tbody>{filas.map((f) => <tr key={f.id}>
        <td>{f.nombre}</td><td>{f.cargo}</td><td>{f.horas.individual}</td><td>{f.horas.grupal}</td><td>{f.horas.indirecta}</td><td>{f.horas.noAsistencial}</td><td>{f.atencionesIndividuales + f.atencionesGrupales}</td>
        <td className={f.cumpleMeta ? "cumple" : "no-cumple"}>{f.cumplimientoMeta.toFixed(0)}%</td>
      </tr>)}</tbody></table></div>
    </>
  );
}

function Tarjeta({ valor, etiqueta }) {
  return <div className="tarjeta"><div className="tarjeta__valor">{valor}</div><div className="tarjeta__etiqueta">{etiqueta}</div></div>;
}
