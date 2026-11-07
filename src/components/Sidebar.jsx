import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">Cada hora cuenta</div>
      <nav className="sidebar__nav">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/mapa">Mapa</NavLink>
        <NavLink to="/planificacion">Planificación</NavLink>
        <NavLink to="/historial">Historial</NavLink>
      </nav>
    </aside>
  );
}
