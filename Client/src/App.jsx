import { useState } from 'react'

import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import { useEffect } from 'react'
import axios from 'axios'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Builder from './Pages/Builder'
import Billing from './Pages/Billing'
import {Toaster} from 'react-hot-toast'


export const ServerUrl ="https://ai-voice-agentserver.onrender.com" 
export const CLIENT_URL="https://shifra-d82z.onrender.com"

function App() {
  const [user,setUser] =  useState(null)
  const [loading,setLoading] = useState(true)
  useEffect(()=>{
    const fetchMe = async () => {
      try {
          const res = await axios.get(ServerUrl + "api/user/current-user",{withCredentials:true})
          console.log(res.data);
          
          setUser(res.data)
          setLoading(false)
      } catch (error) {
        console.log(error);
        setLoading(false)
        
        
      }
      
    }
    fetchMe(  )

  },[])
  
  return (
    <>

    <Toaster position='top-right'/>
    <Routes>
      
      <Route path='/login' element={<Login setUser={setUser}/>} />
       <Route path='/*' element={<ProtectedRoute user ={user} loading={loading}>
        <Navbar setUser={setUser} user={user}/>
        <Routes>
               <Route path='/' element={<Home user={user}/>} />
               <Route path ='/builder'  element={<Builder user={user} setUser={setUser}/>}/>
               <Route   path ='/billing' element={<Billing user={user} setUser={setUser}/>}  />
               <Route path = '*' element ={<Navigate to ="/"/>} />
        </Routes>
       </ProtectedRoute>} />

    </Routes>
      
    </>
  )
}

export default App
