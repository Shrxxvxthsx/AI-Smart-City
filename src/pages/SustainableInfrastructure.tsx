import { motion } from 'motion/react';
import { 
  Recycle, 
  Zap, 
  Droplets, 
  Sun, 
  Wind, 
  Leaf, 
  Globe, 
  TrendingUp,
  Cpu,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '../lib/utils';

const energyData = [
  { t: '1', v: 400 }, { t: '2', v: 600 }, { t: '3', v: 800 }, { t: '4', v: 1200 }, { t: '5', v: 1100 }, { t: '6', v: 900 }
];

export function SustainableInfrastructure() {
  return (
    <div className="pt-24 pb-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Eco-Civilization Grid</h1>
          <p className="text-slate-600 font-medium italic serif">Managing city resources with zero-waste ancient Indian philosophy.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Resource Card */}
          <div className="lg:col-span-8 space-y-8">
            <div className="glass-card p-10 rounded-[3rem] relative overflow-hidden bg-white border-none shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <Leaf size={200} className="text-brand-green" />
              </div>
              
              <div className="relative z-10 flex flex-col md:flex-row gap-12">
                <div className="md:w-1/2">
                  <div className="w-16 h-16 rounded-3xl bg-brand-green/10 flex items-center justify-center text-brand-green mb-8">
                    <Zap size={32} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-6 leading-tight">Solar-Vedic Integrated Energy Grid</h2>
                  <p className="text-slate-600 font-medium leading-relaxed mb-6">
                    Combining high-efficiency PV arrays with ancient architectural thermal management. Our grid predicts consumption patterns using monsoon cycles and Vedic astrology (temporal data mining).
                  </p>
                  <div className="flex items-center space-x-2 text-brand-green font-black uppercase tracking-widest text-xs">
                    <TrendingUp size={16} />
                    <span>Real-time Efficiency: 98.4%</span>
                  </div>
                </div>
                
                <div className="md:w-1/2 flex flex-col justify-end">
                   <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={energyData}>
                        <defs>
                          <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="#2E7D32" fillOpacity={1} fill="url(#colorGreen)" strokeWidth={4} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-8 rounded-[2.5rem] bg-brand-blue/5 border-none">
                 <div className="w-12 h-12 rounded-2xl bg-brand-blue text-white flex items-center justify-center mb-6">
                   <Droplets size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-4">Aeri-Vedic Water Flow</h3>
                 <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
                   Smart canals modeled after Harappan irrigation systems, utilizing gravitational flow to minimize electricity usage by 40%.
                 </p>
                 <div className="text-[10px] font-black uppercase text-brand-blue tracking-[0.2em]">Active Purification Protocol</div>
              </div>

              <div className="glass-card p-8 rounded-[2.5rem] bg-brand-gold/5 border-none">
                 <div className="w-12 h-12 rounded-2xl bg-brand-gold text-white flex items-center justify-center mb-6">
                   <Recycle size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-4">Zero-Waste Biome</h3>
                 <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
                   Decentralized waste processing units that convert urban refusal into bio-fuel for our public transport drones.
                 </p>
                 <div className="text-[10px] font-black uppercase text-brand-gold tracking-[0.2em]">92% Reclaimations Rate</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
             <div className="glass-card p-8 rounded-[2.5rem] bg-slate-900 text-white border-none shadow-2xl">
                <h3 className="text-lg font-bold mb-8 flex items-center space-x-2">
                  <ShieldCheck size={20} className="text-brand-gold" />
                  <span>Sustainability Khasra</span>
                </h3>
                <div className="space-y-8">
                  {[
                    { label: "Carbon Sequestration", val: "420 kt/yr", prog: 75, col: "bg-brand-green" },
                    { label: "Solar Autonomy", val: "68%", prog: 68, col: "bg-brand-gold" },
                    { label: "Water Recycling", val: "94%", prog: 94, col: "bg-brand-blue" },
                  ].map((item, id) => (
                    <div key={id}>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="text-white">{item.val}</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.prog}%` }}
                          className={cn("h-full", item.col)} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-10 bg-white/10 hover:bg-white/20 transition-all py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-2">
                  <span>Transparency Explorer</span>
                  <ChevronRight size={14} />
                </button>
             </div>

             <div className="glass-card p-8 rounded-[2.5rem] border-dashed">
                <div className="flex items-center space-x-3 mb-6">
                  <Cpu size={24} className="text-brand-gold" />
                  <h4 className="font-bold text-slate-900">AI Grid Operator</h4>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4 italic text-xs text-slate-600 font-medium">
                  "Peak solar window detected. Diverting excess bounty to agricultural sectors and deep-freeze logistics."
                </div>
                <div className="flex items-center space-x-2">
                   <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white" />
                      <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white" />
                   </div>
                   <span className="text-[10px] font-bold text-slate-400">4 Intelligent Agents Online</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
