import { useEffect, useState } from "react";

export default function CeldaEditable({ valor, formato, parsear, onGuardar, alerta }) {
  const [texto, setTexto] = useState(formato(valor));
  const [error, setError] = useState(false);

  useEffect(() => {
    setTexto(formato(valor));
    setError(false);
  }, [valor, formato]);

  function confirmar() {
    const nuevo = parsear(texto);
    if (nuevo === null) {
      setError(true);
      setTexto(formato(valor));
      return;
    }
    setError(false);
    if (nuevo !== valor) onGuardar(nuevo);
    else setTexto(formato(valor));
  }

  return <input
    className={alerta || error ? "celda-alerta" : ""}
    value={texto}
    onChange={(e) => { setTexto(e.target.value); setError(false); }}
    onBlur={confirmar}
    onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
  />;
}
