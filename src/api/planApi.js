const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export async function guardarPlan(payload) {
  try {
    const respuesta = await fetch(`${BASE}/api/plan/guardar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await respuesta.json();
    if (!respuesta.ok) return { ok: false, errores: data.errores ?? ["El servidor rechazó el guardado."] };
    return { ok: true, ...data };
  } catch {
    return { ok: false, errores: ["No se pudo conectar con el backend. El endpoint /api/plan/guardar aún no está disponible."] };
  }
}
