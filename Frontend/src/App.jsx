import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import LoginPage from './Pages/LoginPage'
import ProfilePage from './Pages/ProfilePage'
import {Toaster} from 'react-hot-toast'
import { AuthContext } from './Context/AuthContext'

const App = () => {

  const {authUser} =useContext(AuthContext)

  return (
    <div className="bg-[url('/bgImage.svg')] bg-contain">
      <Toaster/>
      <Routes>
        <Route path={'/'} element={ authUser ? <HomePage/>: <Navigate to="/login"></Navigate>}/>
        <Route path={'/login'} element={ !authUser ? <LoginPage/> : <Navigate to="/"/>}/>
        <Route path={'/profile'} element={ authUser ? <ProfilePage/> : <Navigate to="/login"></Navigate>}/>

      </Routes>
    </div>
  )
}

export default App