import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon, CogIcon, BellIcon, NewspaperIcon, UserIcon } from '@heroicons/react/outline';
import AppWrapper from './AppWrapper';


const FooterNavigation = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', icon: <HomeIcon className="h-6 w-6 bg-red" />, route: '/home' },
    { name: 'Invoice', icon: <NewspaperIcon className="h-6 w-6" />, route: '/invoice' },
    { name: 'Profile', icon: <UserIcon className="h-6 w-6" />, route: '/profile' },
    { name: 'Settings', icon: <CogIcon className="h-6 w-6" />, route: '/change-password' },
  ];

  return (
    // <div className="fixed bottom-0 w-full bg-white shadow-lg border-t md:hidden">
    <div className="fixed bottom-0 w-full bg-white shadow-lg border-t">
      <div className="flex justify-around items-center p-3">
        {navItems?.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.route)}
            className="flex flex-col items-center text-gray-500 hover:text-blue-500 focus:outline-none"
          >
            {item.icon}
            <span className="text-xs mt-1">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};


export default FooterNavigation;
