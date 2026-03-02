import { Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './pages/Dashboard'
import FindTutor from './pages/FindTutor'
import MySessions from './pages/MySessions'
import SessionRoom from './pages/SessionRoom'
import Settings from './pages/Settings'
import SpaceBackground from './components/SpaceBackground'

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'))
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const path = location.pathname
        if (token) {
            if (path === '/login' || path === '/register') navigate('/')
        } else {
            if (path !== '/register') navigate('/login')
        }
    }, [token, location.pathname, navigate])

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        navigate('/login')
    }

    return (
        /* ── Root shell — deep space foundation ── */
        <div className="sp-app-root">

            {/* ══════════════════════════════════════
                GLOBAL SPACE BACKGROUND
                Rendered once — NEVER unmounts on
                page navigation → no flicker/reset
                ══════════════════════════════════════ */}
            <SpaceBackground />

            {/* ══════════════════════════════════════
                SPACE NAVIGATION BAR
                ══════════════════════════════════════ */}
            {token && (
                <div className="sp-nav-wrap">
                    <nav className="sp-nav">
                        {/* Brand */}
                        <div className="sp-nav-brand">
                            <div className="sp-nav-logo">
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <span className="sp-nav-title">Skill Swap AI</span>
                        </div>

                        {/* Links */}
                        <div className="sp-nav-links">
                            <Link to="/" className="sp-nav-link">Dashboard</Link>
                            <Link to="/find-tutor" className="sp-nav-link">Find Tutor</Link>
                            <Link to="/my-sessions" className="sp-nav-link">My Sessions</Link>
                            <Link to="/settings" className="sp-nav-link">Settings</Link>
                            <button onClick={logout} className="sp-nav-logout">Logout</button>
                        </div>
                    </nav>
                </div>
            )}

            {/* ══════════════════════════════════════
                PAGE CONTENT
                ══════════════════════════════════════ */}
            <div className={`sp-page-content ${token ? 'sp-page-with-nav' : ''}`}>
                <Routes>
                    <Route path="/login" element={<Login setToken={setToken} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Dashboard token={token} />} />
                    <Route path="/find-tutor" element={<FindTutor token={token} />} />
                    <Route path="/my-sessions" element={<MySessions token={token} />} />
                    <Route path="/settings" element={token ? <Settings token={token} /> : <Navigate to="/login" />} />
                    <Route path="/session/:id" element={token ? <SessionRoom token={token} /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </div>
    )
}

export default App
