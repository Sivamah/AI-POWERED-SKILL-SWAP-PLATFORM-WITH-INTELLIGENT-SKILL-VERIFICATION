import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FindTutor({ token }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);

    // Session Request State
    const [requestModal, setRequestModal] = useState({ open: false, teacherId: null, skillName: null, teacherName: null });

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        setSearching(true);
        axios.get(`${API_URL}/find_tutor?query=${query}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setResults(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }

    const initiateRequest = (teacherId, skillName, teacherName) => {
        setRequestModal({ open: true, teacherId, skillName, teacherName });
    }

    const confirmRequest = (type) => {
        const { teacherId, skillName } = requestModal;

        axios.post(`${API_URL}/request_session`, null, {
            params: { teacher_id: teacherId, skill_name: skillName, session_type: type },
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (res.data.auto_accepted) {
                    alert(`✅ Session auto-confirmed (Demo Mode)!\n\nMeet Link: ${res.data.meet_link}\n\nCheck 'My Sessions' for details.`);
                } else {
                    alert("Session requested! Check 'My Sessions' for status.");
                }
                setRequestModal({ open: false, teacherId: null, skillName: null, teacherName: null });
                navigate('/my-sessions');
            })
            .catch(err => {
                alert(err.response?.data?.detail || "Request failed");
                setRequestModal({ open: false, teacherId: null, skillName: null, teacherName: null });
            });
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 w-full">

            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="text-center space-y-6 max-w-4xl mx-auto py-8 animate-slide-up">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-2xl">
                    Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Mentor</span>
                </h1>
                <p className="text-slate-400 text-xl font-light leading-relaxed max-w-2xl mx-auto">
                    Access a global network of experts. Our neural matching engine finds the perfect tutor for your specific technical needs.
                </p>
            </div>

            {/* Premium Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group z-20 animate-slide-up delay-100">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-700"></div>
                <div className="relative flex items-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-2 shadow-2xl">
                    <svg className="w-6 h-6 text-slate-400 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                        type="text"
                        placeholder="e.g. 'Advanced Python with focus on API dev'"
                        className="w-full bg-transparent text-white px-5 py-4 focus:outline-none placeholder-slate-500 text-lg font-medium"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit" className="btn-primary py-3 px-8 rounded-lg whitespace-nowrap">
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : 'Scan Network'}
                    </button>
                </div>
            </form>

            {/* Results Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
                {Array.isArray(results) && results.map((r, idx) => (
                    <div
                        key={r.user_id}
                        className="glass-card flex flex-col group relative overflow-hidden animate-slide-up"
                        style={{ animationDelay: `${idx * 100}ms` }}
                    >
                        <div className="p-8 flex flex-col h-full gap-6">
                            {/* Header: Identity & Match */}
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex gap-5 items-center">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl blur opacity-20"></div>
                                        <div className="relative w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white text-2xl font-black">
                                            {r.name.charAt(0)}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors">{r.name}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className={`w-3.5 h-3.5 ${i < Math.round(r.reputation || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-800'}`} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.603.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                ))}
                                            </div>
                                            <span className="text-slate-500 text-xs font-mono">{Number(r.reputation || 0).toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                        <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest">{((r.match_score || 0) * 100).toFixed(0)}% MATCH</span>
                                    </div>
                                </div>
                            </div>

                            {/* AI Intelligence Summary */}
                            {r.feedback_summary && (
                                <div className="relative p-5 bg-black/20 rounded-xl border border-white/5">
                                    <div className="absolute -top-2.5 left-4 px-2 bg-[#13111C] text-[9px] font-bold text-indigo-400 uppercase tracking-widest border border-white/10 rounded">
                                        AI Analysis
                                    </div>
                                    <p className="text-slate-300 text-sm leading-relaxed font-light">
                                        "{r.feedback_summary}"
                                    </p>
                                </div>
                            )}

                            {/* Expertise Matrix */}
                            <div className="flex flex-wrap gap-2 mt-auto pt-2">
                                {(r.skills || []).map((skill, i) => {
                                    const badge = r.badges && r.badges[skill];
                                    return (
                                        <div key={i} className="flex items-center gap-2 group/skill">
                                            <div className="bg-white/5 hover:bg-white/10 border border-white/5 pl-3 pr-1 py-1 rounded-lg flex items-center gap-3 transition-colors">
                                                <span className="text-slate-300 text-[11px] font-bold uppercase tracking-wider">{skill}</span>

                                                {badge && (
                                                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded
                                                        ${badge === 'Expert' ? 'bg-purple-500/20 text-purple-400' :
                                                            badge === 'Intermediate' ? 'bg-indigo-500/20 text-indigo-400' :
                                                                'bg-emerald-500/20 text-emerald-400'}`}>
                                                        {badge.substring(0, 1)}
                                                    </span>
                                                )}

                                                <button
                                                    onClick={() => initiateRequest(r.user_id, skill, r.name)}
                                                    className="w-6 h-6 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all transform"
                                                    title={`Book ${skill} Session`}
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {searching && results.length === 0 && !loading && (
                <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in opacity-50">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-slate-600">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <p className="text-slate-500 font-medium">No experts found matching your criteria.</p>
                </div>
            )}

            {/* Request Modal */}
            {requestModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in p-4">
                    <div className="glass-card max-w-sm w-full p-6 space-y-6 relative border-indigo-500/20 shadow-2xl shadow-indigo-500/20">
                        <button
                            onClick={() => setRequestModal({ open: false, teacherId: null, skillName: null, teacherName: null })}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg p-1 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="text-center space-y-1">
                            <h3 className="text-xl font-bold text-white font-sans">Session Type</h3>
                            <p className="text-sm text-slate-400">Requesting <span className="text-indigo-400 font-semibold">{requestModal.skillName}</span> with {requestModal.teacherName}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => confirmRequest('standard')}
                                className="col-span-2 group p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-indigo-500/50 transition-all text-center space-y-3"
                            >
                                <div className="w-10 h-10 mx-auto bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                </div>
                                <div>
                                    <div className="font-bold text-white text-sm">Connect & Request Session</div>
                                    <div className="text-[10px] text-slate-500 mt-0.5">Wait for Mentor Approval</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
