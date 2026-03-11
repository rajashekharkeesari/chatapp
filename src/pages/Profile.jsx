import React, { useContext, useState } from 'react'
import AppContext from '../context/context.jsx'

const Profile = () => {
    const [edit, setedit] = useState(true)
    const { profile, setProfile } = useContext(AppContext)
    const { name, username, email, profilePicture, phonenumber } = profile

    const setname = (val) => setProfile(prev => ({ ...prev, name: val }))
    const setusername = (val) => setProfile(prev => ({ ...prev, username: val }))
    const setemail = (val) => setProfile(prev => ({ ...prev, email: val }))
    const setphonenumber = (val) => setProfile(prev => ({ ...prev, phonenumber: val }))

    const initial = name?.charAt(0)?.toUpperCase()

    const fields = [
        { label: 'Name', value: name, setter: setname, type: 'text', placeholder: 'Your name', icon: '✦' },
        { label: 'Username', value: username, setter: setusername, type: 'text', placeholder: 'Username', icon: '@' },
        { label: 'Email', value: email, setter: setemail, type: 'email', placeholder: 'Email address', icon: '✉' },
        { label: 'Phone', value: phonenumber, setter: setphonenumber, type: 'text', placeholder: 'Phone number', icon: '✆' },
    ]

    return (
        <div className="flex flex-row h-screen w-full
            bg-[linear-gradient(160deg,#0f0f1a_0%,#161628_60%,#1a1230_100%)]
            font-['DM_Sans',sans-serif]">

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
                .profile-input::placeholder { color: rgba(255,255,255,0.2); }
                .profile-input:focus { border-color: rgba(251,191,36,0.45); box-shadow: 0 0 0 3px rgba(251,191,36,0.08); }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(16px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                .slide-in { animation: slideIn 0.25s ease; }
            `}</style>

            {/* LEFT — Profile View */}
            <div className="flex flex-col items-center justify-center gap-5 flex-1 px-8">

                {/* Avatar with glow */}
                <div className="relative flex items-center justify-center">
                    <div className="absolute w-36 h-36 rounded-full pointer-events-none
                        bg-[radial-gradient(circle,rgba(251,191,36,0.12)_0%,transparent_70%)]" />
                    <div className="p-[3px] rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600">
                        {profilePicture ? (
                            <img src={profilePicture} alt="Profile"
                                className="w-[88px] h-[88px] rounded-full object-cover block" />
                        ) : (
                            <div className="w-[88px] h-[88px] rounded-full bg-gradient-to-br from-[#1e1e35] to-[#2a2a4a]
                                flex items-center justify-center text-4xl font-semibold text-amber-400 font-mono">
                                {initial}
                            </div>
                        )}
                    </div>
                </div>

                {/* Name + handle */}
                <div className="text-center">
                    <h1 className="text-white/92 text-xl font-semibold capitalize tracking-tight">{name}</h1>
                    <p className="text-amber-400/70 text-[12px] font-mono mt-1">@{username?.toLowerCase()}</p>
                </div>

                {/* Info rows */}
                <div className="flex flex-col gap-2 w-full max-w-[280px]">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.07]">
                        <span className="text-[15px]">✉</span>
                        <span className="text-white/50 text-[13px]">{email}</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.07]">
                        <span className="text-[15px]">✆</span>
                        <span className="text-white/50 text-[13px]">{phonenumber}</span>
                    </div>
                </div>

                {/* Edit toggle button */}
                <button
                    onClick={() => setedit(!edit)}
                    className={`px-7 py-2.5 rounded-2xl font-semibold text-sm cursor-pointer transition-all duration-150 mt-1
                        ${edit
                            ? 'bg-white/[0.07] border border-white/10 text-white/60 hover:bg-white/10'
                            : 'bg-gradient-to-r from-amber-400 to-amber-500 text-[#0f0f1a] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(251,191,36,0.3)]'
                        }`}
                >
                    {edit ? '✕ Close Editor' : '✎ Edit Profile'}
                </button>
            </div>

            {/* Vertical divider */}
            <div className="w-px self-stretch my-5 bg-white/[0.06]" />

            {/* RIGHT — Edit Panel */}
            {edit && (
                <div className="slide-in flex flex-col items-center justify-center gap-4 flex-1 px-8">
                    <div className="w-full max-w-[300px]">
                        <span className="text-white/25 text-[11px] tracking-[0.12em] font-mono uppercase">
                            Edit Profile
                        </span>
                        <div className="h-px bg-white/[0.06] mt-2" />
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-[300px]">
                        {fields.map(({ label, value, setter, type, placeholder, icon }) => (
                            <div key={label} className="flex flex-col gap-1">
                                <label className="text-white/28 text-[11px] tracking-[0.08em] font-mono uppercase pl-1">
                                    {label}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400/50 text-[13px] pointer-events-none">
                                        {icon}
                                    </span>
                                    <input
                                        type={type}
                                        placeholder={placeholder}
                                        value={value}
                                        onChange={(e) => setter(e.target.value)}
                                        className="profile-input w-full bg-white/[0.05] border border-white/[0.08] rounded-[10px]
                                            py-2 pr-4 pl-9 text-white/88 text-[13px] outline-none transition-all duration-200"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile