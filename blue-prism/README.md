# Cada hora cuenta · Procesos Blue Prism

Los procesos se construyen en Blue Prism Studio. Este repositorio solo documenta su contrato de entrada y salida.

## Flujo

1. **Extracción BUK (RRHH):** contratos, cargo, tramo de jornada, horas contratadas, licencias y vacaciones por profesional.
2. **Extracción SIC:** horas por tipo de atención (individual, grupal, indirecta, no asistencial) y asignaciones especiales.
3. **Consolidación:** cruce por RUT o ID de profesional. Los registros sin coincidencia se marcan para revisión.
4. **Salida:** archivo `public/data/profesionales.json` con la misma estructura de `src/data/profesionales.js`.

## Trazabilidad

- Cada ejecución registra fecha, hora y resultado en un log.
- Los cambios de parámetros se registran en la aplicación (Historial).
- Las versiones se guardan como copias con fecha en el nombre, por ejemplo `cada-hora-cuenta_2026-11_2026-11-06.csv`.

## Pendiente

- Confirmar con TI el acceso a BUK y SIC desde Blue Prism.
- Definir la llave de cruce entre sistemas.
