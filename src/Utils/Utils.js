import axios from "axios";
import Swal from 'sweetalert2';



const userData = JSON.parse(localStorage.getItem("userDataStore"));
let counter = 1000;

export function getSessionTimeout(){ 
    try {
        
    if(userData){
        let x = setInterval(function() {
            const currentUser_new = JSON.parse(localStorage.getItem("userDataStore"));
            let now = new Date().getTime();
            let distance = new Date(currentUser_new?.timeLogout).getTime() - now;
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);
            console.log( " <> ", currentUser_new?.counter);
            // console.log(distance " <> ", seconds);

            if(distance < 5742 ){
              Swal.fire({
                  icon: 'error',
                  title: 'Signing you out in ' + (seconds < 1 ? 0 : seconds) + 's.',
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                  closeOnConfirm: false
              })
            }
            if (distance < 1) {
            clearInterval(x);
              setTimeout(function () {
                window.location.href = "/login";
              }, 100);
            
            localStorage.removeItem("userDataStore")
            // localStorage.clear()
            }
        }, 1000);
    }
    } catch (error) {
        
    }

   
    // function trackActivity(){ 
    //     // e.preventDefault();
    //     const currentUser_new = JSON.parse(localStorage.getItem("userData")) || [];    
    //     currentUser_new["timeLogout"] = new Date().getTime() + counter;
    //     localStorage.setItem('userData', JSON.stringify(currentUser_new));
    
    // }

    // return{
    //     "getSessionTimeout": trackActivity()
    // }
    
}