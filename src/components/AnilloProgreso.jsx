export default function AnilloProgreso({ valor, color, etiqueta }) {
  const radio = 34;
  const circunferencia = 2 * Math.PI * radio;
  const pct = Math.min(Math.max(valor, 0), 100);

  return (
    <div className="anillo panel">
      <svg viewBox="0 0 80 80" width="100" height="100">
        <circle cx="40" cy="40" r={radio} className="anillo__base" />
        <circle
          cx="40"
          cy="40"
          r={radio}
          className="anillo__progreso"
          stroke={color}
          strokeDasharray={circunferencia}
          strokeDashoffset={circunferencia * (1 - pct / 100)}
          transform="rotate(-90 40 40)"
        />
        <text x="40" y="45" textAnchor="middle" className="anillo__txt">{Math.round(pct)}%</text>
      </svg>
      <div className="anillo__etq">{etiqueta}</div>
    </div>
  );
}
