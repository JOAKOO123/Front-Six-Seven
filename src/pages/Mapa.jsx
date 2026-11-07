import { useState } from "react";
import DashboardCiudad from "../components/DashboardCiudad.jsx";
import MapaCiudades from "../components/MapaCiudades.jsx";
import { usePlanificacion } from "../context/usePlanificacion.jsx";
import { ciudades as ciudadesBase } from "../data/ciudades.js";
import { calcularTodos, totales } from "../utils/calculos.js";

export default function Mapa() {
  const { parametros, profesionales } = usePlanificacion();
  const [seleccionada, setSeleccionada] = useState(null);
  const filas = calcularTodos(profesionales, parametros);
  const ciudades = ciudadesBase.map((c) => {
    const filasCiudad = filas.filter((f) => c.profesionalIds.includes(f.id));
    const t = totales(filasCiudad);
    return { ...c, filas: filasCiudad, valor: t.individual + t.grupal + t.indirecta + t.noAsistencial };
  });
  const ciudadSeleccionada = ciudades.find((c) => c.id === seleccionada);

  return (
    <>
      <h1>Mapa de ciudades</h1>
      <div className="nota">Haz clic en una ciudad o columna para ver sus métricas. La altura de cada columna representa las horas registradas.</div>
      <div className="panel mapa-wrap">
        <MapaCiudades ciudades={ciudades} seleccionada={seleccionada} onSeleccionar={setSeleccionada} />
      </div>
      {ciudadSeleccionada ? <DashboardCiudad ciudad={ciudadSeleccionada} /> : <p className="nota">Selecciona una ciudad para ver su dashboard.</p>}
    </>
  );
}
