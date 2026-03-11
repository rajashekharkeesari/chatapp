import React from 'react'
import { useNavigate } from 'react-router-dom'
import Post from './Post.jsx'
import Friends_list from './Friends_list.jsx'

const Sidebar = ({ posts, selectedUser, setSelectedUser, setSelectedUserid }) => {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = React.useState('')
    const [menuOpen, setMenuOpen] = React.useState(false)
    const [toggle_sidebar, setToggle_bar] = React.useState('Messages')

    const search = []
    posts.filter(post => {
        if (post.username.toLowerCase().includes(searchTerm.toLowerCase())) {
            search.push(post)
        }
    })

    return (
        <div className="h-screen w-full flex flex-col bg-[linear-gradient(160deg,#0f0f1a_0%,#161628_60%,#1a1230_100%)]
            border-r border-white/[0.06] font-['DM_Sans',sans-serif]">

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
                .search-input::placeholder { color: rgba(255,255,255,0.25); }
                .sidebar-scroll::-webkit-scrollbar { width: 3px; }
                .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
                .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(251,191,36,0.3); border-radius: 10px; }
                @keyframes fadeDown {
                    from { opacity: 0; transform: scale(0.95) translateY(-6px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                .menu-dropdown { animation: fadeDown 0.15s ease forwards; transform-origin: top right; }
                @keyframes pulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.4); }
                    50% { box-shadow: 0 0 0 6px rgba(251,191,36,0); }
                }
                .pulse-dot { animation: pulse 2s infinite; }
            `}</style>

            {/* Header */}
            <div className="flex justify-between items-center px-4 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                    <img src=".\src\assets\logo.png" alt="Logo" className="h-7 w-auto" />
                    <div className="pulse-dot w-2 h-2 rounded-full bg-amber-400 ml-1" />
                </div>

                <div className="relative">
                    <button
                        className="w-9 h-9 rounded-xl flex items-center justify-center
                            bg-white/[0.07] border border-white/10
                            hover:rotate-90 transition-transform duration-200"
                        onClick={() => setMenuOpen(v => !v)}
                    >
                        <img src=".\src\assets\menu_icon.png" alt="Menu" className="w-4 h-4 brightness-200" />
                    </button>

                    {menuOpen && (
                        <div className="menu-dropdown absolute top-12 right-0 z-50 w-44 rounded-2xl overflow-hidden
                            bg-[rgba(20,20,40,0.95)] border border-white/10 backdrop-blur-xl
                            shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                            <div className="px-1 py-1">
                                <button
                                    onClick={() => { navigate('/Profile'); setMenuOpen(false) }}
                                    className="w-full text-left px-4 py-3 rounded-xl text-sm flex items-center gap-3
                                        text-amber-400 hover:bg-amber-400/10 transition-all"
                                >
                                    <span className="text-base">✦</span> Edit Profile
                                </button>
                                <div className="h-px bg-white/[0.06] mx-3" />
                                <button
                                    onClick={() => { navigate('/Logout'); setMenuOpen(false) }}
                                    className="w-full text-left px-4 py-3 rounded-xl text-sm flex items-center gap-3
                                        text-white/70 hover:bg-red-400/10 hover:text-red-400 transition-all"
                                >
                                    <span className="text-base">↩</span> Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Search Bar */}
            <div className="px-4 py-3">
                <div className="flex items-center gap-2 px-3 h-11 rounded-2xl
                    bg-white/[0.05] border border-white/[0.08]
                    focus-within:border-amber-400/40 transition-colors duration-200">
                    <img src=".\src\assets\search_icon.png" alt="Search" className="w-4 h-4 brightness-0 invert-[0.4]" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search conversations..."
                        className="search-input bg-transparent border-none outline-none text-sm w-full text-white/85"
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="text-white/30 text-lg leading-none">×</button>
                    )}
                </div>
            </div>

            {/* Toggle Tabs */}
            <div className="px-4 pb-3">
                <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                    <button
                        onClick={() => setToggle_bar('Messages')}
                        className={`flex-1 py-1.5 text-[11px] font-mono uppercase tracking-wide rounded-[9px] transition-all duration-200
                            ${toggle_sidebar === 'Messages'
                                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-[#0f0f1a] font-bold shadow-[0_4px_12px_rgba(251,191,36,0.2)]'
                                : 'text-white/30 hover:text-white/60 hover:bg-white/[0.05]'
                            }`}
                    >
                        Messages
                    </button>
                    <button
                        onClick={() => setToggle_bar('Friends')}
                        className={`flex-1 py-1.5 text-[11px] font-mono uppercase tracking-wide rounded-[9px] transition-all duration-200
                            ${toggle_sidebar === 'Friends'
                                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-[#0f0f1a] font-bold shadow-[0_4px_12px_rgba(251,191,36,0.2)]'
                                : 'text-white/30 hover:text-white/60 hover:bg-white/[0.05]'
                            }`}
                    >
                        Friends
                    </button>
                </div>
            </div>

            {/* Section Label */}
            <div className="px-5 pb-2 flex items-center gap-2">
                <span className="text-white/25 text-[11px] tracking-[0.12em] font-mono uppercase">
                    {toggle_sidebar === 'Messages'
                        ? (searchTerm ? `Results · ${search.length}` : `Messages · ${posts.length}`)
                        : 'Friends List'
                    }
                </span>
                <div className="flex-1 h-px bg-white/[0.05]" />
            </div>

            {/* Content */}
            {toggle_sidebar === 'Messages' ? (
                <div className="py-1 sidebar-scroll flex-1 flex flex-col items-center overflow-y-auto gap-2">
                    {search.length > 0 ? (
                        <Post  posts={search} setSelectedUserid={setSelectedUserid} setSelectedUser={setSelectedUser} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center text-[22px]">◌</div>
                            <p className="text-white/25 text-[13px]">No conversations found</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="sidebar-scroll flex-1 overflow-y-auto">
                    <Friends_list />
                </div>
            )}

            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none
                bg-gradient-to-t from-[#0f0f1a]/90 to-transparent" />
        </div>
    )
}

export default Sidebar