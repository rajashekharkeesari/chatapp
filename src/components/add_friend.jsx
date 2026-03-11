import React, { useState } from 'react'
import { useContext } from 'react'
import AppContext from '../context/context.jsx'

const AddFriend = () => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [focused, setFocused] = useState(false)
    const [phonenumber, setPhoneNumber] = useState()
    const { posts, setPosts } = useContext(AppContext)

    const handleSearch = async () => {
        if (!query.trim()) return
        setLoading(true)
        try {
            const response = await fetch(`http://localhost:3000/search?phonenumber=${query}`, {
                method: "GET",
                credentials: "include"
            })
            if (response.ok) {
                const user = await response.json()
                console.log(user)
                setResults(user ? [user] : [])
            } else {
                setResults([])
            }
        } catch (err) {
            console.error("Search failed:", err)
            setResults([])
        } finally {
            console.log("results:", results)
            setLoading(false)
        }
    }

    const handleAddFriend = async (user) => {
        console.log("Adding friend:", user)
        const { phone } = user
        try {
            const response = await fetch(`http://localhost:3000/chatid/${phone}`, {
                method: "POST",
                credentials: "include"
            })

            if (response.ok) {
                const data = await response.json()
                console.log(data)
                setPosts(prev => {
                    const updated = [...prev, {
                        id: prev.length + 1,
                        chatID: data.chatID,
                        username: data.name,
                        phonenumber: data.phonenumber,
                        profilePicture: data.pic_profile,
                        receiverId: data.receiverId
                    }]
                    return updated.sort((a, b) => b.id - a.id)
                })
                setResults([])
            }
            else {
                console.log("failed to fetch data")
            }

        } catch (error) {
            console.log("error at creating chatid:", error)
        }

    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-5
            bg-[linear-gradient(160deg,#0f0f1a_0%,#161628_60%,#1a1230_100%)]
            font-['DM_Sans',sans-serif]">

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
                .search-input::placeholder { color: rgba(255,255,255,0.2); }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .slide-up { animation: slideUp 0.2s ease; }
            `}</style>

            {/* Ambient glow */}
            <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none
                bg-[radial-gradient(circle,rgba(251,191,36,0.06)_0%,transparent_70%)]" />

            <div className="w-full max-w-[420px] relative">

                {/* Top accent */}
                <div className="h-px w-full mb-5 bg-[linear-gradient(90deg,transparent,rgba(251,191,36,0.4),transparent)]" />

                {/* Card */}
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-[22px] px-6 py-7
                    backdrop-blur-xl shadow-[0_24px_70px_rgba(0,0,0,0.4)]">

                    {/* Header */}
                    <div className="mb-5">
                        <div className="flex items-center gap-2 mb-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span className="text-white/25 text-[10px] font-mono tracking-[0.12em] uppercase">
                                People
                            </span>
                        </div>
                        <h2 className="text-white/92 text-xl font-bold tracking-tight">Connect with Friends</h2>
                        <p className="text-white/30 text-[12px] mt-1">Search by mobile number to find people</p>
                    </div>

                    {/* Search bar */}
                    <div className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl
                        bg-white/[0.05] border transition-all duration-200
                        ${focused
                            ? 'border-amber-400/45 shadow-[0_0_0_3px_rgba(251,191,36,0.08)]'
                            : 'border-white/[0.08]'
                        }`}>
                        <span className="text-white/20 text-sm">✆</span>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}

                            placeholder="Enter mobile number..."
                            className="search-input bg-transparent border-none outline-none text-[13px] text-white/88 flex-1"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-gradient-to-r from-amber-400 to-amber-500 text-[#0f0f1a] font-bold text-[13px]
                                px-4 py-1.5 rounded-[10px] cursor-pointer whitespace-nowrap
                                hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(251,191,36,0.25)]
                                active:scale-[0.97] transition-all duration-150"
                        >
                            {loading ? '...' : 'Search'}
                        </button>
                    </div>

                    {/* Results */}
                    {results.length > 0 && (
                        <div className="slide-up mt-4 flex flex-col gap-2">
                            <span className="text-white/25 text-[10px] font-mono tracking-[0.1em] uppercase">
                                Results · {results.length}
                            </span>
                            {results.map((user, idx) => (
                                <div key={idx}
                                    className="flex items-center gap-3 px-3.5 py-3 rounded-2xl
                                        bg-white/[0.04] border border-white/[0.07]
                                        hover:bg-white/[0.07] transition-colors duration-150">
                                    <div className="w-10 h-10 rounded-full shrink-0 bg-gradient-to-br from-amber-400 to-amber-600
                                        flex items-center justify-center text-[15px] font-bold text-[#0f0f1a] font-mono">
                                        {user.username?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-white/85 text-[14px] font-semibold capitalize">{user.name}</div>
                                        <div className="text-white/35 text-[12px] font-mono">{user.phonenumber}</div>
                                    </div>
                                    <button
                                        onClick={() => handleAddFriend(user)}
                                        className="bg-amber-400/10 border border-amber-400/25 text-amber-400 text-[12px] font-semibold
                                            px-3.5 py-1.5 rounded-[10px] cursor-pointer
                                            hover:bg-amber-400/18 hover:-translate-y-px transition-all duration-150"
                                    >
                                        + Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && query && results.length === 0 && (
                        <div className="slide-up mt-5 flex flex-col items-center gap-2.5">
                            <div className="w-11 h-11 rounded-[14px] bg-white/[0.04] border border-white/[0.07]
                                flex items-center justify-center text-xl">◌</div>
                            <p className="text-white/25 text-[13px]">No users found</p>
                        </div>
                    )}
                </div>

                {/* Bottom accent */}
                <div className="h-px w-full mt-5 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)]" />
            </div>
        </div>
    )
}

export default AddFriend