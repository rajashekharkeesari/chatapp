import React from 'react'
import { useContext } from 'react'
import AppContext from '../context/context.jsx'

const Post = ({ posts, setSelectedUserid, setSelectedUser }) => {
    const { chatMessages, setChatMessages, currentUserId } = useContext(AppContext)

    const handleclick = async (postId) => {
        setSelectedUserid(postId)
        setSelectedUser(true)

        // Clear previous chat messages while loading new ones
        setChatMessages([])

        try {
            const postcard = posts.filter(post => post.id == postId)
            const chatid = postcard[0].chatID

            const response = await fetch(`http://localhost:3000/message/${chatid}`, {
                method: "GET",
                credentials: "include"
            })

            if (response.ok) {
                const data = await response.json()

                // Map DB message shape → ChatContainer shape
                // DB:  { sender, text, chatID, messageId, ... }
                // UI:  { isme: "yes"/"no", id, text }
                const formatted = (data || []).map((msg) => ({
                    id: msg.messageId || msg._id,
                    text: msg.text,
                    isme: msg.sender === currentUserId ? "yes" : "no"
                }))

                setChatMessages(formatted)
            } else {
                console.log("failed to fetch message list")
                setChatMessages([])
            }
        } catch (error) {
            console.log("error fetching messages:", error)
            setChatMessages([])
        }
    }

    return posts.map(post => (
        <div
            key={post.id}
            onClick={() => handleclick(post.id)}
            className="flex flex-row items-center gap-3 px-3 py-3 rounded-2xl w-[90%] cursor-pointer
                bg-white/[0.04] border border-white/[0.07]
                hover:bg-amber-400/[0.07] hover:border-amber-400/20
                hover:translate-x-1 transition-all duration-150"
        >
            {/* Avatar */}
            {post.profilePicture ? (
                <img
                    src={post.profilePicture}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-amber-400/30"
                />
            ) : (
                <div className="w-10 h-10 rounded-full shrink-0 bg-gradient-to-br from-amber-400 to-amber-600
                    flex items-center justify-center text-[15px] font-bold text-[#0f0f1a] font-mono">
                    {post.username?.charAt(0)?.toUpperCase()}
                </div>
            )}

            {/* Text */}
            <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-white/90 text-[13px] font-semibold capitalize m-0">
                    {post.username}
                </p>
            </div>
        </div>
    ))
}

export default Post