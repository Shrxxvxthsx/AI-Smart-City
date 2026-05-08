import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Cpu, 
  MoreVertical,
  Search,
  Filter,
  Download,
  Mail,
  Smartphone,
  ChevronRight,
  TrendingUp,
  Map as MapIcon,
  Trash2
} from 'lucide-react';
import { db } from '../services/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { CitizenReport } from '../types';
import { cn, formatTimestamp } from '../lib/utils';

export function AdminDashboard() {
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CitizenReport)));
    });
  }, []);

  const stats = [
    { label: "Open Issues", val: reports.filter(r => r.status !== 'resolved').length, icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Resolved Today", val: reports.filter(r => r.status === 'resolved').length, icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
    { label: "Avg Response Time", val: "2.4h", icon: Clock, color: "text-brand-blue", bg: "bg-blue-50" },
    { label: "AI Efficiency Gap", val: "+12%", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  const updateStatus = async (id: string, newStatus: string) => {
    const reportRef = doc(db, 'reports', id);
    await updateDoc(reportRef, { 
      status: newStatus,
      updatedAt: serverTimestamp()
    });
    if (selectedReport?.id === id) {
      setSelectedReport({ ...selectedReport, status: newStatus as any });
    }
  };

  const deleteReport = async (id: string) => {
    if (confirm("Permanently remove this intelligence record?")) {
      await deleteDoc(doc(db, 'reports', id));
      setSelectedReport(null);
    }
  };

  return (
    <div className="pt-24 pb-12 bg-slate-50 min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
        {/* Statistics Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="glass-card p-6 rounded-[2rem] border-none shadow-sm flex items-center space-x-4"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                <stat.icon size={28} />
              </div>
              <div>
                <div className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{stat.label}</div>
                <div className="text-3xl font-black text-slate-900">{stat.val}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Main List */}
          <div className="xl:col-span-8 flex flex-col space-y-6">
            <div className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col border-none bg-white">
              <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center space-x-6">
                  {['all', 'pending', 'in-progress', 'resolved'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "text-xs font-black uppercase tracking-widest transition-all pb-1 border-b-2",
                        activeTab === tab ? "border-brand-gold text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="relative w-full md:w-64">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search intelligence..." 
                    className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest">Issue & Category</th>
                      <th className="px-8 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest">Status</th>
                      <th className="px-8 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest">Priority</th>
                      <th className="px-8 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest">Date</th>
                      <th className="px-8 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reports
                      .filter(r => activeTab === 'all' || r.status === activeTab)
                      .map((report) => (
                      <tr 
                        key={report.id} 
                        onClick={() => setSelectedReport(report)}
                        className={cn(
                          "cursor-pointer hover:bg-slate-50 transition-colors group",
                          selectedReport?.id === report.id ? "bg-slate-50/80" : ""
                        )}
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                              <MapIcon size={18} />
                            </div>
                            <div>
                              <div className="text-sm font-black text-slate-900 line-clamp-1">{report.description}</div>
                              <div className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">{report.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-[0.15em]",
                            report.status === 'resolved' ? "bg-green-100 text-green-600" :
                            report.status === 'pending' ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                          )}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center space-x-2">
                             <div className={cn(
                               "w-2 h-2 rounded-full",
                               report.priority === 'critical' ? "bg-red-500 ai-pulse" :
                               report.priority === 'high' ? "bg-orange-500" :
                               report.priority === 'medium' ? "bg-brand-gold" : "bg-green-500"
                             )} />
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{report.priority}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-[10px] font-bold text-slate-400">
                            {report.createdAt ? formatTimestamp(report.createdAt.toDate()) : 'Recently'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <ChevronRight size={16} className="text-slate-300 group-hover:text-brand-gold group-hover:translate-x-1 transition-all" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="xl:col-span-4">
            <AnimatePresence mode="wait">
              {selectedReport ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  key="details"
                  className="glass-card rounded-[2.5rem] bg-white border-none space-y-8 sticky top-24"
                >
                  <div className="p-8 pb-0">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black text-slate-900 italic serif">Intelligence Record</h3>
                      <button onClick={() => deleteReport(selectedReport.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                       <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Original Context</div>
                         <p className="text-sm text-slate-700 font-medium leading-relaxed">{selectedReport.description}</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 bg-slate-900 rounded-2xl">
                         <div className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Impact Level</div>
                         <div className="text-lg font-black text-brand-gold">{selectedReport.aiAnalysis?.severityScore || 'TBD'}/10</div>
                      </div>
                      <div className="p-4 bg-slate-100 rounded-2xl">
                         <div className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Citizen Trust</div>
                         <div className="text-lg font-black text-slate-800">Verified</div>
                      </div>
                    </div>

                    {/* AI Engine Section */}
                    {selectedReport.aiAnalysis && (
                      <div className="p-6 bg-brand-gold/5 border border-brand-gold/10 rounded-3xl mb-8">
                         <div className="flex items-center space-x-2 mb-4">
                           <Cpu size={18} className="text-brand-gold ai-pulse" />
                           <span className="text-xs font-black uppercase tracking-widest text-brand-gold">Vedic AI Recommender</span>
                         </div>
                         <p className="text-sm font-bold text-slate-800 italic mb-4 leading-snug">"{selectedReport.aiAnalysis.summary}"</p>
                         <div className="space-y-2">
                           {selectedReport.aiAnalysis.suggestedActions.map((action, i) => (
                             <div key={i} className="flex items-center space-x-2 text-[11px] font-bold text-slate-600">
                               <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                               <span>{action}</span>
                             </div>
                           ))}
                         </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Action Protocol</div>
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => updateStatus(selectedReport.id, 'in-progress')}
                          className={cn(
                            "py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            selectedReport.status === 'in-progress' ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          )}
                        >
                          Acknowledge
                        </button>
                        <button 
                          onClick={() => updateStatus(selectedReport.id, 'resolved')}
                          className={cn(
                            "py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            selectedReport.status === 'resolved' ? "bg-green-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          )}
                        >
                          Mark Solved
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 pt-0 mt-8 border-t border-slate-50">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Users size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">{selectedReport.citizenName}</div>
                        <div className="text-[10px] font-bold text-slate-400">Verified Citizen ID: S-{selectedReport.id.slice(-4).toUpperCase()}</div>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button className="flex-1 bg-slate-900 text-white rounded-xl py-3 flex items-center justify-center space-x-2 hover:bg-slate-800 transition-colors">
                        <Mail size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Update Via Neural</span>
                      </button>
                      <button className="p-3 border-2 border-slate-100 rounded-xl text-slate-400 hover:text-brand-gold transition-colors">
                        <Smartphone size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="glass-card rounded-[2.5rem] h-[600px] flex flex-col items-center justify-center text-center p-12 bg-white/40 border-dashed">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
                    <BarChart3 size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Select Intelligence Record</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Choose a report from the activity terminal to begin strategic analysis and coordination.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
