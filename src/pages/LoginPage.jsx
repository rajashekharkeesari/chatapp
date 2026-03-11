import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import AppContext from '../context/context.jsx'

const LoginPage = () => {
    const navigate = useNavigate()
    const { setLogged, setCurrentUserId } = useContext(AppContext)
    // setCurrentUserId triggers socket connection in App.jsx
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [focused, setFocused] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        if (email && password) {
            setLoading(true)
            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                })
                if (response.ok) {
                    const data = await response.json()
                    setLogged(true)
                    // ✅ Save userId → triggers socket connection in context
                    setCurrentUserId(data.userId)
                    navigate('/home')
                } else {
                    setError("Invalid email or password")
                }
            } catch (err) {
                setError("Connection failed. Try again.")
            } finally {
                setLoading(false)
            }
        } else {
            setError("Please fill in all fields")
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-5
            bg-[linear-gradient(160deg,#0f0f1a_0%,#161628_60%,#1a1230_100%)]
            font-['DM_Sans',sans-serif]">

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
                .auth-input::placeholder { color: rgba(255,255,255,0.18); }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25%      { transform: translateX(-6px); }
                    75%      { transform: translateX(6px); }
                }
                .shake { animation: shake 0.3s ease; }
            `}</style>

            <div className="fixed top-1/5 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none
                bg-[radial-gradient(circle,rgba(251,191,36,0.06)_0%,transparent_70%)]" />

            <div className="w-full max-w-sm relative">
                <div className="h-px w-full mb-7 bg-[linear-gradient(90deg,transparent,rgba(251,191,36,0.4),transparent)]" />

                <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl px-8 py-9
                    backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.4)]">

                    <div className="mb-7">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span className="text-white/25 text-[11px] font-mono tracking-[0.12em] uppercase">
                                Secure Login
                            </span>
                        </div>
                        <h1 className="text-white/92 text-[26px] font-bold tracking-tight leading-tight">
                            Welcome back
                        </h1>
                        <p className="text-white/30 text-[13px] mt-1.5">
                            Sign in to continue to your account
                        </p>
                    </div>

                    {error && (
                        <div className="shake mb-4 px-3.5 py-2.5 rounded-xl text-[13px] text-red-400
                            bg-red-400/[0.08] border border-red-400/20">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-white/28 text-[11px] font-mono tracking-[0.1em] uppercase">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                placeholder="you@example.com"
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setFocused('email')}
                                onBlur={() => setFocused('')}
                                className={`auth-input w-full bg-white/[0.05] rounded-xl px-4 py-3 text-sm
                                    text-white/88 outline-none border transition-all duration-200
                                    ${focused === 'email'
                                        ? 'border-amber-400/45 shadow-[0_0_0_3px_rgba(251,191,36,0.08)]'
                                        : 'border-white/[0.08]'
                                    }`}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-white/28 text-[11px] font-mono tracking-[0.1em] uppercase">
                                    Password
                                </label>
                                <a href="#" className="text-amber-400/50 text-[12px] hover:text-amber-400/80 transition-colors">
                                    Forgot?
                                </a>
                            </div>
                            <input
                                type="password"
                                value={password}
                                placeholder="••••••••"
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setFocused('password')}
                                onBlur={() => setFocused('')}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                                className={`auth-input w-full bg-white/[0.05] rounded-xl px-4 py-3 text-sm
                                    text-white/88 outline-none border transition-all duration-200
                                    ${focused === 'password'
                                        ? 'border-amber-400/45 shadow-[0_0_0_3px_rgba(251,191,36,0.08)]'
                                        : 'border-white/[0.08]'
                                    }`}
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full mt-1 py-3 rounded-xl text-sm font-bold text-[#0f0f1a]
                                bg-gradient-to-r from-amber-400 to-amber-500
                                hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(251,191,36,0.28)]
                                active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
                                disabled:transform-none transition-all duration-150"
                        >
                            {loading ? '...' : 'Sign In →'}
                        </button>
                    </div>

                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-white/[0.06]" />
                        <span className="text-white/20 text-xs">or</span>
                        <div className="flex-1 h-px bg-white/[0.06]" />
                    </div>

                    <p className="text-center text-white/35 text-[13px]">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-amber-400/80 hover:text-amber-400 font-semibold transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>

                <div className="h-px w-full mt-7 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)]" />
            </div>
        </div>
    )
}

export default LoginPage