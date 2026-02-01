import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import QuizModal from "../components/QuizModal";

export default function Dashboard({ token }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [quizSkill, setQuizSkill] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [learningPath, setLearningPath] = useState([]);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

  const fetchUser = () => {
    if (!token) {
      setError("Token missing. Please login again.");
      return;
    }

    axios
      .get(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data);
        let wanted = [];
        try {
          wanted = res.data.skills_wanted ? JSON.parse(res.data.skills_wanted) : [];
          if (!Array.isArray(wanted)) wanted = [];
        } catch (e) {
          console.error("Failed to parse skills_wanted", e);
          wanted = [];
        }
        const targetSkill = wanted.length > 0 ? wanted[0] : "React";
        fetchLearningPath(targetSkill);
      })
      .catch((err) => {
        setError("Failed to load user data");
      });
  };

  const fetchLearningPath = (skill) => {
    axios.get(`${API_URL}/learning-path/${skill}`)
      .then(res => setLearningPath(res.data))
      .catch(err => console.error(err));
  }

  useEffect(() => {
    fetchUser();
  }, [token]);

  const handleVerifyClick = (skill) => {
    setQuizSkill(skill);
    setShowQuiz(true);
  }

  const handleVerificationSuccess = (skill) => {
    setShowQuiz(false);
    fetchUser();
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl text-error font-bold mb-3">Dashboard Error</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <button onClick={() => navigate("/login")} className="btn-primary">Go to Login</button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  let skills = [];
  try {
    skills = user.skills_offered ? JSON.parse(user.skills_offered) : [];
    if (!Array.isArray(skills)) skills = [];
  } catch (e) {
    console.error("Failed to parse skills_offered", e);
    skills = [];
  }

  let verifiedSkills = [];
  try {
    verifiedSkills = user.verified_skills ? JSON.parse(user.verified_skills) : [];
    if (!Array.isArray(verifiedSkills)) verifiedSkills = [];
  } catch (e) {
    console.error("Failed to parse verified_skills", e);
    verifiedSkills = [];
  }

  let badges = {};
  try {
    badges = user.badges ? JSON.parse(user.badges) : {};
    if (typeof badges !== 'object' || badges === null) badges = {};
  } catch (e) {
    console.error("Failed to parse badges", e);
    badges = {};
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">

      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute inset-0 bg-grid-white opacity-[0.2]"></div>
      </div>

      {/* Hero Section */}
      <header className="relative py-8 animate-slide-up">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-2">
          <span className="block text-slate-400 text-lg font-medium tracking-wide uppercase mb-2">Welcome Back</span>
          <span className="text-gradient-purple">{user.name}</span>
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl font-light">
          Your journey to mastery continues. You have <span className="text-white font-medium">{user.credits_balance} active credits</span> to spend this week.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up delay-100">

        {/* Credits Card */}
        <div className="glass-card p-6 flex flex-col justify-between h-48 group">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Credits</span>
          </div>
          <div>
            <p className="text-5xl font-bold text-white mb-1 group-hover:scale-105 transition-transform origin-left">{user.credits_balance}</p>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-3/4"></div>
            </div>
          </div>
        </div>

        {/* Reputation Card */}
        <div className="glass-card p-6 flex flex-col justify-between h-48 group">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reputation</span>
          </div>
          <div>
            <div className="flex items-end gap-2 mb-1">
              <p className="text-5xl font-bold text-white group-hover:scale-105 transition-transform origin-left">{user.reputation_score?.toFixed(1) || '0.0'}</p>
              <span className="text-slate-500 text-lg mb-1">/ 5.0</span>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full ${i < Math.floor(user.reputation_score || 0) ? 'bg-purple-500' : 'bg-white/10'}`}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Card */}
        <Link to="/find-tutor" className="glass-card p-6 flex flex-col justify-between h-48 relative overflow-hidden group border-indigo-500/30">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="p-3 rounded-xl bg-white/10 text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Quick Action</span>
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-1">Find a Mentor</h3>
            <p className="text-sm text-slate-300">Browse experts matching your skills.</p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all"></div>
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Learning Path */}
        <div className="lg:col-span-4 animate-slide-up delay-200">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
            My Learning Path
          </h3>
          <div className="glass-card p-6">
            {learningPath?.length > 0 ? (
              <div className="space-y-6 relative">
                {/* Connecting Line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-white/10"></div>

                {learningPath.map((item, index) => (
                  <div key={index} className="relative pl-10 group">
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full border border-white/10 bg-black/40 flex items-center justify-center group-hover:border-indigo-500/50 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all">
                      <span className="text-xs font-mono text-slate-400 group-hover:text-indigo-400">{index + 1}</span>
                    </div>
                    <h4 className="text-slate-200 font-medium group-hover:text-white transition-colors">{item.topic}</h4>
                    <p className="text-xs text-slate-500 mt-1">{item.description || "Master this module to advance."}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>No active learning path.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Expertise */}
        <div className="lg:col-span-8 animate-slide-up delay-300">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
            Technical Expertise
          </h3>

          <div className="glass-card p-8 min-h-[400px]">
            <div className="grid sm:grid-cols-2 gap-4">
              {skills.length ? (
                skills.map((s, i) => {
                  const isVerified = verifiedSkills.includes(s);
                  const badgeLevel = badges[s];

                  return (
                    <div key={i} className={`p-5 rounded-2xl border transition-all flex flex-col gap-4 group cursor-default relative overflow-hidden ${isVerified ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-white/5 border-white/5'}`}>
                      {isVerified && <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-indigo-500/20 to-transparent"></div>}

                      <div className="flex justify-between items-start relative z-10">
                        <div>
                          <h4 className={`text-xl font-bold ${isVerified ? 'text-white' : 'text-slate-400'}`}>{s}</h4>

                          {isVerified ? (
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full mt-2 border ${badgeLevel === 'Expert' ? 'border-purple-500/30 bg-purple-500/10 text-purple-300' :
                              badgeLevel === 'Intermediate' ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300' :
                                'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                              }`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              <span className="text-[10px] uppercase font-bold tracking-wider">{badgeLevel}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500 mt-2 block">Unverified Skill</span>
                          )}
                        </div>

                        {isVerified ? (
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleVerifyClick(s)}
                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white border border-white/10 hover:border-white/30 transition-all"
                          >
                            VERIFY
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="col-span-2 py-12 flex flex-col items-center justify-center text-slate-500">
                  <p className="mb-4">No skills listed yet.</p>
                  <Link to="/settings" className="text-indigo-400 hover:text-white transition-colors">Add skills in Settings</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <QuizModal
        isOpen={showQuiz}
        skill={quizSkill}
        onClose={() => setShowQuiz(false)}
        onVerified={handleVerificationSuccess}
      />
    </div>
  );
}
