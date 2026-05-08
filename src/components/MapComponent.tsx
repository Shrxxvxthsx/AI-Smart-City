import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { CitizenReport } from '../types';

// Fix for default leaflet icons in React
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  reports?: CitizenReport[];
  center?: [number, number];
  zoom?: number;
}

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export function MapComponent({ reports = [], center = [12.9716, 77.5946], zoom = 12 }: MapProps) {
  return (
    <div className="w-full h-full rounded-3xl overflow-hidden shadow-inner bg-slate-100">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {reports.map((report) => (
          <Marker 
            key={report.id} 
            position={[report.location.lat, report.location.lng]}
          >
            <Popup>
              <div className="p-1">
                <div className="text-[10px] font-black uppercase text-brand-gold tracking-widest mb-1">{report.category}</div>
                <div className="font-bold text-slate-800 text-sm mb-2">{report.description.slice(0, 50)}...</div>
                <div className="flex items-center space-x-2">
                   <div className={`w-2 h-2 rounded-full ${report.status === 'resolved' ? 'bg-green-500' : 'bg-orange-500'}`} />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{report.status}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Example Heatmap Circles */}
        <Circle 
          center={[12.9716, 77.5946]} 
          radius={2000} 
          pathOptions={{ fillColor: '#D4AF37', border: 'none', fillOpacity: 0.1, color: 'transparent' }} 
        />
        <Circle 
          center={[12.98, 77.6]} 
          radius={1200} 
          pathOptions={{ fillColor: '#ef4444', border: 'none', fillOpacity: 0.1, color: 'transparent' }} 
        />
      </MapContainer>
    </div>
  );
}
