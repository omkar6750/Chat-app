import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Auth from './Pages/auth'
import Profile from './Pages/profile'
import Chat from './Pages/chat'

function App() {
 
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth/>}/>
        <Route path="/chat" element={<Chat/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/*" element={<Navigate to="Auth"/>} />
      </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
