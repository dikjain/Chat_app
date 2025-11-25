import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";

// Component to handle map resize
function MapResizeHandler() {
  const map = useMap();
  
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
}

const MapView = ({ lat, lng }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !lat || !lng || isNaN(lat) || isNaN(lng)) {
    return (
      <div className="w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
        <p className="text-gray-500 text-sm">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden p-1 flex items-center justify-center m-0" style={{ minHeight: "300px", minWidth: "300px" }}>
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        style={{ height: "300px", width: "100%", minWidth: "300px", borderRadius: "12px", zIndex: 0 }}
        scrollWheelZoom={false}
        key={`${lat}-${lng}`}
        zoomControl={false}
      >
        <MapResizeHandler />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[lat, lng]}>
          <Popup>
            Shared Location<br />
            {lat.toFixed(6)}, {lng.toFixed(6)}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapView;

