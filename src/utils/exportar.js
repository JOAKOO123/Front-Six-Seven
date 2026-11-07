export function exportarVersionCSV(filas, mes) {
  const cabecera = ["Profesional", "Cargo", "Área", "Tramo", "Horas contratadas", "Horas disponibles", "Individual", "Grupal", "Indirecta", "No asistencial", "Atenciones individuales", "Atenciones grupales", "Meta horas asistenciales", "Cumplimiento meta %"];
  const cuerpo = filas.map((f) => [
    f.nombre, f.cargo, f.area, f.tramo, f.horasContratadasMes, f.horasDisponibles.toFixed(1),
    f.horas.individual, f.horas.grupal, f.horas.indirecta, f.horas.noAsistencial,
    f.atencionesIndividuales, f.atencionesGrupales, f.metaHorasAsistenciales.toFixed(1),
    f.cumplimientoMeta.toFixed(1),
  ]);
  const csv = [cabecera, ...cuerpo].map((fila) => fila.join(";")).join("\n");
  const nombre = `cada-hora-cuenta_${mes}_${new Date().toISOString().slice(0, 10)}.csv`;
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);
}
