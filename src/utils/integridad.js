import { calcularFila } from "./plan.js";

const CAMPOS_NUMERICOS = [
  "horasSemanales", "horasDirecta", "horasIndirecta", "horasNAS",
  "atencionesDirectas", "atencionesIndirectas", "totalAtenciones",
];

export function verificarIntegridad(datos, pct) {
  const errores = [];
  const nombres = datos.map((f) => f.instituto.trim().toLowerCase());

  datos.forEach((f, i) => {
    const nombre = f.instituto.trim();
    const ref = nombre || `Fila ${i + 1}`;
    if (!nombre) errores.push(`Fila ${i + 1}: falta el nombre del instituto.`);
    else if (nombres.indexOf(nombres[i]) !== i) errores.push(`${ref}: el nombre está repetido.`);
    CAMPOS_NUMERICOS.forEach((campo) => {
      if (!Number.isFinite(f[campo]) || f[campo] < 0) errores.push(`${ref}: valor inválido en ${campo}.`);
    });
    calcularFila(f, pct).alertas.forEach((a) => errores.push(`${ref}: ${a.mensaje}.`));
  });
  return errores;
}
