import React, { useEffect, useContext, useState } from 'react'
import assets, { messagesDummyData, userDummyData } from '../assets/assets'
import { useRef } from 'react'
import { formatMessageTime } from '../Library/utils'
import { AuthContext } from '../Context/AuthContext'
import { ChatContext } from '../Context/ChatContext'


const ChatContainer = () => {

  const { messages, users, selectedUser, getUsers, sendMessage, setMessages, setSelectedUser, unseenMessages, setUnseenMessages,getMessage } = useContext(ChatContext);

  const { logout, onlineUsers, authUser } = useContext(AuthContext);

  const [input, setInput] = useState('')

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") { return null };
    await sendMessage({ text: input.trim() })
    setInput('');
  }

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("select an image file");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };

    reader.readAsDataURL(file);
  };



  const scrollEnd = useRef()

  useEffect(()=>{
    if(selectedUser){
      getMessage(selectedUser._id)
    }
  },[selectedUser])

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return selectedUser ? (
    <div className='h-full overflow-scroll backdrop-blur-lg'>
      {/* header */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-600'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-8 rounded-full' />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-ful bg-green-500'></span>}
        </p>
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7' />
        <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />
      </div>
      {/* Chat Area */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6 '>
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
            {
              msg.image ? (<img src={msg.image} alt='img' className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8'></img>) : (<p className={`p-2 max-w-[200px] md:text-sm font-medium rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>)
            }

            <div className='text-center text-xs'>
              <img src={msg.senderId === authUser._id ? authUser?.profilePic ||  assets.avatar_icon : selectedUser.profilePic || assets.avatar_icon} className='w-7 rounded-full' alt="" />
              <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
            </div>

          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* Bottom Areaa */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
        <div className="flex items-center gap-3">

          {/* Input container with backdrop blur and semi-transparent black */}
          <div className="flex flex-1 items-center bg-black/30 backdrop-blur-md border border-white/10 rounded-full px-4 py-2">
            <input
              type="text"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="Send a message"
              onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null}
              className="flex-1 bg-transparent text-sm p-2 border-none outline-none text-white placeholder-gray-400"
            />

            <input
              type="file"
              onChange={handleSendImage}
              id="image"
              accept="image/png, image/jpeg"
              hidden
            />

            <label htmlFor="image">
              <img
                src={assets.gallery_icon}
                alt=""
                className="w-5 h-5 cursor-pointer opacity-70 hover:opacity-100"
              />
            </label>
          </div>

          {/* Purple send button */}
          <img
            src={assets.send_button}
            alt=""
            onClick={handleSendMessage}
            className="w-9 h-9 p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition cursor-pointer"
          />
        </div>
      </div>

    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} alt="" className='max-w-16' />
      <p className='text-lg text-white'>Chat Anytime Anywhere</p>
    </div>
  )
}

export default ChatContainer