import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import VerificationModal from '../components/VerificationModal'

function Settings({ token }) {
    const navigate = useNavigate()
    const [user, setUser] = useState({
        name: '',
        bio: '',
        profile_photo_url: '',
        github_url: '',
        linkedin_url: '',
        education: ''
    })
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })

    // Skill Management State
    const [profile, setProfile] = useState({
        skills_offered: [],
        skills_wanted: []
    });
    const [newSkill, setNewSkill] = useState("");

    // Verification Modal State
    const [isVerificationOpen, setIsVerificationOpen] = useState(false);
    const [pendingSkill, setPendingSkill] = useState("");

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }
        fetchUserData()
    }, [token])

    const fetchUserData = async () => {
        try {
            const response = await fetch(`${API_URL}/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.ok) {
                const data = await response.json()
                setUser({
                    name: data.name || '',
                    bio: data.bio || '',
                    profile_photo_url: data.profile_photo_url || '',
                    github_url: data.github_url || '',
                    linkedin_url: data.linkedin_url || '',
                    education: data.education || ''
                })
                let skillsOffered = [];
                try {
                    skillsOffered = data.skills_offered ? JSON.parse(data.skills_offered) : [];
                    if (!Array.isArray(skillsOffered)) skillsOffered = [];
                } catch (e) { console.error(e); skillsOffered = []; }

                let skillsWanted = [];
                try {
                    skillsWanted = data.skills_wanted ? JSON.parse(data.skills_wanted) : [];
                    if (!Array.isArray(skillsWanted)) skillsWanted = [];
                } catch (e) { console.error(e); skillsWanted = []; }

                setProfile({
                    skills_offered: skillsOffered,
                    skills_wanted: skillsWanted
                });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to load profile data.' })
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const handleAddSkill = async (e) => {
        e.preventDefault();
        if (newSkill.trim()) {
            // 1. Check if it is a tech skill
            try {
                const response = await axios.get(`${API_URL}/utils/is_tech_skill?skill=${newSkill}`);
                if (response.data.is_tech) {
                    // Trigger Project Verification Flow
                    setPendingSkill(newSkill);
                    setIsVerificationOpen(true);
                    return;
                }
            } catch (err) {
                console.error("Could not check tech skill", err);
            }

            // Standard flow for non-tech skills
            setProfile({ ...profile, skills_offered: [...profile.skills_offered, newSkill] });
            setNewSkill("");
        }
    };

    const handleDeleteSkill = (skillToDelete) => {
        setProfile({
            ...profile,
            skills_offered: profile.skills_offered.filter(skill => skill !== skillToDelete)
        })
    }

    const handleVerificationSuccess = (result) => {
        // If verification passed, add the skill
        setProfile({ ...profile, skills_offered: [...profile.skills_offered, pendingSkill] });
        setNewSkill("");
    };



    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage({ type: '', text: '' })

        const payload = {
            ...user,
            skills_offered: JSON.stringify(profile.skills_offered),
            skills_wanted: JSON.stringify(profile.skills_wanted)
        }

        try {
            const response = await fetch(`${API_URL}/user/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            if (response.ok) {
                setMessage({ type: 'success', text: 'Settings saved successfully' })
            } else {
                setMessage({ type: 'error', text: 'Failed to update profile' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' })
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] animate-float"></div>
            </div>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Account Settings</h1>
                    <p className="text-slate-400">Manage your profile and visible persona.</p>
                </div>
                {message.text && (
                    <div className={`px-4 py-2 rounded-xl text-sm font-bold animate-slide-in-right ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {message.text}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-12 gap-8">

                {/* Left Column: Avatar & Bio */}
                <div className="md:col-span-4 space-y-6">
                    <div className="glass-card p-6 text-center">
                        <div className="relative w-32 h-32 mx-auto mb-4 group">
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                            <div className="relative w-full h-full rounded-full border-4 border-black/50 overflow-hidden bg-slate-800">
                                {user.profile_photo_url ? (
                                    <img src={user.profile_photo_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-600">
                                        {user.name?.charAt(0) || 'U'}
                                    </div>
                                )}
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{user.name || 'User'}</h3>
                        <p className="text-sm text-slate-400 mb-4">{user.education || 'Lifelong Learner'}</p>
                    </div>

                    <div className="glass-card p-6 space-y-4">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Public Bio</label>
                        <textarea
                            name="bio"
                            value={user.bio}
                            onChange={handleChange}
                            rows="6"
                            placeholder="Share your expertise, interests, and what you're looking to learn..."
                            className="input-field resize-none bg-black/10"
                        />
                    </div>
                </div>

                {/* Right Column: Details Form */}
                <div className="md:col-span-8 space-y-6">
                    <div className="glass-card p-8 space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400 font-medium ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={user.name}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="e.g. Alex Chen"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400 font-medium ml-1">Education / Degree</label>
                                    <input
                                        type="text"
                                        name="education"
                                        value={user.education}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="e.g. MS in Computer Science"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-white/5"></div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                                Professional Presence
                            </h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400 font-medium ml-1">Profile Photo URL</label>
                                    <input
                                        type="text"
                                        name="profile_photo_url"
                                        value={user.profile_photo_url}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm text-slate-400 font-medium ml-1">GitHub URL</label>
                                        <input
                                            type="text"
                                            name="github_url"
                                            value={user.github_url}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="github.com/..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-slate-400 font-medium ml-1">LinkedIn URL</label>
                                        <input
                                            type="text"
                                            name="linkedin_url"
                                            value={user.linkedin_url}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="linkedin.com/in/..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-white/5"></div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-emerald-400">
                                    Skills & Verification
                                </span>
                            </h3>

                            <div className="glass-card-strong p-8 space-y-8 border border-white/10">
                                {/* Header / Instruction */}
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 hidden sm:block">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-semibold text-white">Manage Your Expertise</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            Add skills to your profile.
                                            <span className="text-indigo-400 font-medium ml-1">Tech skills</span> (like Python, React) require a quick
                                            <span className="text-white font-bold mx-1">Project Verification</span>
                                            to earn the <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold tracking-wide border border-emerald-500/30 align-middle">VERIFIED</span> badge.
                                        </p>
                                    </div>
                                </div>

                                {/* Input Area */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Add New Skill</label>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="relative flex-grow">
                                            <input
                                                type="text"
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all outline-none"
                                                placeholder="e.g. React, Python, Digital Marketing..."
                                                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill(e)}
                                            />
                                            <div className="absolute right-3 top-3.5 text-slate-600 pointer-events-none">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddSkill}
                                            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 min-w-[120px]"
                                        >
                                            <span>Add</span>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Skills List */}
                                {profile.skills_offered.length > 0 ? (
                                    <div className="space-y-3 pt-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Your Skills</label>
                                        <div className="flex flex-wrap gap-3">
                                            {profile.skills_offered.map((skill, index) => (
                                                <div
                                                    key={index}
                                                    className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/30 hover:bg-white/10 transition-all"
                                                >
                                                    <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{skill}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteSkill(skill)}
                                                        className="w-5 h-5 rounded-full flex items-center justify-center bg-transparent hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all font-bold text-xs"
                                                        title="Remove skill"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-xl bg-white/[0.02]">
                                        <p className="text-slate-500 text-sm">No skills added yet. Start by adding one above.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Verification Modal for Tech Skills */}
                        <VerificationModal
                            isOpen={isVerificationOpen}
                            onClose={() => setIsVerificationOpen(false)}
                            skillNotVerified={pendingSkill}
                            onSuccess={handleVerificationSuccess}
                        />

                        <div className="pt-4 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="btn-ghost"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    )
}

export default Settings;
