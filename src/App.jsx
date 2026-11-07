import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Historial from "./pages/Historial.jsx";
import Mapa from "./pages/Mapa.jsx";
import Admin from "./pages/Admin.jsx";
import Planificacion from "./pages/Planificacion.jsx";
import { PlanificacionProvider } from "./context/PlanificacionContext.jsx";
import { PlanProvider } from "./context/PlanContext.jsx";
import { SesionProvider } from "./context/SesionContext.jsx";

export default function App() {
  return (
    <SesionProvider>
      <PlanificacionProvider>
        <PlanProvider>
        <BrowserRouter>
          <div className="app">
            <Sidebar />
            <div className="principal">
              <Header />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/mapa" element={<Mapa />} />
                <Route path="/planificacion" element={<Planificacion />} />
                <Route path="/historial" element={<Historial />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
        </PlanProvider>
      </PlanificacionProvider>
    </SesionProvider>
  );
}
