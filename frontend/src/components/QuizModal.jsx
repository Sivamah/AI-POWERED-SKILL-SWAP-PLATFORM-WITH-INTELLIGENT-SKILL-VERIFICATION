import { useState, useEffect } from 'react'
import axios from 'axios'

export default function QuizModal({ skill, isOpen, onClose, onVerified }) {
    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedOption, setSelectedOption] = useState(null)
    const [score, setScore] = useState(0)
    const [timer, setTimer] = useState(15)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null) // 'pass' or 'fail'

    // Fetch Questions when opened
    useEffect(() => {
        if (isOpen && skill) {
            setLoading(true)
            setResult(null)
            setScore(0)
            setCurrentIndex(0)
            setSelectedOption(null)

            axios.get(`/api/quiz/generate?skill=${skill}`)
                .then(res => {
                    setQuestions(res.data)
                    setLoading(false)
                })
                .catch(err => {
                    alert("Failed to load quiz")
                    onClose()
                })
        }
    }, [isOpen, skill])

    // Timer Logic
    useEffect(() => {
        if (!isOpen || result || loading) return

        if (timer === 0) {
            handleAnswer(null) // Time's up!
        }

        const interval = setInterval(() => {
            setTimer(prev => prev > 0 ? prev - 1 : 0)
        }, 1000)

        return () => clearInterval(interval)
    }, [timer, isOpen, result, loading])

    // Reset timer when question changes
    useEffect(() => {
        setTimer(15)
    }, [currentIndex])

    const handleAnswer = (option) => {
        const correct = questions[currentIndex].answer
        let newScore = score
        if (option === correct) {
            newScore = score + 1
            setScore(newScore)
        }

        if (currentIndex + 1 < questions.length) {
            setSelectedOption(null)
            setCurrentIndex(prev => prev + 1)
        } else {
            // End of Quiz
            finishQuiz(newScore)
        }
    }

    const finishQuiz = async (finalScore) => {
        if (finalScore >= 4) {
            setResult('pass')
            try {
                await axios.post('/api/quiz/verify', { skill, score: finalScore })
                setTimeout(() => {
                    onVerified(skill)
                }, 2000)
            } catch (e) { console.error(e) }
        } else {
            setResult('fail')
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-fade-in">
            {/* Background Decor in Modal */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="glass-card w-full max-w-2xl overflow-hidden border-white/5 shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
                <div className="p-8 md:p-12 relative">
                    <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-6">
                            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                            <div className="text-center">
                                <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Curating Intelligence</h3>
                                <p className="text-slate-500 text-sm">AI is building your customized skill validation matrix...</p>
                            </div>
                        </div>
                    ) : result ? (
                        <div className="text-center py-12 space-y-8 animate-fade-in">
                            {result === 'pass' ? (
                                <>
                                    <div className="relative inline-block">
                                        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl animate-pulse -z-10"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-4xl font-black text-white tracking-tight uppercase">Skill Certified</h3>
                                        <p className="text-slate-400 text-lg font-light">
                                            Excellent performance. You've demonstrated a <span className="text-emerald-400 font-bold">{((score / questions.length) * 100).toFixed(0)}%</span> mastery level in <span className="text-white font-medium">{skill}</span>.
                                        </p>
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] pt-4">Updating your expertise tier...</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto border border-red-500/20">
                                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-4xl font-black text-white tracking-tight uppercase">Tier Unlocked</h3>
                                        <p className="text-slate-400 text-lg font-light">
                                            Your current score of {score}/{questions.length} is below the verification threshold. Refine your knowledge and attempt again.
                                        </p>
                                    </div>
                                    <button onClick={onClose} className="btn-primary !bg-slate-800 !shadow-none !px-10 mt-4">Return to HQ</button>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {/* Header */}
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Validation Sequence</p>
                                    <h3 className="text-3xl font-black text-white tracking-tight leading-none uppercase">{skill}</h3>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className={`px-5 py-2 rounded-xl text-lg font-black font-mono transition-all ${timer < 5 ? 'bg-red-500/20 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-white/5 text-white'}`}>
                                        0:{timer < 10 ? `0${timer}` : timer}
                                    </div>
                                </div>
                            </div>

                            {/* Question Section */}
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex gap-1">
                                        {questions.map((_, idx) => (
                                            <div key={idx} className={`h-1 flex-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-indigo-500' :
                                                idx < currentIndex ? 'bg-indigo-500/30' : 'bg-white/5'
                                                }`}></div>
                                        ))}
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Question {currentIndex + 1} of {questions.length}</p>
                                </div>

                                <h4 className="text-2xl font-bold text-slate-100 leading-tight tracking-tight">
                                    {questions[currentIndex]?.q}
                                </h4>

                                <div className="grid gap-3">
                                    {questions[currentIndex]?.options.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleAnswer(opt)}
                                            className="group flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 text-left transition-all duration-300"
                                        >
                                            <span className="text-slate-300 group-hover:text-white font-medium text-lg leading-tight">{opt}</span>
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                                {String.fromCharCode(65 + i)}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
