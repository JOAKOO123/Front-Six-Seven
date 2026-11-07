const TOL_MINUTOS = 6;
const TOL_ATENCIONES = 1;

export function minutosAFormato(min) {
  const total = Math.round(min);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export function parseHoras(texto) {
  const s = String(texto).trim();
  const m = s.match(/^(\d+):(\d{1,2})$/);
  if (m) return Number(m[1]) * 60 + Number(m[2]);
  const n = Number(s.replace(",", "."));
  return s !== "" && Number.isFinite(n) && n >= 0 ? Math.round(n * 60) : null;
}

export function parseEntero(texto) {
  const s = String(texto).trim().replace(/\./g, "");
  const n = Number(s);
  return s !== "" && Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
}

export const fmtEntero = (n) => Math.round(n).toLocaleString("es-CL");

export function calcularFila(f, pct) {
  const sumaHoras = f.horasDirecta + f.horasIndirecta + f.horasNAS;
  const sumaAtenciones = f.atencionesDirectas + f.atencionesIndirectas;
  const alertas = [];
  if (Math.abs(sumaHoras - f.horasSemanales) > TOL_MINUTOS) {
    alertas.push({ campo: "horasSemanales", mensaje: `directa + indirecta + NAS suman ${minutosAFormato(sumaHoras)}, pero las horas semanales son ${minutosAFormato(f.horasSemanales)}` });
  }
  if (Math.abs(sumaAtenciones - f.totalAtenciones) > TOL_ATENCIONES) {
    alertas.push({ campo: "totalAtenciones", mensaje: `directas + indirectas suman ${fmtEntero(sumaAtenciones)}, pero el total es ${fmtEntero(f.totalAtenciones)}` });
  }
  return { ...f, metaGestion: Math.round((f.totalAtenciones * pct) / 100), alertas };
}

export function totalesPlan(filas, pct) {
  const s = (campo) => filas.reduce((acc, f) => acc + f[campo], 0);
  return {
    horasSemanales: s("horasSemanales"), horasDirecta: s("horasDirecta"),
    horasIndirecta: s("horasIndirecta"), horasNAS: s("horasNAS"),
    atencionesDirectas: s("atencionesDirectas"), atencionesIndirectas: s("atencionesIndirectas"),
    totalAtenciones: s("totalAtenciones"), metaGestion: s("metaGestion"),
    metaDirectas: Math.round((s("atencionesDirectas") * pct) / 100),
    metaIndirectas: Math.round((s("atencionesIndirectas") * pct) / 100),
  };
}
