import React, { useEffect, useContext } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import ChatContainer from '../components/ChatContainer.jsx'
import Rightsidebar from '../components/Rightsidebar.jsx'
import AddFriend from '../components/add_friend.jsx'
import AppContext from '../context/context.jsx'

const HomePage = ({ selectedUser, setSelectedUser, selectedUserid, setSelectedUserid }) => {
    const { posts, setPosts } = useContext(AppContext)

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await fetch('http://localhost:3000/chats', {
                    method: 'GET',
                    credentials: 'include'
                })
                if (response.ok) {
                    const data = await response.json()
                    const formatted = data.chats.map((chat, index) => ({
                        id: index + 1,
                        chatID: chat.chatID,
                        username: chat.username,
                        profilePicture: chat.profilePicture,
                        receiverId: chat.receiverId
                    }))
                    setPosts(formatted)
                }
            } catch (error) {
                console.log("error fetching chats:", error)
            }
        }
        fetchChats()
    }, [])

    return (
        <div
            className={`w-full min-h-screen grid grid-cols-1
                ${selectedUser
                    ? 'sm:grid-cols-[0.4fr_1fr_0.4fr]'
                    : 'sm:grid-cols-[0.5fr_1fr]'
                }`}
            style={{ background: 'linear-gradient(160deg, #0f0f1a 0%, #161628 60%, #1a1230 100%)' }}
        >
            <Sidebar
                posts={posts}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                setSelectedUserid={setSelectedUserid}
            />

            {selectedUser
                ? <ChatContainer posts={posts} selectedUserid={selectedUserid} setSelectedUser={setSelectedUser} />
                : <AddFriend />
            }

            {selectedUser && (
                <Rightsidebar posts={posts} selectedUserid={selectedUserid} />
            )}
        </div>
    )
}

export default HomePage