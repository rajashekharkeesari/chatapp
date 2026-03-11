import React from 'react'
import { IoSend } from 'react-icons/io5'
import { useContext } from 'react'
import AppContext from '../context/context.jsx'
import { IoClose } from 'react-icons/io5'

const ChatContainer = ({ posts, selectedUserid }) => {
    const { setSelectedUser, chatMessages, setChatMessages, socket, currentUserId } = useContext(AppContext)
    const [text, setText] = React.useState('')
    const [focused, setFocused] = React.useState(false)
    const bottomRef = React.useRef(null)

    React.useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chatMessages])

    const add_message = async () => {
        if (!text.trim()) return

        // Optimistically add to UI immediately
        setChatMessages(prev => [...prev, { isme: "yes", id: Date.now(), text }])

        const postcard = posts.filter(post => post.id == selectedUserid)
        const chatid = postcard[0].chatID
        const receiverId = postcard[0].receiverId // make sure this is stored in posts (see note below)

        // Emit via socket so receiver gets it instantly if online
        if (socket) {
            socket.emit("sendMessage", {
                chatId: chatid,
                receiverId: receiverId,
                message: text
            })
        }

        // Also persist to DB via REST (unchanged)
        try {
            const message_reply = await fetch(
                `http://localhost:3000/messageSend/${chatid}/${encodeURIComponent(text)}`,
                { method: "GET", credentials: "include" }
            )
            if (!message_reply.ok) {
                console.log("not valid reply")
            } else {
                const response = await message_reply.json()
                console.log("Message saved:", response)
            }
        } catch (error) {
            console.log("error while sending message to backend:", error)
        }

        setText('')
    }
    console.log(posts)
    const filterd_name = posts.filter(post => post.id === selectedUserid)[0].username
    const initial = filterd_name?.charAt(0)?.toUpperCase()

    return (
        <div className="flex flex-col h-screen w-full bg-[linear-gradient(160deg,#0f0f1a_0%,#161628_60%,#1a1230_100%)]
            font-['DM_Sans',sans-serif]">

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
                .chat-scroll::-webkit-scrollbar { width: 3px; }
                .chat-scroll::-webkit-scrollbar-track { background: transparent; }
                .chat-scroll::-webkit-scrollbar-thumb { background: rgba(251,191,36,0.2); border-radius: 10px; }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-10px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(10px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                .msg-in  { animation: slideInLeft  0.2s ease; }
                .msg-out { animation: slideInRight 0.2s ease; }
                @keyframes pulse-green {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.4); }
                    50%      { box-shadow: 0 0 0 5px rgba(74,222,128,0); }
                }
                .pulse-green { animation: pulse-green 2s infinite; }
                .chat-input::placeholder { color: rgba(255,255,255,0.2); }
            `}</style>

            {/* Header */}
            <header className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600
                        flex items-center justify-center text-base font-bold text-[#0f0f1a] font-mono shrink-0">
                        {initial}
                    </div>
                    <div className="pulse-green absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full
                        bg-green-400 border-2 border-[#0f0f1a]" />
                </div>
                <div className="flex-1">
                    <div className="text-white/90 text-[15px] font-semibold capitalize">{filterd_name}</div>
                    <div className="text-green-400 text-[11px] font-mono">online</div>
                </div>
                <button
                    onClick={() => setSelectedUser(false)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
                >
                    <IoClose className="w-5 h-5" />
                </button>
            </header>

            {/* Messages */}
            <div className="chat-scroll flex-1 overflow-y-auto flex flex-col gap-3 p-5">
                {chatMessages.length !== 0 ? (
                    chatMessages.map((message) => {
                        const isMe = message.isme === "yes"
                        return (
                            <div key={message.id} className={`flex items-end gap-2 ${isMe ? 'justify-end msg-out' : 'justify-start msg-in'}`}>
                                {!isMe && (
                                    <div className="w-7 h-7 rounded-full shrink-0 bg-gradient-to-br from-amber-400 to-amber-600
                            flex items-center justify-center text-[11px] font-bold text-[#0f0f1a] font-mono">
                                        {initial}
                                    </div>
                                )}
                                <div className={`max-w-[55%] px-3.5 py-2.5 text-[14px] leading-relaxed
                        ${isMe
                                        ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-[#0f0f1a] font-medium rounded-[18px_18px_4px_18px] shadow-[0_4px_15px_rgba(251,191,36,0.2)]'
                                        : 'bg-white/[0.07] text-white/85 border border-white/[0.08] rounded-[18px_18px_18px_4px] shadow-[0_2px_8px_rgba(0,0,0,0.2)]'
                                    }`}>
                                    {message.text}
                                </div>
                            </div>
                        )
                    })
                ) : null}
                <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="px-4 py-3 flex items-center gap-3 border-t border-white/[0.06] bg-white/[0.02]">
                <div className={`flex-1 flex items-center gap-3 px-4 h-11 rounded-2xl
                    bg-white/[0.05] border transition-all duration-200
                    ${focused ? 'border-amber-400/45 shadow-[0_0_0_3px_rgba(251,191,36,0.08)]' : 'border-white/[0.08]'}`}>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && add_message()}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder="Type a message..."
                        className="chat-input bg-transparent border-none outline-none text-sm flex-1 text-white/85"
                    />
                </div>

                <button
                    onClick={add_message}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-200
                        ${text.trim()
                            ? 'bg-gradient-to-br from-amber-400 to-amber-500 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(251,191,36,0.3)] cursor-pointer'
                            : 'bg-white/[0.05] border border-white/[0.08] cursor-default'
                        }`}
                >
                    <IoSend className={`w-4 h-4 ${text.trim() ? 'text-[#0f0f1a]' : 'text-white/25'}`} />
                </button>
            </div>
        </div>
    )
}

export default ChatContainer