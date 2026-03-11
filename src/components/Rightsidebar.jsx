import React from 'react'

const Rightsidebar = ({ posts, selectedUserid }) => {
    const selected_post = []
    posts.map(post => {
        if (post['id'] == selectedUserid) {
            selected_post.push(post)
        }
    })

    const user = selected_post[0]
    const displayName = user?.username?.charAt(0)?.toUpperCase() + user?.username?.slice(1)
    const initial = user?.username?.charAt(0)?.toUpperCase()

    return (
        <>
            {selectedUserid && (
                <div className="h-screen w-full flex flex-col items-center relative overflow-hidden
                    bg-[linear-gradient(160deg,#0f0f1a_0%,#161628_60%,#1a1230_100%)]
                    border-l border-white/[0.06] font-['DM_Sans',sans-serif]">

                    <style>{`
                        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
                        @keyframes pulse-green {
                            0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.4); }
                            50%      { box-shadow: 0 0 0 5px rgba(74,222,128,0); }
                        }
                        .pulse-green { animation: pulse-green 2s infinite; }
                    `}</style>

                    {/* Ambient glow */}
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none
                        bg-[radial-gradient(circle,rgba(251,191,36,0.07)_0%,transparent_70%)]" />

                    {/* Top label */}
                    <div className="w-full px-5 pt-5 pb-3 border-b border-white/[0.06]">
                        <span className="text-white/25 text-[11px] tracking-[0.12em] font-mono uppercase">
                            Profile
                        </span>
                    </div>

                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-3 mt-10 px-6 w-full">
                        <div className="p-[3px] rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 relative">
                            {user?.profilePicture ? (
                                <img
                                    src={user.profilePicture}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover block"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1e1e35] to-[#2a2a4a]
                                    flex items-center justify-center text-4xl font-semibold text-amber-400 font-mono">
                                    {initial}
                                </div>
                            )}
                            <div className="pulse-green absolute bottom-1 right-1 w-3 h-3 rounded-full
                                bg-green-400 border-2 border-[#0f0f1a]" />
                        </div>

                        {/* Name */}
                        <div className="text-center mt-1">
                            <h2 className="text-white/92 text-xl font-semibold tracking-tight">{displayName}</h2>
                            <p className="text-amber-400/70 text-[12px] font-mono mt-1">@{user?.username?.toLowerCase()}</p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-3/5 h-px bg-white/[0.06] my-6" />

                    {/* Info chips */}
                    <div className="flex flex-col gap-3 w-full px-5">
                        {user?.email && (
                            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.07]">
                                <span className="text-sm">✉</span>
                                <span className="text-white/55 text-[13px]">{user.email}</span>
                            </div>
                        )}
                        {user?.phonenumber && (
                            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.07]">
                                <span className="text-sm">✆</span>
                                <span className="text-white/55 text-[13px]">{user.phonenumber}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.07]">
                            <span className="text-sm">◉</span>
                            <span className="text-green-400 text-[13px]">Online</span>
                        </div>
                    </div>

                    {/* Bottom fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none
                        bg-gradient-to-t from-[#0f0f1a]/90 to-transparent" />
                </div>
            )}
        </>
    )
}

export default Rightsidebar