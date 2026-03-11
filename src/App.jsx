import { useState, useEffect, useRef } from 'react'
import Home from './pages/HomePage.jsx'
import Login from './pages/LoginPage.jsx'
import Signup from './pages/SignupPage.jsx'
import Profile from './pages/Profile.jsx'
import AppContext from './context/context.jsx'
import { Routes, Route, Navigate } from 'react-router-dom'
import { io } from "socket.io-client"

function App() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    username: 'johndoe',
    email: 'johndoe@gmail.com',
    profilePicture: './src/assets/profile_alison.png',
    phonenumber: '123-456-7890',
  })

  const [logged, setLogged] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [selectedUser, setSelectedUser] = useState(false)
  const [selectedUserid, setSelectedUserid] = useState(null)
  const [posts, setPosts] = useState([])
  const [chatMessages, setChatMessages] = useState([])
  const socketRef = useRef(null)

  // Connect socket only after login, passing userId so backend can map it
  useEffect(() => {
    if (!currentUserId) return

    socketRef.current = io("http://localhost:3000", {
      query: { userId: currentUserId },
      withCredentials: true
    })

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id)
    })

    // Incoming message from another user → append to chat
    socketRef.current.on("receiveMessage", ({ chatId, senderId, message, timestamp }) => {
      console.log(`Message from ${senderId} in chat ${chatId}:`, message)
      setChatMessages(prev => [
        ...prev,
        {
          isme: "no",
          id: Date.now(),
          text: message,
          chatID: chatId,
          sender: senderId,
          timestamp
        }
      ])
    })

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected")
    })

    return () => {
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [currentUserId])

  // Fetch existing chats from backend after login
  useEffect(() => {
    if (!logged) return

    const fetchChats = async () => {
      try {
        const response = await fetch("http://localhost:3000/chats", {
          method: "GET",
          credentials: "include"
        })
        if (!response.ok) {
          console.log("Failed to fetch chats")
          return
        }
        const data = await response.json()
        const formatted = data.chats.map((chat, index) => ({
          id: index + 1,
          chatID: chat.chatID,
          username: chat.username,
          profilePicture: chat.profilePicture,
          receiverId: chat.receiverId       // ← from backend
        }))
        setPosts(formatted)
      } catch (error) {
        console.log("Error fetching chats:", error)
      }
    }

    fetchChats()
  }, [logged])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <AppContext.Provider value={{
        profile, setProfile,
        logged, setLogged,
        currentUserId, setCurrentUserId,
        selectedUser, setSelectedUser,
        selectedUserid, setSelectedUserid,
        posts, setPosts,
        chatMessages, setChatMessages,
        socket: socketRef.current
      }}>
        <div className="min-h-screen w-full bg-[linear-gradient(160deg,#0f0f1a_0%,#161628_60%,#1a1230_100%)]">
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/home' element={
              logged
                ? <Home
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  selectedUserid={selectedUserid}
                  setSelectedUserid={setSelectedUserid}
                />
                : <Navigate to="/login" />
            } />
            <Route path='/profile' element={logged ? <Profile /> : <Navigate to="/login" />} />
            <Route path='*' element={logged ? <Navigate to="/home" /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </AppContext.Provider>
    </>
  )
}

export default App