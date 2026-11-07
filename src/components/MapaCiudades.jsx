import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const ESTILO = "https://tiles.openfreemap.org/styles/liberty";

function columnas(ciudades) {
  const medio = 0.04;
  return {
    type: "FeatureCollection",
    features: ciudades.map((c) => ({
      type: "Feature",
      properties: { id: c.id, altura: Math.max(c.valor * 15, 30) },
      geometry: { type: "Polygon", coordinates: [[
        [c.lng - medio, c.lat - medio], [c.lng + medio, c.lat - medio],
        [c.lng + medio, c.lat + medio], [c.lng - medio, c.lat + medio],
        [c.lng - medio, c.lat - medio],
      ]] },
    })),
  };
}

export default function MapaCiudades({ ciudades, seleccionada, onSeleccionar }) {
  const contenedor = useRef(null);
  const mapa = useRef(null);
  const marcadores = useRef([]);
  const callback = useRef(onSeleccionar);
  const datos = useRef(ciudades);

  useEffect(() => {
    callback.current = onSeleccionar;
    datos.current = ciudades;
  }, [ciudades, onSeleccionar]);

  useEffect(() => {
    const map = new maplibregl.Map({ container: contenedor.current, style: ESTILO, center: [-71, -34.5], zoom: 4.2, pitch: 55, bearing: -10 });
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    mapa.current = map;
    map.on("load", () => {
      map.addSource("columnas", { type: "geojson", data: columnas(datos.current) });
      map.addLayer({ id: "columnas", type: "fill-extrusion", source: "columnas", paint: {
        "fill-extrusion-color": "#22d3ee", "fill-extrusion-height": ["get", "altura"],
        "fill-extrusion-base": 0, "fill-extrusion-opacity": 0.85,
      } });
      map.on("click", "columnas", (e) => {
        const id = e.features?.[0]?.properties?.id;
        if (id) callback.current(id);
      });
      map.on("mouseenter", "columnas", () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", "columnas", () => { map.getCanvas().style.cursor = ""; });
    });
    return () => map.remove();
  }, []);

  useEffect(() => {
    const source = mapa.current?.getSource("columnas");
    if (source) source.setData(columnas(ciudades));
  }, [ciudades]);

  useEffect(() => {
    if (!mapa.current) return;
    marcadores.current.forEach((marcador) => marcador.remove());
    marcadores.current = ciudades.map((c) => {
      const el = document.createElement("button");
      el.className = `marcador${c.id === seleccionada ? " marcador--activo" : ""}`;
      el.textContent = c.nombre;
      el.onclick = () => {
        callback.current(c.id);
        mapa.current.flyTo({ center: [c.lng, c.lat], zoom: 7.5, pitch: 60, bearing: -10, duration: 1400 });
      };
      return new maplibregl.Marker({ element: el, anchor: "bottom" }).setLngLat([c.lng, c.lat]).addTo(mapa.current);
    });
  }, [ciudades, seleccionada]);

  return <div ref={contenedor} className="mapa" />;
}
