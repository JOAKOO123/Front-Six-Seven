import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Historial from "./pages/Historial.jsx";
import Mapa from "./pages/Mapa.jsx";
import Planificacion from "./pages/Planificacion.jsx";
import { PlanificacionProvider } from "./context/PlanificacionContext.jsx";

export default function App() {
  return (
    <PlanificacionProvider>
      <BrowserRouter>
        <div className="app">
          <Sidebar />
          <div className="principal">
            <Header />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/planificacion" element={<Planificacion />} />
              <Route path="/historial" element={<Historial />} />
              <Route path="/mapa" element={<Mapa />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </PlanificacionProvider>
  );
}
