import { motion } from 'motion/react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Map as MapIcon, 
  BarChart3, 
  Wind, 
  Droplet, 
  Leaf, 
  Lightbulb, 
  Compass,
  ScrollText,
  Activity,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background with cinematic treatment */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-slate-900/40 z-10" />
        <img 
          src="https://picsum.photos/seed/smartcity/1920/1080?blur=4" 
          alt="AI Smart City" 
          className="w-full h-full object-cover opacity-60 scale-110"
        />
        {/* Animated Particles or Orbs could go here */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-green/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 flex justify-center"
        >
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-slate-800 text-sm font-semibold shadow-lg">
            <span className="flex h-2 w-2 rounded-full bg-brand-gold animate-ping" />
            <span>Harmonizing Tradition with Technology</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight text-slate-900"
        >
          AI Smart City <br />
          <span className="bg-gradient-to-r from-brand-gold via-brand-earth to-brand-green bg-clip-text text-transparent italic serif font-medium">Intelligence Platform</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-2xl text-slate-700 max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
        >
          Building smarter, sustainable, and healthier cities through the fusion of Ancient Indian Knowledge Systems and advanced AI Governance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
        >
          <Link 
            to="/citizen" 
            className="w-full sm:w-auto bg-brand-gold text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center space-x-2"
          >
            <span>Citizen Dashboard</span>
            <ChevronRight size={20} />
          </Link>
          <Link 
            to="/intelligence" 
            className="w-full sm:w-auto bg-white/80 backdrop-blur-md text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg border border-slate-200 hover:bg-white transition-all flex items-center justify-center space-x-2"
          >
            <span>AI Insights</span>
            <Cpu size={20} className="text-brand-gold" />
          </Link>
        </motion.div>

        {/* Floating Icons Display */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {[
            { icon: Droplet, label: "Ancient Water Wisdom", color: "text-blue-500" },
            { icon: Wind, label: "Air Quality Control", color: "text-brand-green" },
            { icon: Lightbulb, label: "Solar Energy Grid", color: "text-brand-gold" },
            { icon: ShieldCheck, label: "Secure Governance", color: "text-slate-700" }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + (idx * 0.1) }}
              className="glass-card p-6 rounded-3xl flex flex-col items-center justify-center text-center group hover:scale-105 transition-transform"
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors", item.color, "bg-slate-50 group-hover:bg-brand-gold group-hover:text-white")}>
                <item.icon size={24} />
              </div>
              <span className="font-bold text-sm text-slate-800">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const features = [
    {
      title: "Smart Monitoring",
      desc: "Live IoT sensors tracking every drop of water and breath of air with precision inspired by Vedic ecosystems.",
      icon: Activity,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "AI Intelligence",
      desc: "Predictive modeling that anticipates urban crises before they happen, suggesting root-cause resolutions.",
      icon: Cpu,
      color: "bg-purple-50 text-purple-600"
    },
    {
      title: "Public Participation",
      desc: "An elegant portal for direct citizen reporting, verified and prioritized by our ethical AI engine.",
      icon: ScrollText,
      color: "bg-brand-gold/10 text-brand-gold"
    },
    {
      title: "Sustainable Infra",
      desc: "Modern utilities built on ancient Indian principles of zero-waste and solar-centric energy flow.",
      icon: Leaf,
      color: "bg-green-50 text-brand-green"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-gold mb-4">Core Capabilities</h2>
          <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">The Operating System for Futuristic Civilizations</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 group"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8", f.color)}>
                <f.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
