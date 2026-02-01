import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const slides = [
    {
        id: 0,
        type: 'title',
        content: (
            <div className="text-center z-10 p-12 relative">
                <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-indigo-400/30 bg-indigo-500/10 backdrop-blur-md text-indigo-300 text-sm font-medium tracking-wide">
                    FINAL PROJECT PRESENTATION
                </div>
                <h1 className="text-7xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-white via-indigo-200 to-indigo-400 mb-6 font-['Outfit'] tracking-tight">
                    Skill Swap AI
                </h1>
                <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
                    A decentralized, AI-driven platform for peer-to-peer knowledge exchange.
                </p>
            </div>
        ),
        bgStyle: {
            background: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)',
        }
    },
    {
        id: 1,
        type: 'intro',
        title: "The Vision",
        content: (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full max-w-6xl z-10 p-8">
                <div className="space-y-8">
                    <h2 className="text-5xl font-bold font-['Outfit'] text-white">Democratizing Knowledge</h2>
                    <p className="text-xl text-video-300 leading-relaxed font-light">
                        Traditional education is expensive and rigid. We believe in a world where everyone is both a learner and a teacher.
                    </p>
                    <div className="flex gap-4">
                        <div className="glass p-6 rounded-2xl flex-1 border-l-4 border-indigo-500">
                            <h3 className="text-lg font-semibold text-white mb-2">Problem</h3>
                            <p className="text-slate-400 text-sm">High costs, lack of personalized attention, and undervalued skills.</p>
                        </div>
                        <div className="glass p-6 rounded-2xl flex-1 border-l-4 border-emerald-500">
                            <h3 className="text-lg font-semibold text-white mb-2">Solution</h3>
                            <p className="text-slate-400 text-sm">AI-matched peer learning, credit-based economy, and trust verification.</p>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
                    <div className="glass-card p-8 relative overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                            alt="Collaboration"
                            className="w-full h-80 object-cover rounded-xl shadow-2xl opacity-80 hover:opacity-100 transition-opacity duration-500"
                        />
                    </div>
                </div>
            </div>
        ),
        bgStyle: {
            background: 'linear-gradient(to bottom right, #0f172a, #1e1b4b)',
        }
    },
    {
        id: 2,
        type: 'tech',
        title: "Architecture",
        content: (
            <div className="w-full max-w-5xl z-10 p-4">
                <div className="grid grid-cols-3 gap-8">
                    {/* Frontend */}
                    <div className="glass-card p-8 group hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Frontend</h3>
                        <ul className="space-y-3 text-slate-400">
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>React + Vite</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>Tailwind CSS</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>Framer Motion</li>
                        </ul>
                    </div>

                    {/* Backend */}
                    <div className="glass-card p-8 group hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-6 text-green-400">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Backend</h3>
                        <ul className="space-y-3 text-slate-400">
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>Python FastAPI</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>SQLModel (SQLite)</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>JWT Auth</li>
                        </ul>
                    </div>

                    {/* AI Engine */}
                    <div className="glass-card p-8 group hover:-translate-y-2 transition-transform duration-300 border-indigo-500/30 shadow-indigo-500/10">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">AI Engine</h3>
                        <ul className="space-y-3 text-slate-400">
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>Scikit-learn</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>TF-IDF Matching</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>Skill Validation</li>
                        </ul>
                    </div>
                </div>
            </div>
        ),
        bgStyle: {
            background: 'radial-gradient(circle at 80% 20%, #1e1b4b 0%, #0f172a 100%)',
        }
    },
    {
        id: 3,
        type: 'features',
        title: "Key Modules",
        content: (
            <div className="w-full max-w-6xl z-10 p-8 grid grid-cols-2 gap-12">
                <div className="flex flex-col justify-center space-y-8">
                    <div className="glass p-6 rounded-2xl flex items-start gap-4">
                        <div className="mt-1 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">1</div>
                        <div>
                            <h4 className="text-xl font-bold text-white">Smart Matchmaking</h4>
                            <p className="text-slate-400 mt-2">Algorithms connect learners with the perfect tutors based on skill gaps.</p>
                        </div>
                    </div>
                    <div className="glass p-6 rounded-2xl flex items-start gap-4">
                        <div className="mt-1 w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-sm">2</div>
                        <div>
                            <h4 className="text-xl font-bold text-white">Credit Economy</h4>
                            <p className="text-slate-400 mt-2">Earn credits by teaching, spend them to learn. A self-sustaining ecosystem.</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center space-y-8">
                    <div className="glass p-6 rounded-2xl flex items-start gap-4">
                        <div className="mt-1 w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm">3</div>
                        <div>
                            <h4 className="text-xl font-bold text-white">Verified Skills</h4>
                            <p className="text-slate-400 mt-2">AI-generated quizzes and peer reviews ensure quality instruction.</p>
                        </div>
                    </div>
                    <div className="glass p-6 rounded-2xl flex items-start gap-4">
                        <div className="mt-1 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">4</div>
                        <div>
                            <h4 className="text-xl font-bold text-white">Live Sessions</h4>
                            <p className="text-slate-400 mt-2">Integrated scheduling and session management for seamless learning.</p>
                        </div>
                    </div>
                </div>
            </div>
        ),
        bgStyle: {
            background: 'linear-gradient(135deg, #0f172a 0%, #312e81 100%)',
        }
    },
    {
        id: 4,
        type: 'conclusion',
        content: (
            <div className="text-center z-10 p-12 max-w-4xl mx-auto">
                <h2 className="text-6xl font-bold text-white mb-8 font-['Outfit']">The Future of Learning</h2>
                <p className="text-2xl text-slate-300 font-light mb-12">
                    Scalable. Decentralized. Human.
                </p>
                <Link to="/" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:scale-105 transition-transform">
                    Launch Detailed Prototype
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
            </div>
        ),
        bgStyle: {
            background: 'linear-gradient(to top, #0f172a 0%, #4338ca 100%)',
        }
    }
]

export default function Presentation() {
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1))
            } else if (e.key === 'ArrowLeft') {
                setCurrentSlide(prev => Math.max(prev - 1, 0))
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <div className="fixed inset-0 overflow-hidden text-white font-['Outfit']">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-8"
                    style={slides[currentSlide].bgStyle}
                >
                    {/* Background Noise Texture */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

                    {/* Animated Particles/Glows (Decorative) */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse animation-delay-2000"></div>
                    </div>

                    {slides[currentSlide].content}

                    {/* Progress Bar */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`w-16 h-1 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-white shadow-[0_0_10px_white]' : 'bg-white/20 hover:bg-white/40'}`}
                            />
                        ))}
                    </div>

                    {/* Slide Counter */}
                    <div className="absolute bottom-8 right-8 font-mono text-xs text-white/30 z-20">
                        {currentSlide + 1} / {slides.length}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
