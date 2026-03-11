import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import AppContext from '../context/context.jsx'

const SignupPage = () => {
    const navigate = useNavigate()
    const { setLogged } = useContext(AppContext)
    const [form, setForm] = useState({ name: "", email: "", phonenumber: "", password: "", confirm: "" })
    const [profileImage, setProfileImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const [focused, setFocused] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (field) => (e) => {
        setForm({ ...form, [field]: e.target.value })
        setError("")
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size should be less than 5MB")
                return
            }
            // Check file type
            if (!file.type.startsWith('image/')) {
                setError("Please upload an image file")
                return
            }
            setProfileImage(file)

            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { name, email, phonenumber, password, confirm } = form
        if (!name || !email || !phonenumber || !password || !confirm) {
            setError("Please fill in all fields."); return
        }
        if (password !== confirm) {
            setError("Passwords do not match."); return
        }

        setLoading(true)

        // Create FormData for file upload
        const formData = new FormData()
        formData.append('name', name)
        formData.append('email', email)
        formData.append('phonenumber', phonenumber)
        formData.append('password', password)
        if (profileImage) {
            formData.append('profileImage', profileImage)
        }

        try {
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            })

            const data = await response.json()

            if (response.ok) {

                setLogged(true)
                navigate('/home')
            } else {
                setError(data.message || "Registration failed.")
            }
        } catch (err) {
            setError(err.message || "An error occurred during registration.")
        } finally {
            setLoading(false)
        }
    }

    const fields = [
        { id: "name", label: "Full Name", type: "text", placeholder: "John Doe", icon: "✦" },
        { id: "email", label: "Email", type: "email", placeholder: "you@example.com", icon: "✉" },
        { id: "phonenumber", label: "Phone Number", type: "text", placeholder: "123-456-7890", icon: "✆" },
        { id: "password", label: "Password", type: "password", placeholder: "••••••••", icon: "◉" },
        { id: "confirm", label: "Confirm Password", type: "password", placeholder: "••••••••", icon: "◉" },
    ]

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-5 py-4 overflow-y-auto
            bg-[linear-gradient(160deg,#0f0f1a_0%,#161628_60%,#1a1230_100%)]
            font-['DM_Sans',sans-serif]">

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
                .auth-input::placeholder { color: rgba(255,255,255,0.18); }
                .auth-input:focus { border-color: rgba(251,191,36,0.45) !important; box-shadow: 0 0 0 3px rgba(251,191,36,0.08); }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25%      { transform: translateX(-5px); }
                    75%      { transform: translateX(5px); }
                }
                .shake { animation: shake 0.3s ease; }
                .file-input {
                    color: rgba(255,255,255,0.6);
                    font-size: 13px;
                }
                .file-input::file-selector-button {
                    margin-right: 16px;
                    padding: 8px 16px;
                    border-radius: 9999px;
                    border: none;
                    background: linear-gradient(to right, #fbbf24, #f59e0b);
                    color: #0f0f1a;
                    font-weight: 600;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .file-input::file-selector-button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 20px rgba(251,191,36,0.25);
                }
            `}</style>

            {/* Ambient glow */}
            <div className="fixed top-1/5 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none
                bg-[radial-gradient(circle,rgba(251,191,36,0.06)_0%,transparent_70%)]" />

            <div className="w-full max-w-[400px] relative">

                {/* Top accent */}
                <div className="h-px w-full mb-4 bg-[linear-gradient(90deg,transparent,rgba(251,191,36,0.4),transparent)]" />

                {/* Card */}
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-[20px] px-7 py-6
                    backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.4)]">

                    {/* Header */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span className="text-white/25 text-[10px] font-mono tracking-[0.12em] uppercase">
                                New Account
                            </span>
                        </div>
                        <h1 className="text-white/92 text-xl font-bold tracking-tight leading-tight">
                            Create an account
                        </h1>
                        <p className="text-white/30 text-[12px] mt-1">Sign up to get started today</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="shake mb-3 px-3 py-2 rounded-xl text-[12px] text-red-400
                            bg-red-400/[0.08] border border-red-400/20">
                            {error}
                        </div>
                    )}

                    {/* Fields */}
                    <div className="flex flex-col gap-2">
                        {/* Profile Image Upload */}
                        <div className="flex flex-col gap-1 mb-1">
                            <label className="text-white/28 text-[10px] font-mono tracking-[0.1em] uppercase pl-0.5">
                                Profile Image
                            </label>
                            <div className="flex items-center gap-3">
                                {/* Image Preview Circle */}
                                <div className="w-12 h-12 rounded-full bg-white/[0.05] overflow-hidden flex-shrink-0
                                    border border-white/[0.08] flex items-center justify-center">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-white/30 text-lg">🖼</span>
                                    )}
                                </div>

                                {/* File Input */}
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="file-input w-full"
                                    />
                                    <p className="text-white/30 text-[10px] mt-1">
                                        Max 5MB (JPG, PNG, GIF)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Other Fields */}
                        {fields.map(({ id, label, type, placeholder, icon }) => (
                            <div key={id} className="flex flex-col gap-1">
                                <label className="text-white/28 text-[10px] font-mono tracking-[0.1em] uppercase pl-0.5">
                                    {label}
                                </label>
                                <div className="relative">
                                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[12px] pointer-events-none transition-colors duration-200
                                        ${focused === id ? 'text-amber-400/60' : 'text-white/20'}`}>
                                        {icon}
                                    </span>
                                    <input
                                        type={type}
                                        value={form[id]}
                                        placeholder={placeholder}
                                        onChange={handleChange(id)}
                                        onFocus={() => setFocused(id)}
                                        onBlur={() => setFocused(null)}
                                        className={`auth-input w-full bg-white/[0.05] rounded-[10px] py-2 pr-4 pl-8
                                            text-white/88 text-[13px] outline-none border transition-all duration-200
                                            ${focused === id ? 'border-amber-400/45' : 'border-white/[0.08]'}`}
                                    />
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full mt-1.5 py-2.5 rounded-xl text-sm font-bold text-[#0f0f1a]
                                bg-gradient-to-r from-amber-400 to-amber-500
                                hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(251,191,36,0.28)]
                                active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
                                disabled:transform-none transition-all duration-150"
                        >
                            {loading ? 'Creating Account...' : 'Create Account →'}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-white/[0.06]" />
                        <span className="text-white/20 text-[11px]">or</span>
                        <div className="flex-1 h-px bg-white/[0.06]" />
                    </div>

                    <p className="text-center text-white/35 text-[12px]">
                        Already have an account?{' '}
                        <Link to="/login" className="text-amber-400/80 hover:text-amber-400 font-semibold transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Bottom accent */}
                <div className="h-px w-full mt-4 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)]" />
            </div>
        </div>
    )
}

export default SignupPage