import { LockOpenIcon } from '@heroicons/react/outline';
import React from 'react';

const LockOut = () => {


    function lockOut(){
        window.location.href="/";
        localStorage.removeItem("userDataStore");
    }
    
    return (
        <div className="h-6 w-6 float-right" >
            <LockOpenIcon  className="h-6 w-6 float-right bg-red rounded-lg m-1 icon-lock-red" onClick={ ()=>{lockOut()} } />
        </div>
    );
};

export default LockOut;