import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  Droplets, 
  ShieldCheck, 
  Activity,
  Cpu,
  RefreshCw,
  Search,
  MessageSquare,
  Wind
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { getCityInsights } from '../services/gemini';
import { cn } from '../lib/utils';

const mockMetricData = [
  { name: '00:00', aqi: 120, water: 85, traffic: 40 },
  { name: '04:00', aqi: 90, water: 90, traffic: 20 },
  { name: '08:00', aqi: 150, water: 70, traffic: 95 },
  { name: '12:00', aqi: 180, water: 65, traffic: 80 },
  { name: '16:00', aqi: 160, water: 75, traffic: 85 },
  { name: '20:00', aqi: 140, water: 80, traffic: 60 },
];

export function IntelligenceCenter() {
  const [insights, setInsights] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchInsights = async () => {
    setAnalyzing(true);
    const text = await getCityInsights(mockMetricData);
    setInsights(text);
    setAnalyzing(false);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="pt-24 pb-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">City Intelligence Centre</h1>
            <p className="text-slate-600 font-medium italic serif">AI-driven predictive governance and real-time monitoring.</p>
          </div>
          <button 
            onClick={fetchInsights}
            disabled={analyzing}
            className="flex items-center space-x-2 bg-slate-100 px-6 py-3 rounded-2xl hover:bg-slate-200 transition-all font-bold text-sm text-slate-700 disabled:opacity-50"
          >
            <RefreshCw size={18} className={cn(analyzing && "animate-spin")} />
            <span>Regenerate AI Strategy</span>
          </button>
        </div>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main AI Insight */}
          <div className="lg:col-span-2 glass-card rounded-[2.5rem] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <Brain size={160} className="text-brand-gold" />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center space-x-2 bg-brand-gold/10 px-4 py-1.5 rounded-full text-brand-gold text-xs font-black uppercase tracking-widest mb-8">
                <Cpu size={14} className="ai-pulse" />
                <span>Active AI Strategist</span>
              </div>
              
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Ancient Wisdom Strategy Report</h2>
              
              <div className="prose prose-slate max-w-none text-slate-700 font-medium leading-relaxed mb-8">
                {analyzing ? (
                  <div className="space-y-4">
                    <div className="h-4 bg-slate-100 rounded-full w-full animate-pulse" />
                    <div className="h-4 bg-slate-100 rounded-full w-[90%] animate-pulse" />
                    <div className="h-4 bg-slate-100 rounded-full w-[80%] animate-pulse" />
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{insights || "Waiting for data analysis..."}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Stability Index", val: "94%", color: "text-green-600" },
                  { label: "Resource Flow", val: "Optimal", color: "text-brand-blue" },
                  { label: "Citizen Trust", val: "Rising", color: "text-brand-gold" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/50 p-4 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</div>
                    <div className={cn("text-xl font-black", stat.color)}>{stat.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Metrics Sidebar */}
          <div className="space-y-6">
            <div className="glass-card rounded-[2.5rem] p-8 border-none bg-slate-900 text-white shadow-2xl shadow-slate-900/20">
              <h3 className="font-bold flex items-center space-x-2 mb-8">
                <Activity size={18} className="text-brand-gold" />
                <span>Live Vitals</span>
              </h3>
              <div className="space-y-6">
                {[
                  { icon: Wind, label: "Air Quality", val: "72", unit: "AQI", trend: "-5%", status: "Good" },
                  { icon: Droplets, label: "Water Level", val: "88", unit: "%", trend: "+2%", status: "High" },
                  { icon: Zap, label: "Solar Energy", val: "442", unit: "MW", trend: "+15%", status: "Optimal" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</div>
                        <div className="text-lg font-black text-white">{item.val}<span className="text-[10px] ml-1 font-medium">{item.unit}</span></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn("text-[10px] font-black underline decoration-2 decoration-brand-gold mb-1", item.trend.startsWith('+') ? 'text-green-400' : 'text-blue-400')}>
                        {item.trend}
                      </div>
                      <div className="text-[8px] uppercase font-bold text-slate-500">{item.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-[2.5rem] p-8">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center space-x-2">
                <TrendingUp size={18} className="text-brand-gold" />
                <span>Efficiency Forecast</span>
              </h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockMetricData}>
                    <defs>
                      <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip 
                      contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px', color: '#fff' }}
                      itemStyle={{ color: '#D4AF37' }}
                    />
                    <Area type="monotone" dataKey="aqi" stroke="#D4AF37" fillOpacity={1} fill="url(#colorAqi)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card rounded-[2.5rem] p-10">
            <h3 className="text-xl font-bold text-slate-900 mb-8">Resource Consumption Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockMetricData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="water" fill="#0277BD" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="traffic" fill="#D4AF37" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] p-10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-900">Priority Areas</h3>
              <div className="flex space-x-2">
                <div className="flex items-center space-x-1 text-[10px] font-bold text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span>High Risk</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {[
                { title: "Koramangala Water Pressure", risk: "Low", msg: "Stable flow detected. Maintain current rhythm." },
                { title: "Indiranagar AQI Spike", risk: "Warning", msg: "Particulate matter rising. Activate air purifiers in Sector 3." },
                { title: "Electronic City Traffic Load", risk: "Urgent", msg: "Bottleneck at Silk Board. Reroute via ancient bypass logic." },
              ].map((alert, i) => (
                <div key={i} className="flex items-start space-x-4 border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                    alert.risk === 'Urgent' ? "bg-red-50 text-red-500" : alert.risk === 'Warning' ? "bg-orange-50 text-orange-500" : "bg-green-50 text-green-500"
                  )}>
                    {alert.risk === 'Urgent' ? <AlertTriangle size={24} /> : alert.risk === 'Warning' ? <Activity size={24} /> : <ShieldCheck size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-bold text-slate-900 text-sm">{alert.title}</h4>
                      <span className={cn(
                        "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                        alert.risk === 'Urgent' ? "bg-red-500 text-white" : alert.risk === 'Warning' ? "bg-orange-500 text-white" : "bg-green-500 text-white"
                      )}>{alert.risk}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed italic">{alert.msg}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-8 border-2 border-slate-100 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:border-brand-gold hover:text-brand-gold transition-all">
              View Detailed Heatmaps
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
