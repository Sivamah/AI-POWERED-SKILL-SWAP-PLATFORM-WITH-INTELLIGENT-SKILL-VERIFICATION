import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const VerificationModal = ({ isOpen, onClose, skillName, onSuccess }) => {
    const [formData, setFormData] = useState({
        project_title: '',
        description: '',
        technologies: '',
        github_url: '',
        demo_link: ''
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/verify/project`, {
                skill_name: skillName,
                ...formData
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setResult(response.data);
            if (response.data.verified) {
                setTimeout(() => {
                    onSuccess(response.data);
                    onClose();
                }, 2000);
            }
        } catch (error) {
            console.error("Verification error", error);
            setResult({ verified: false, message: "Verification failed due to a server error." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
                >
                    <h2 className="text-2xl font-bold text-white mb-2">Verify Skill: <span className="text-indigo-400">{skillName}</span></h2>
                    <p className="text-white/60 mb-6">Submit a relevant project to confirm your expertise. AI will analyze your submission.</p>

                    {!result || !result.verified ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">Project Title</label>
                                <input
                                    type="text"
                                    name="project_title"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="e.g. E-commerce Platform"
                                    value={formData.project_title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    rows="4"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Explain what the project does, the problem it solves, and how you built it."
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">Technologies Used</label>
                                <input
                                    type="text"
                                    name="technologies"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="e.g. React, Node.js, MongoDB"
                                    value={formData.technologies}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-1">GitHub Repository URL</label>
                                    <input
                                        type="url"
                                        name="github_url"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="https://github.com/username/repo"
                                        value={formData.github_url}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-1">Demo/Live Link (Optional)</label>
                                    <input
                                        type="url"
                                        name="demo_link"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="https://myproject.com"
                                        value={formData.demo_link}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                            Analyzing...
                                        </>
                                    ) : (
                                        "Submit for Verification"
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                ✓
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Verification Successful!</h3>
                            <p className="text-white/80 text-lg mb-2">{result.message}</p>
                            {result.feedback && (
                                <div className="bg-white/5 p-4 rounded-lg mt-4 text-left">
                                    <p className="text-sm text-indigo-300 uppercase font-bold mb-1">AI Feedback</p>
                                    <p className="text-white/80">{result.feedback}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {result && !result.verified && (
                        <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
                            <p className="font-bold">Verification Failed</p>
                            <p>{result.message}</p>
                            {result.feedback && <p className="mt-1 text-sm opacity-80">Feedback: {result.feedback}</p>}
                        </div>
                    )}

                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default VerificationModal;
