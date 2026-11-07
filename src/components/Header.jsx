export default function Header() {
  return (
    <header className="topbar">
      <input className="topbar__buscador" placeholder="Buscar profesional o área..." />
      <div className="topbar__derecha">
        <span>Cada hora cuenta</span>
        <div className="avatar">J</div>
      </div>
    </header>
  );
}
