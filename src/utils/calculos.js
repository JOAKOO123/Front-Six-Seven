export function calcularProfesional(p, par) {
  const feriados = par.feriadosNacionales + par.feriadosRegionales;
  const diasTrabajables = Math.max(par.diasHabilesMes - feriados - par.diasVacaciones - p.licenciasDias, 0);
  const horasDisponibles = diasTrabajables * p.jornadaDiaria;
  const horasDirectas = p.horas.individual + p.horas.grupal;
  const horasTotales = horasDirectas + p.horas.indirecta + p.horas.noAsistencial;
  const pacientesGrupo = par.pacientesPorGrupo[p.area] ?? par.pacientesPorGrupo.default;
  const atencionesIndividuales = Math.round((p.horas.individual * 60) / par.duracionSesionMin);
  const sesionesGrupales = Math.round((p.horas.grupal * 60) / par.duracionSesionMin);
  const atencionesGrupales = sesionesGrupales * pacientesGrupo;
  const metaHorasAsistenciales = horasDisponibles * (par.metaAsistencialPct / 100);
  const pctAsistencial = horasDisponibles ? (horasDirectas / horasDisponibles) * 100 : 0;
  const pctGrupalReal = horasDirectas ? (p.horas.grupal / horasDirectas) * 100 : 0;
  const cumplimientoMeta = metaHorasAsistenciales ? (horasDirectas / metaHorasAsistenciales) * 100 : 0;
  return {
    ...p, diasTrabajables, horasDisponibles, horasDirectas, horasTotales,
    atencionesIndividuales, atencionesGrupales, metaHorasAsistenciales, pctAsistencial,
    pctGrupalReal, cumpleGrupal: pctGrupalReal >= par.pctAtencionGrupal,
    cumplimientoMeta, cumpleMeta: cumplimientoMeta >= 100,
  };
}

export function calcularTodos(profesionales, par) {
  return profesionales.map((p) => calcularProfesional(p, par));
}

export function totales(filas) {
  return filas.reduce((acc, f) => ({
    individual: acc.individual + f.horas.individual,
    grupal: acc.grupal + f.horas.grupal,
    indirecta: acc.indirecta + f.horas.indirecta,
    noAsistencial: acc.noAsistencial + f.horas.noAsistencial,
    horasDisponibles: acc.horasDisponibles + f.horasDisponibles,
    horasContratadas: acc.horasContratadas + f.horasContratadasMes,
    atenciones: acc.atenciones + f.atencionesIndividuales + f.atencionesGrupales,
    asignaciones: acc.asignaciones + f.asignacionesEspeciales,
  }), {
    individual: 0, grupal: 0, indirecta: 0, noAsistencial: 0,
    horasDisponibles: 0, horasContratadas: 0, atenciones: 0, asignaciones: 0,
  });
}

export function proyeccionAnual(metaMensual, mesesActivos = 12) {
  return { metaMensual, metaAnual: metaMensual * mesesActivos, mesesActivos };
}
