import AnilloProgreso from "../components/AnilloProgreso.jsx";
import { usePlanificacion } from "../context/usePlanificacion.jsx";
import { calcularTodos, proyeccionAnual, totales } from "../utils/calculos.js";
import { exportarVersionCSV } from "../utils/exportar.js";

const colores = {
  individual: "var(--cyan)",
  grupal: "var(--magenta)",
  indirecta: "var(--naranja)",
  noAsistencial: "var(--amarillo)",
};

export default function Dashboard() {
  const { parametros, profesionales } = usePlanificacion();
  const filas = calcularTodos(profesionales, parametros);
  const t = totales(filas);
  const horasDirectas = t.individual + t.grupal;
  const pct = (parte, total) => (total ? (parte / total) * 100 : 0);
  const metaMensual = filas.reduce((s, f) => s + f.metaHorasAsistenciales, 0);
  const anual = proyeccionAnual(metaMensual);
  const cumplimientoGlobal = pct(horasDirectas, metaMensual);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1>Dashboard</h1>
          <div className="nota">Mes: {parametros.mes} · Dashboard / Inicio</div>
        </div>
        <button className="boton" onClick={() => exportarVersionCSV(filas, parametros.mes)}>Exportar versión</button>
      </div>
      <h2>Indicadores del mes</h2>
      <div className="tarjetas">
        <Tarjeta valor={t.horasContratadas} etiqueta="Horas contratadas" />
        <Tarjeta valor={t.horasDisponibles.toFixed(1)} etiqueta="Horas disponibles" />
        <Tarjeta valor={t.atenciones} etiqueta="Atenciones proyectadas" />
        <Tarjeta valor={t.asignaciones} etiqueta="Horas asignaciones especiales" />
        <Tarjeta valor={metaMensual.toFixed(0)} etiqueta="Meta de gestión (h)" />
        <Tarjeta valor={anual.metaAnual.toFixed(0)} etiqueta="Proyección anual (h)" />
      </div>
      <h2>Distribución de horas</h2>
      <div className="grid-anillos">
        <AnilloProgreso valor={pct(t.individual, t.horasContratadas)} color={colores.individual} etiqueta="Atención individual" />
        <AnilloProgreso valor={pct(t.grupal, t.horasContratadas)} color={colores.grupal} etiqueta="Atención grupal" />
        <AnilloProgreso valor={pct(t.indirecta, t.horasContratadas)} color={colores.indirecta} etiqueta="Atención indirecta" />
        <AnilloProgreso valor={pct(t.noAsistencial, t.horasContratadas)} color={colores.noAsistencial} etiqueta="No asistenciales" />
        <AnilloProgreso valor={cumplimientoGlobal} color="var(--verde)" etiqueta="Cumplimiento meta" />
      </div>
      <h2>Horas por profesional</h2>
      <div className="panel">
        <div className="leyenda">
          <span style={{ "--c": colores.individual }}>Individual</span>
          <span style={{ "--c": colores.grupal }}>Grupal</span>
          <span style={{ "--c": colores.indirecta }}>Indirecta</span>
          <span style={{ "--c": colores.noAsistencial }}>No asistencial</span>
        </div>
        <div className="barras">
          {filas.map((f) => (
            <div className="barra-fila" key={f.id}>
              <div>{f.nombre}<div className="nota">{f.cargo}</div></div>
              <div className="barra-track">
                <div className="barra-seg" style={{ width: `${pct(f.horas.individual, f.horasContratadasMes)}%`, background: colores.individual }} />
                <div className="barra-seg" style={{ width: `${pct(f.horas.grupal, f.horasContratadasMes)}%`, background: colores.grupal }} />
                <div className="barra-seg" style={{ width: `${pct(f.horas.indirecta, f.horasContratadasMes)}%`, background: colores.indirecta }} />
                <div className="barra-seg" style={{ width: `${pct(f.horas.noAsistencial, f.horasContratadasMes)}%`, background: colores.noAsistencial }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <h2>Desempeño por profesional</h2>
      <div className="tabla-wrap"><table><thead><tr>
        <th>Profesional</th><th>Cargo</th><th>Tramo</th><th>Contratadas</th><th>Disponibles</th><th>Individual</th><th>Grupal</th><th>Indirecta</th><th>No asist.</th><th>Atenciones</th><th>% grupal</th><th>Cumplimiento</th>
      </tr></thead><tbody>{filas.map((f) => <tr key={f.id}>
        <td>{f.nombre}</td><td>{f.cargo}</td><td>{f.tramo}</td><td>{f.horasContratadasMes}</td><td>{f.horasDisponibles.toFixed(1)}</td><td>{f.horas.individual}</td><td>{f.horas.grupal}</td><td>{f.horas.indirecta}</td><td>{f.horas.noAsistencial}</td><td>{f.atencionesIndividuales + f.atencionesGrupales}</td>
        <td className={f.cumpleGrupal ? "cumple" : "no-cumple"}>{f.pctGrupalReal.toFixed(0)}%</td><td className={f.cumpleMeta ? "cumple" : "no-cumple"}>{f.cumplimientoMeta.toFixed(0)}%</td>
      </tr>)}</tbody></table></div>
    </>
  );
}

function Tarjeta({ valor, etiqueta }) {
  return <div className="tarjeta"><div className="tarjeta__valor">{valor}</div><div className="tarjeta__etiqueta">{etiqueta}</div></div>;
}
