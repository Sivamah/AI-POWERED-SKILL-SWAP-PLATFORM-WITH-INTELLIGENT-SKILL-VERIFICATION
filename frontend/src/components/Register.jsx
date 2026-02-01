import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from './AuthLayout'

export default function Register() {
    const [formData, setFormData] = useState({
        username: '', // Kept for logic compatibility but unused in UI
        password: '',
        email: '',
        fullName: '',
        skills: ''
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s)

            await axios.post('/api/register', {
                username: formData.username,
                password: formData.password,
                email: formData.email,
                name: formData.fullName,
                skills_offered: JSON.stringify(skillsArray)
            })

            navigate('/login')
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.detail || 'Registration failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Join the Revolution"
            subtitle="Create your profile to start swapping skills today."
        >
            {error && (
                <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-center gap-3 animate-pulse backdrop-blur-sm shadow-inner shadow-red-500/5">
                    <div className="p-1.5 bg-red-500/20 rounded-full flex-shrink-0">
                        <svg className="w-4 h-4 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <span className="font-medium tracking-wide">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">Full Name</label>
                    <div className="relative group">
                        <input
                            type="text"
                            name="fullName"
                            className="glass-input pl-11"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                        <svg className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5 transition-colors group-focus-within:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">Email Address</label>
                    <div className="relative group">
                        <input
                            type="email"
                            name="email"
                            className="glass-input pl-11"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <svg className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5 transition-colors group-focus-within:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">Password</label>
                    <div className="relative group">
                        <input
                            type="password"
                            name="password"
                            className="glass-input pl-11"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <svg className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5 transition-colors group-focus-within:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Skills needed / offered</label>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wide">Comma separated</span>
                    </div>
                    <div className="relative group">
                        <input
                            type="text"
                            name="skills"
                            className="glass-input pl-11"
                            placeholder="Python, React, Design..."
                            value={formData.skills}
                            onChange={handleChange}
                        />
                        <svg className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5 transition-colors group-focus-within:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary mt-6 flex justify-center items-center group"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white/90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-white/90">Creating Account...</span>
                        </div>
                    ) : (
                        <span className="flex items-center gap-2">
                            Create Account
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                    )}
                </button>

                <div className="pt-2 text-center">
                    <p className="text-slate-500 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline decoration-2 underline-offset-4 transition-all">
                            Sign In
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    )
}

