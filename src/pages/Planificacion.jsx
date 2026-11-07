import { useState } from "react";
import { usePlanificacion } from "../context/usePlanificacion.jsx";

const camposNumericos = [
  { campo: "diasHabilesMes", etiqueta: "Días hábiles del mes" },
  { campo: "feriadosNacionales", etiqueta: "Feriados nacionales" },
  { campo: "feriadosRegionales", etiqueta: "Feriados regionales" },
  { campo: "diasVacaciones", etiqueta: "Días de vacaciones" },
  { campo: "duracionSesionMin", etiqueta: "Duración sesión (min)" },
  { campo: "metaAsistencialPct", etiqueta: "Meta asistencial (%)" },
  { campo: "pctAtencionGrupal", etiqueta: "% atención grupal" },
];

export default function Planificacion() {
  const { parametros, cambiarParametro } = usePlanificacion();
  const [campo, setCampo] = useState(camposNumericos[0].campo);
  const [valor, setValor] = useState("");
  const [autor, setAutor] = useState("");
  const [justificacion, setJustificacion] = useState("");
  const [error, setError] = useState("");

  function guardar(e) {
    e.preventDefault();
    if (!autor.trim() || !justificacion.trim()) return setError("Autor y justificación son obligatorios.");
    const numero = Number(valor);
    if (Number.isNaN(numero) || numero < 0) return setError("El valor debe ser un número positivo.");
    cambiarParametro(campo, numero, autor.trim(), justificacion.trim());
    setValor(""); setJustificacion(""); setError("");
  }

  return <>
    <h1>Planificación y parámetros</h1>
    <h2>Parámetros vigentes · {parametros.mes}</h2>
    <table><tbody>{camposNumericos.map((c) => <tr key={c.campo}><th>{c.etiqueta}</th><td>{parametros[c.campo]}</td></tr>)}</tbody></table>
    <h2>Modificar parámetro</h2>
    <form className="formulario" onSubmit={guardar}>
      <label>Parámetro<select value={campo} onChange={(e) => setCampo(e.target.value)}>{camposNumericos.map((c) => <option key={c.campo} value={c.campo}>{c.etiqueta}</option>)}</select></label>
      <label>Nuevo valor<input type="number" value={valor} onChange={(e) => setValor(e.target.value)} /></label>
      <label>Solicitado / autorizado por<input value={autor} onChange={(e) => setAutor(e.target.value)} /></label>
      <label className="ancho-total">Justificación<textarea rows={3} value={justificacion} onChange={(e) => setJustificacion(e.target.value)} /></label>
      {error && <p className="no-cumple ancho-total">{error}</p>}
      <div className="ancho-total"><button className="boton" type="submit">Registrar cambio</button></div>
    </form>
    <p className="nota">Cada cambio queda en el Historial con autor, justificación y fecha.</p>
  </>;
}
