import { usePlan } from "../context/PlanContext.jsx";
import TablaPlan from "../components/TablaPlan.jsx";
import { fmtEntero } from "../utils/plan.js";

export default function Dashboard() {
  const { filas, totales, pct } = usePlan();

  return (
    <>
      <h1>Dashboard</h1>
      <div className="nota">Médico terapéutico · Socio educativo · Meta al {pct}%</div>
      <h2>Indicadores generales</h2>
      <div className="tarjetas">
        <Tarjeta valor={fmtEntero(totales.horasSemanales / 60)} etiqueta="Horas semanales" />
        <Tarjeta valor={fmtEntero(totales.totalAtenciones)} etiqueta="Total atenciones por año" />
        <Tarjeta valor={fmtEntero(totales.metaGestion)} etiqueta={`Meta de gestión al ${pct}%`} />
        <Tarjeta valor={filas.length} etiqueta="Institutos" />
      </div>
      <h2>Planificación por instituto</h2>
      <TablaPlan filas={filas} totales={totales} pct={pct} />
    </>
  );
}

function Tarjeta({ valor, etiqueta }) {
  return <div className="tarjeta"><div className="tarjeta__valor">{valor}</div><div className="tarjeta__etiqueta">{etiqueta}</div></div>;
}
