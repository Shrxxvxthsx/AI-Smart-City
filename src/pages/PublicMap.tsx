import { useState, useEffect } from 'react';
import { MapComponent } from '../components/MapComponent';
import { db } from '../services/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { CitizenReport } from '../types';
import { Filter, Globe, Layers, MapPin, Search } from 'lucide-react';
import { cn } from '../lib/utils';

export function PublicMap() {
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const q = query(collection(db, 'reports'));
    return onSnapshot(q, (snapshot) => {
      setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CitizenReport)));
    });
  }, []);

  const filteredReports = activeCategory === 'all' 
    ? reports 
    : reports.filter(r => r.category === activeCategory);

  return (
    <div className="pt-16 h-screen flex flex-col md:flex-row overflow-hidden bg-white">
      {/* Sidebar Control */}
      <div className="w-full md:w-96 bg-white border-r border-slate-100 flex flex-col z-10 shadow-xl overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-brand-gold rounded-2xl flex items-center justify-center text-white">
              <Globe size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Smart Heatmap</h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Real-time City Sentiment</p>
            </div>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by area or ID..." 
              className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-medium outline-none border-2 border-transparent focus:border-brand-gold transition-all"
            />
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Active Data Layers</label>
              <div className="space-y-2">
                {[
                  { id: 'all', label: 'All Intelligence', icon: Layers },
                  { id: 'pollution', label: 'Air Quality Hazards', icon: Filter },
                  { id: 'water', label: 'Water Infrastructure', icon: MapPin },
                  { id: 'traffic', label: 'Traffic Congestion', icon: MapPin },
                ].map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setActiveCategory(layer.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-sm",
                      activeCategory === layer.id 
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
                        : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <layer.icon size={18} className={activeCategory === layer.id ? "text-brand-gold" : "text-slate-400"} />
                      <span>{layer.label}</span>
                    </div>
                    {activeCategory === layer.id && <div className="w-2 h-2 rounded-full bg-brand-gold ai-pulse" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-brand-gold/10 rounded-[2rem] border border-brand-gold/20">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-gold mb-2 italic">Legend Insight</h4>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Red hotspots indicate critical deviations from Ancient Vedic Equilibrium. Green zones represent optimized sustainability.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map View */}
      <div className="flex-grow relative h-full">
        <MapComponent reports={filteredReports} />
        
        {/* Float Controls */}
        <div className="absolute top-8 right-8 z-[1000] flex flex-col space-y-3">
           {[1, 2, 3].map(i => (
             <button key={i} className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center hover:bg-slate-50 transition-colors">
                <Layers size={18} className="text-slate-600" />
             </button>
           ))}
        </div>
      </div>
    </div>
  );
}
