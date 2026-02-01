import { useEffect, useState } from 'react'
import travelBg from '../assets/travel_bg.png'

export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="flex min-h-screen relative overflow-hidden font-['Inter'] items-center justify-center">
            {/* Full Screen Background Image with Animations */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-in-out transform hover:scale-110 motion-safe:animate-slow-pan"
                style={{ backgroundImage: `url(${travelBg})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-[#0f172a]/90 to-indigo-950/80 mix-blend-multiply"></div>

            {/* Ambient background glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse delay-1000"></div>

            {/* Main Container - Floating Glass Card */}
            <div className="w-full max-w-md p-1 relative z-10 mx-4">
                {/* Decorative border gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/5 to-transparent rounded-3xl -m-[1px] pointer-events-none"></div>

                <div className="relative bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
                    {/* Header Section */}
                    <div className="px-8 pt-10 pb-6 text-center">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 ring-1 ring-white/20">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-2 font-['Outfit'] tracking-tight drop-shadow-sm">{title}</h2>
                        <p className="text-slate-400 font-light">{subtitle}</p>
                    </div>

                    {/* Content Section */}
                    <div className="px-8 pb-10">
                        {children}
                    </div>

                    {/* Footer Links */}
                    <div className="px-8 py-4 bg-black/20 border-t border-white/5 flex justify-center gap-6 text-[10px] text-slate-500 font-medium tracking-widest uppercase">
                        <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
                        <span className="text-white/10">•</span>
                        <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
