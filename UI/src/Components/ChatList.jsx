import { Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import Contact from './Contact';
import React, { useContext, useEffect, useRef, useState } from 'react';
import UiContext from '../lib/UiContext';

const ChatList = ({ getMessages }) => {
  const signalList = useSelector((data) => data.chat.users);
  const currentSelectedUser = useSelector((data) => data.chat.currentSelectedUser);
  const onlineUsers = useSelector((data) => data.chat?.onlineUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredList, setFilteredList] = useState(signalList);
  const debounceRef = useRef(null);

  const searchBarContainer = useRef(null);
  const signalListContainer = useRef(null);
  const { navBarRef } = useContext(UiContext);

  // Debounce and filter logic with TowerLink AI pinned
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const lowerSearchTerm = searchTerm.toLowerCase();

      const towerLinkAI = signalList.find(signal =>
        signal?.fullName?.toLowerCase() === 'towerlink ai'
      );

      const otherFilteredUsers = signalList.filter(signal =>
        signal?.fullName?.toLowerCase() !== 'towerlink ai' &&
        signal?.fullName?.toLowerCase().includes(lowerSearchTerm)
      );

      const finalList = towerLinkAI
        ? [towerLinkAI, ...otherFilteredUsers]
        : otherFilteredUsers;

      setFilteredList(finalList);
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [searchTerm, signalList]);

  // Adjust scrollable container height dynamically
  useEffect(() => {
    if (navBarRef.current && searchBarContainer.current && signalListContainer.current) {
      const navBarHeight = navBarRef.current.getBoundingClientRect().height;
      const searchBarHeight = searchBarContainer.current.getBoundingClientRect().height;

      signalListContainer.current.style.height = `calc(100vh - ${navBarHeight}px - ${searchBarHeight}px)`;
      signalListContainer.current.style.overflow = 'auto';
    }
  }, [navBarRef, searchBarContainer]);

  return (
    <aside className={`chatListContainer flex flex-col w-[20%] max-w-[600px] text-white bg-[#131314] ${currentSelectedUser ? 'hideChatList' : 'showChatList'}`}>
      <div ref={searchBarContainer} className='border-b border-[#ffffff2b]'>
        <p className='flex text-center text-2xl orbitron-header my-[20px] mx-auto justify-center items-center'>
          Signal List
        </p>

        <div className='flex flex-row justify-between items-center bg-black rounded-2xl w-[80%] my-4 mx-auto py-[8px] px-[15px]'>
          <input
            type='text'
            className='w-[80%] outline-0 border-0 bg-black text-white'
            placeholder='Search'
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className='w-[18px] cursor-pointer' />
        </div>
      </div>

      <div ref={signalListContainer} className="overflow-auto">
        {filteredList.map((signal, index) => (
          <Contact
            key={index}
            getMessages={getMessages}
            fullName={signal?.fullName}
            id={signal?._id}
            profilePicture={signal?.profilePicture}
          />
        ))}
      </div>
    </aside>
  );
};

export default ChatList;
