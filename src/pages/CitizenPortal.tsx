import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  MapPin, 
  Image as ImageIcon, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  Filter,
  Search,
  X,
  Cpu
} from 'lucide-react';
import React from 'react';
import { db, auth } from '../services/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { analyzeReport } from '../services/gemini';
import { cn, formatTimestamp } from '../lib/utils';
import { CitizenReport } from '../types';

export function CitizenPortal() {
  const [user] = useAuthState(auth);
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [isReporting, setIsReporting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Form State
  const [category, setCategory] = useState('waste');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CitizenReport)));
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login as a citizen to report (Simplifying: Login not strictly required for this demo's reporting flow, but user data is tracked if available)");
    }
    
    setSubmitting(true);
    setLoading(true);

    try {
      // 1. Get AI Analysis
      const analysis = await analyzeReport(category, description, "Bangalore - Sector 4");

      // 2. Save to Firestore
      await addDoc(collection(db, 'reports'), {
        citizenId: user?.uid || 'anonymous',
        citizenName: user?.displayName || 'Citizen',
        category,
        description,
        location: {
          lat: 12.9716 + (Math.random() * 0.01),
          lng: 77.5946 + (Math.random() * 0.01),
          address: "Bangalore - Sector 4"
        },
        status: 'pending',
        priority: analysis?.priority || 'medium',
        aiAnalysis: analysis,
        assignedDept: analysis?.assignedDept || 'General Administration',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setIsReporting(false);
      setDescription('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const filteredReports = activeFilter === 'all' 
    ? reports 
    : reports.filter(r => r.category === activeFilter);

  return (
    <div className="pt-24 pb-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">Citizen Voice Portal</h1>
            <p className="text-slate-600 font-medium italic serif">Report issues, track resolutions, and participate in city design.</p>
          </div>
          <button 
            onClick={() => setIsReporting(true)}
            className="w-full md:w-auto bg-brand-gold text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-brand-gold/20 hover:-translate-y-1 transition-all"
          >
            <Plus size={20} />
            <span>Report New Issue</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar / Filters */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-card p-6 rounded-3xl">
              <div className="flex items-center space-x-2 mb-6">
                <Filter size={18} className="text-brand-gold" />
                <h3 className="font-bold text-slate-900">Categories</h3>
              </div>
              <div className="space-y-2">
                {['all', 'traffic', 'pollution', 'waste', 'water', 'energy', 'agriculture', 'safety'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={cn(
                      "w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all",
                      activeFilter === cat 
                        ? "bg-brand-gold text-white shadow-md shadow-brand-gold/20" 
                        : "text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl bg-slate-900 text-white border-none shadow-brand-blue/20">
              <h3 className="font-bold mb-4 flex items-center space-x-2">
                <CheckCircle2 size={18} className="text-green-400" />
                <span>Impact Score</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4 font-medium leading-relaxed">
                Your contributions help us reach our sustainability goals faster. Current community participation score:
              </p>
              <div className="text-4xl font-black text-brand-gold">8.4<span className="text-sm text-slate-400 ml-1">/10</span></div>
              <div className="mt-4 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-brand-gold h-full w-[84%]" />
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-9 space-y-6">
            {filteredReports.length === 0 ? (
              <div className="text-center py-20 glass-card rounded-[2.5rem]">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No reports found</h3>
                <p className="text-slate-500">Be the first to report an issue in your sector.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredReports.map((report) => (
                  <motion.div 
                    layout
                    key={report.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "p-6 rounded-[2rem] border-2 transition-all hover:shadow-xl group",
                      report.status === 'resolved' ? "bg-green-50 border-green-100" : "bg-white border-slate-100"
                    )}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        report.status === 'resolved' ? "bg-green-500 text-white" : 
                        report.status === 'pending' ? "bg-orange-500 text-white" : "bg-blue-500 text-white"
                      )}>
                        {report.status}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {report.createdAt ? formatTimestamp(report.createdAt.toDate()) : 'Recent'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 capitalize text-lg">{report.category} Report</h4>
                        <p className="text-xs text-brand-blue font-bold tracking-tight">{report.location.address}</p>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {report.description}
                    </p>

                    {report.aiAnalysis && (
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
                        <div className="flex items-center space-x-2 mb-2">
                          <Cpu size={14} className="text-brand-gold" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">AI Analysis</span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 italic leading-snug">{report.aiAnalysis.summary}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 border-dashed">
                      <div className="flex items-center -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                        ))}
                        <span className="text-[10px] text-slate-400 font-bold ml-4">+12 neighbors impacted</span>
                      </div>
                      <button className="text-brand-gold flex items-center space-x-1 text-xs font-black uppercase tracking-wider group-hover:mr-2 transition-all">
                        <span>Details</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reporting Modal */}
      <AnimatePresence>
        {isReporting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitting && setIsReporting(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Report City Issue</h2>
                  <button onClick={() => setIsReporting(false)} className="p-2 hover:bg-slate-100 rounded-full">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Category</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['waste', 'water', 'energy', 'traffic', 'pollution', 'safety'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={cn(
                            "py-3 rounded-2xl text-xs font-bold capitalize transition-all",
                            category === cat ? "bg-brand-gold text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Describe the Situation</label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Explain the issue clearly..."
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-3xl text-sm focus:border-brand-gold focus:ring-0 outline-none min-h-[120px] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" className="flex items-center justify-center space-x-2 p-4 bg-slate-100 rounded-2xl text-slate-600 text-xs font-bold hover:bg-slate-200 transition-all">
                      <ImageIcon size={16} />
                      <span>Attach Photo</span>
                    </button>
                    <button type="button" className="flex items-center justify-center space-x-2 p-4 bg-slate-100 rounded-2xl text-slate-600 text-xs font-bold hover:bg-slate-200 transition-all">
                      <MapPin size={16} />
                      <span>Detect Location</span>
                    </button>
                  </div>

                  <button
                    disabled={submitting}
                    className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-bold shadow-xl shadow-slate-900/10 hover:-translate-y-1 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:translate-y-0"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Intelligence Engine Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Submit Issue to AI Agent</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
