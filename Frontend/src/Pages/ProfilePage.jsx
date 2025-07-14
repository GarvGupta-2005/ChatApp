import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from '../Context/AuthContext'

const ProfilePage = () => {

    const { authUser, updateProfile } = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio)


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImg) {
      await updateProfile({ fullName: name, bio })
      navigate('/')
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async ()=>{
      const base64Image = reader.result;
      await updateProfile({profilePic : base64Image,fullName:name,bio:bio});
      navigate('/')
    }

  }

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-lg">Profile details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e) => setSelectedImg(e.target.files[0])} type="file" id="avatar" accept='.png, .jpeg, .jpg' hidden />
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} className={`w-12 h-12 ${selectedImg && 'rounded-full'}`} alt="" />
            Upload Profile pic

          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder="Your name"
            className="w-full p-3 rounded-md bg-gradient-to-r from-[#0f0f1a] via-[#1f1f3a] to-[#2b2b60] text-white placeholder-gray-400 border border-white/10 shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <textarea
            placeholder="Enter your bio"
            required onChange={(e) => setBio(e.target.value)} value={bio}
            className="w-full p-3 rounded-md bg-gradient-to-r from-[#0f0f1a] via-[#1f1f3a] to-[#2b2b60] text-white placeholder-gray-400 border border-white/10 shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            rows={4}
          />

          <button type="submit" className="bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-full p-2 text-lg cursor-pointer">Save</button>
        </form>

        <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`} src={authUser?.profilePic || assets.logo_icon} alt="" />

      </div>
    </div>
  )
}

export default ProfilePage