import { 
  Menu, 
  X, 
  MapPin, 
  AlertTriangle, 
  BarChart3, 
  Zap, 
  Droplets, 
  Recycle, 
  Wind,
  Cpu,
  Globe,
  Settings,
  Bell,
  User,
  Search,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Languages,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const navLinks = [
    { name: 'City Map', path: '/map', icon: MapPin },
    { name: 'Intelligence', path: '/intelligence', icon: Cpu },
    { name: 'Reports', path: '/citizen', icon: AlertTriangle },
    { name: 'Sustainability', path: '/sustainable', icon: Recycle },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Globe size={24} />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-brand-gold to-brand-earth bg-clip-text text-transparent block leading-tight">
                  IKS Smart City
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">
                  AI Intelligence Platform
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "flex items-center space-x-1.5 text-sm font-medium transition-colors hover:text-brand-gold",
                  location.pathname === link.path ? "text-brand-gold" : "text-slate-600"
                )}
              >
                <link.icon size={16} />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-slate-500 hover:text-brand-gold transition-colors">
              <Languages size={20} />
            </button>
            <button className="p-2 text-slate-500 hover:text-brand-gold transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            {user ? (
              <div className="flex items-center space-x-3 bg-slate-100 py-1.5 pl-1.5 pr-3 rounded-full border border-slate-200">
                <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <button 
                  onClick={() => signOut(auth)}
                  className="text-xs font-semibold text-slate-600 hover:text-red-500 transition-colors uppercase tracking-wider"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-brand-gold text-white px-5 py-2 rounded-full font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Department Login
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 text-lg font-medium text-slate-700 hover:text-brand-gold"
                >
                  <link.icon size={20} />
                  <span>{link.name}</span>
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-100 flex flex-col space-y-4">
                <Link to="/login" className="text-center font-bold text-brand-gold underline">Department Portal</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <div className="flex items-center space-x-2 text-white mb-6">
            <Globe className="text-brand-gold" size={32} />
            <span className="text-2xl font-bold tracking-tight">IKS Smart City Intelligence</span>
          </div>
          <p className="max-w-md leading-relaxed">
            Fusing the timeless wisdom of Ancient Indian Civilizations with cutting-edge AI Governance to build cities that are sustainable, intelligent, and harmonious with nature.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Governance</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/reports" className="hover:text-brand-gold transition-colors">Submit Report</Link></li>
            <li><Link to="/transparency" className="hover:text-brand-gold transition-colors">Public Transparecy</Link></li>
            <li><Link to="/policy" className="hover:text-brand-gold transition-colors">AI Policy</Link></li>
            <li><Link to="/support" className="hover:text-brand-gold transition-colors">Support Center</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Citizen Connect</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/app" className="hover:text-brand-gold transition-colors">Mobile App</Link></li>
            <li><Link to="/whatsapp" className="hover:text-brand-gold transition-colors">WhatsApp Alerts</Link></li>
            <li><Link to="/feedback" className="hover:text-brand-gold transition-colors">Feedback Loop</Link></li>
            <li><Link to="/volunteer" className="hover:text-brand-gold transition-colors">Smart Volunteers</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs">
        <p>© 2026 IKS Smart City Platform. All Rights Reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0 uppercase tracking-widest">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Ethics</a>
        </div>
      </div>
    </footer>
  );
}
