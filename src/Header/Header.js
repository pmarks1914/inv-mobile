import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon, SearchIcon, BellIcon, NewspaperIcon, UserIcon } from '@heroicons/react/outline';


const Header = () => {
  const navigate = useNavigate();
  const userDataStore = JSON.parse(localStorage.getItem("userDataStore"));
  // console.log("userDataStore ", userDataStore)

  const navItems = [
    { name: 'Home', icon: <HomeIcon className="h-6 w-6" />, route: '/home' },
    // { name: 'Search', icon: <SearchIcon className="h-6 w-6" />, route: '/search' },
    { name: 'Invoice', icon: <NewspaperIcon className="h-6 w-6" />, route: '/invoice' },
    { name: 'Profile', icon: <UserIcon className="h-6 w-6" />, route: '/profile' },
  ];

  return (
    // <div className="fixed bottom-0 w-full bg-white shadow-lg border-t md:hidden">
    <div className='m-3 mt-4'>
      <div className="fixed position-relative top-0 w-full shadow-lg border-t mb-3 p-3 rounded-5 text-white bg-color-light-blue">
      <div className="flex p-3 text-2xl">
        Welcome, {userDataStore?.user?.first_name}
      </div>
    </div>
    </div>
  );
};


export default Header;
