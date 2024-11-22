import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import InvoiceGenerator from './Invoice/Invoice';
import Login from './Login/Login'
import SignUp from './register/signup';
import ResetPassword from './AccountSetup/ResetPassword';
import ChangePassword from './AccountSetup/ChangePassword';
import FooterNavigation from './Footer/FooterNavigation';
import Dashboard from './Dashboard/Dashboard';
import DashboardViewInvoice from './Invoice/DashboardViewInvoice';
import Profile from './Profile/Profile';
import Payment from './Payment/Payment';
import AppWrapper from './Footer/AppWrapper';


let userDataStore = JSON.parse(localStorage.getItem("userDataStore"));

function App() {
  const [footerManage, setFooterManage] = useState(false)
  // manage pages footer
  useEffect(()=> {
    if ( [ '/invoice', '/profile', '/home', '/dashboard-view-invoice'].includes(window.location.pathname) ) {
      console.log(window.location.pathname)
      setFooterManage(true)
    } 
  }, [])

  // console.log(window.location.pathname)

  const loading = (
    <div className="pt-3 text-center">
      <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
  )

  return (
    <Suspense fallback={loading}>
    <Router>
      <AppWrapper />
      <div style={{ flex: 1 }}>
        <Routes>
        {/* path access */}
        {
          userDataStore?.access_key ? 
          [
            <Route exact path="/reset-password" element={ <ResetPassword /> } key="1" />,
            <Route exact path="/change-password" element={ <ChangePassword /> } key="2" />,
            <Route exact path="/invoice" element={<InvoiceGenerator />} key="3" />,
            <Route exact path="/home" element={<Dashboard />} key="4" />,
            <Route exact path="/" element={<Dashboard />} key="5" />, 
            <Route exact path="/dashboard-view-invoice" element={<DashboardViewInvoice />  } key="6" />,
            <Route exact path="/profile" element={<Profile />  } key="7" />,
            <Route exact path="/pay" element={<Payment />  } key="8" />

          ] : 
          [ 
          <Route exact path="/reset-password" element={ <ResetPassword /> } key="1" />,
          <Route exact path="/" element={<Login />} key="2" />, 
          <Route exact path="/login" element={<Login />} key="3" />, 
          <Route exact path="/signup" element={ <SignUp /> } key="4" />,
          <Route exact path="*" element={<Login />} key="5" />, ]
        }
        </Routes>
        
        {
          userDataStore?.access_key ?
          <FooterNavigation />
          : ""
        }
      </div>
    </Router>
    </Suspense>
  );
}

export default App;
