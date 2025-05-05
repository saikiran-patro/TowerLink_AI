import React, { useContext, useRef, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import ChatScreenLoader from './ChatScreenLoader';
import avatar from "../assets/Images/avatar.png";
import UiContext from '../lib/UiContext';
import MessageSkeletion from './ShimmerUI/MessageSkeletion';
import { useSelector } from 'react-redux';
import ChatInput from './ChatInput';
import { formatMessageTime } from '../lib/utils';
import { ArrowLeft } from 'lucide-react';
import { setCurrentSelectedUser } from '../Store/chatSlice';
const ChatScreen = () => {
    const currentSelectedUser = useSelector((data) => data.chat.currentSelectedUser);

    const currentLoggedInUser = useSelector((data) => data.auth);
  
    const messages = useSelector((data) => data.chat.messages);
    const isMessagesLoading = useSelector((data) => data.chat.isMessagesLoading);
    const onlineUsers=useSelector((data)=>data.chat?.onlineUsers)
    const dispatch=useDispatch()
    const chatInputRef = useRef(null);
    const { navBarRef } = useContext(UiContext);
    const chatContainer = useRef(null);
    const chatScreenHeader = useRef(null);

    // ResizeObserver for dynamic height
    useEffect(() => {
        const updateHeight = () => {
            if (chatContainer.current && navBarRef?.current && chatScreenHeader?.current && chatInputRef?.current) {
                const navHeight = navBarRef.current.getBoundingClientRect().height;
                const headerHeight = chatScreenHeader.current.getBoundingClientRect().height;
                const chatInputHeight = chatInputRef.current.getBoundingClientRect().height;

                console.log("Heights =>", { navHeight, headerHeight, chatInputHeight });

                chatContainer.current.style.height = `calc(100vh - ${navHeight}px - ${headerHeight}px - ${chatInputHeight}px)`;
            }
        };

        updateHeight(); // Initial call

        const observer = new ResizeObserver(() => updateHeight());

        if (navBarRef.current) observer.observe(navBarRef.current);
        if (chatScreenHeader.current) observer.observe(chatScreenHeader.current);
        if (chatInputRef.current) observer.observe(chatInputRef.current);

        return () => observer.disconnect();
    }, [navBarRef]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (chatContainer.current) {
            chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div style={{height:'calc(100vh - 82px)'}}className={`${currentSelectedUser ? 'w-[80%] userMobChatView' : 'w-[80%] noUserMobChatView'}  flex flex-col`}>
            {currentSelectedUser ? (
                <>
                    {/* Chat Header */}
                    <div ref={chatScreenHeader} className='orbitron-header-sm text-white bg-[#131314] p-[20px] flex flex-row gap-2 justify-between items-center'>
                        <div className='flex justify-center items-center'>{currentSelectedUser?.profilePicture ? (
                            <img src={currentSelectedUser.profilePicture} alt={currentSelectedUser.fullName} className='w-6 h-6 rounded-full' />
                        ) : (
                            <div className='bg-white ring-primary ring-offset-base-100 w-6 h-6 rounded-full'>
                                <img src={avatar} alt="user" />
                            </div>
                        )}
                        <span>
                            <div className='flex flex-col justify-start pl-2'><span>{currentSelectedUser.fullName}</span>
                                <span className='orbitron-header-sm text-[12px] text-green-200'>{onlineUsers.includes(currentSelectedUser.userId ) && "Active Now"}</span>
                            </div>
                        </span>

                        </div>
                        <div onClick={()=>{ dispatch(setCurrentSelectedUser(null))  }} className='px-[15px] py-[5px] bg-black rounded-[15px]'>
                            <button className="bg-black p-2 rounded">
                                <ArrowLeft className="text-white" />
                            </button>

                        </div>
                    </div>

                    {/* Encryption Info */}
                    <div className='w-fit my-[15px] mx-auto orbitron-header-sm p-[5px_10px] rounded-lg text-white bg-[#131314]'>
                        Signals are End-to-End Encrypted
                    </div>

                    {/* Chat Container */}
                    <div ref={chatContainer} className="flex-1 overflow-y-auto p-4 scroll-smooth">
                        {isMessagesLoading ? (
                            <MessageSkeletion />
                        ) : messages.length ? (
                            messages.map((message) => (
                                <div
                                key={message._id}
                                className={`chat mt-[10px] ${
                                  message.senderId === currentSelectedUser.userId
                                    ? currentSelectedUser?.fullName === 'TowerLink AI'
                                    ? 'chat-start'
                                    : 'chat-start'
                                    : 'chat-end'
                                }`}
                              >
                                  <div className='chat-image avatar'>
                                        <div className='size-10 rounded-full border bg-red-500'>
                                            <img
                                                src={
                                                    message.senderId === currentSelectedUser.userId
                                                        ? currentSelectedUser.profilePicture || avatar
                                                        : currentLoggedInUser.profilePic || avatar
                                                }
                                                alt='profile Pic'
                                            />
                                        </div>
                                    </div>
                                    <div className='chat-header mb-1'>
                                        <time className='text-xs opacity-50 ml-1 text-white'>{formatMessageTime(message.createdAt)}</time>
                                    </div>
                                    <div className='chat-bubble flex flex-col'>
                                        {message.image && (
                                            <img src={message.image} alt="Attachment" className='sm:max-w-[100%] rounded-md mb-2 mx-auto my-0' />
                                        )}
                                        {message.text && 
                                            currentSelectedUser?.fullName === 'TowerLink AI'?  (<div className='ai-message'>{message.text}</div>):( <pre className={` text-white ${message.image ? 'mt-[20px]' : ''}`}>{message.text}</pre>)
                                               
                                            
                                            
                                        }
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='w-full h-full flex justify-center items-center flex-col gap-2.5'>
                                <ChatScreenLoader />
                                <div className='orbitron-header-sm p-[5px_10px] rounded-lg text-white bg-[#131314]'>
                                    No messages yet. Start sending signals
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chat Input */}
                    <div className='bg-black' ref={chatInputRef}>
                        <ChatInput />
                    </div>
                </>
            ) : (
                // No user selected
                <div className='relative w-full h-full flex flex-col justify-center items-center'>
                    <div className='orbitron-header-sm absolute top-[50px] p-[5px_10px] rounded-lg text-white bg-[#131314] left-[50%] transform -translate-x-1/2'>
                        Signals are End-To-End Encrypted
                    </div>
                    <ChatScreenLoader />
                    <div className='absolute orbitron-header-sm p-[5px_10px] rounded-lg text-white bg-[#131314] left-[50%] transform -translate-x-1/2 bottom-2'>
                        Select a Chat to send signal
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatScreen;
