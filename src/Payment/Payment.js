import React from 'react';

const Payment = () => {

    let url = window.location.href;
    const urlObject = new URL(url);
    const searchParams = new URLSearchParams(urlObject.search);
    console.log(searchParams)
    
    return (
        <div>
            


        <iframe src='/pay.html'  width="100%" height="950px" title="Iframe Pay"> </iframe>
        </div>
    );
};




export default Payment;