import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../Context/AuthContext'

const LoginPage = () => {

  const [currState,setCurrState] = useState('Sign Up')
  const [fullName,setFullName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [bio,setBio] = useState('')
    const [isDataSubmitted,setIsDataSubmitted] = useState(false)

    const {login} = useContext(AuthContext)

  const onSubmitHandler = (e)=>{
    e.preventDefault()
    if(currState==='Sign Up' && !isDataSubmitted){
      setIsDataSubmitted(true);
      return;
    }

    login(currState==='Sign Up'?'signup':'login',{fullName,email,password,bio})
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

  {/* ------- left ------- */}
  <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]' />

  {/* ------- right ------- */}
  <form onSubmit={onSubmitHandler}  className='bg-[#1a1a2e]/90 text-white border border-gray-600 p-6 flex flex-col gap-6 rounded-xl shadow-xl backdrop-blur'>
  <h1 className='font-bold text-2xl flex justify-between items-center'>
    {currState}
    {isDataSubmitted &&     <img src={assets.arrow_icon} className='w-5 cursor-pointer' alt="" />
}
  </h1>

  {currState === "Sign Up" && !isDataSubmitted && (
    <input
      onChange={(e) => setFullName(e.target.value)}
      value={fullName}
      type="text"
      className="p-3 bg-[#0f0f1a] border border-gray-700 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
      placeholder="Full Name"
      required
    />
  )}

  {!isDataSubmitted && (
    <>
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        placeholder="Email Address"
        className="p-3 bg-[#0f0f1a] border border-gray-700 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        required
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        placeholder="Password"
        className="p-3 bg-[#0f0f1a] border border-gray-700 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        required
      />
    </>
  )}

  {currState === "Sign Up" && isDataSubmitted && (
    <textarea
      rows={4}
      value={bio}
      onChange={(e) => setBio(e.target.value)}
      placeholder="Provide a short bio...."
      className="p-3 bg-[#0f0f1a] border border-gray-700 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    ></textarea>
  )}

  <button
    type="submit"
    className="py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md hover:brightness-110 transition duration-300"
  >
    {currState === "Sign Up" ? "Create Account" : "Login Now"}
  </button>

  <div className="flex items-center gap-2 text-sm text-gray-400">
    <input type="checkbox" className="accent-purple-500" />
    <p>Agree to the terms of use & privacy policy.</p>
  </div>

  <div className='flex flex-col gap-2 '>
    {
      currState==='Sign Up'?(
        <p className='text-sm text-gray-600'>Already have an account <span onClick={()=>{setCurrState("Login");setIsDataSubmitted(false)}} className='font-bold text-violet-600 cursor-pointer'>Login Here</span></p>
      ):(<p className='text-sm text-gray-600'>Create an Account <span onClick={()=>setCurrState("Sign Up")} className='font-bold text-violet-600 cursor-pointer'>Click here</span></p>)
    }
  </div>

</form>


</div>
  )
}

export default LoginPage