import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar, Footer } from './components/Navigation';
import { Hero, FeaturesSection } from './components/Hero';
import { CitizenPortal } from './pages/CitizenPortal';
import { AdminDashboard } from './pages/AdminDashboard';
import { IntelligenceCenter } from './pages/IntelligenceCenter';
import { DepartmentLogin } from './pages/DepartmentLogin';
import { SustainableInfrastructure } from './pages/SustainableInfrastructure';
import { PublicMap } from './pages/PublicMap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './services/firebase';

function LandingPage() {
  return (
    <main>
      <Hero />
      <FeaturesSection />
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <img 
              src="https://picsum.photos/seed/iks-architecture/800/600" 
              className="rounded-[3rem] shadow-2xl border-8 border-white"
              alt="Ancient Architecture"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-sm font-bold text-brand-gold uppercase tracking-widest mb-4 italic serif">Our Heritage</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">Wisdom from Harappa to Artificial Intelligence</h3>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Ancient Indian civilizations were masters of urban planning, water management, and sustainable living. We've digitized these principles into a modern city OS that balances progress with planetary health.
            </p>
            <ul className="space-y-4">
              {[
                "Regenerative Water Systems",
                "Community-Led Governance",
                "Solar-Centric Infrastructure",
                "Biodiversity Integrated Planning"
              ].map((item, id) => (
                <li key={id} className="flex items-center space-x-3 font-bold text-slate-800">
                  <div className="w-6 h-6 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold">
                    ✓
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-brand-gold font-bold animate-pulse text-sm uppercase tracking-widest">Gathering City Intelligence...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/citizen" element={<CitizenPortal />} />
            <Route path="/map" element={<PublicMap />} />
            <Route path="/intelligence" element={<IntelligenceCenter />} />
            <Route path="/login" element={<DepartmentLogin />} />
            <Route path="/sustainable" element={<SustainableInfrastructure />} />
            <Route 
              path="/admin/*" 
              element={user ? <AdminDashboard /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
