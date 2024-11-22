import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../logo.png'; // Assuming you have a logo similar to the Login component
import LockOut from '../Profile/LockOut';
import Select, { ActionMeta, OnChangeValue } from 'react-select';



let userDataStore = JSON.parse(localStorage.getItem("userDataStore"));
let user_id = userDataStore?.user?.id

// console.log("userDataStore ", userDataStore)

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [error, setError] = useState({ oldPassword: false, newPassword: false, newPassword2: false });
  const [loading, setLoading] = useState(false);
  const [loadSubscription, setLoadSubscription] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [DataSubscriptionType, setDataSubscriptionType] = useState("")

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    setError({ oldPassword: !oldPassword, newPassword: !newPassword, newPassword2: !newPassword2 });
    if (!oldPassword || !newPassword || !newPassword2) return;

    if (newPassword !== newPassword2) {
      setSubmitError("New passwords do not match.");
      return;
    }

    setLoading(true);
    setSubmitError("");

    try {
      const response = await axios.patch(`${process.env.REACT_APP_BASE_API}/change-password/${user_id}`, {
          oldPassword,
          password1: newPassword,
          password2: newPassword2,
      },{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userDataStore?.token}`,
          'id': user_id
      }
      }
    );

      if (response?.data?.code?.toString() === "200") {
        // Handle successful password change (e.g., navigate or show success message)
        // setTimeout(() => window.location.href = '/dashboard', 1000);
        setSubmitError(`Completed: ${response.data.message}`);
      } else {
        setSubmitError(`Failed to change password. Please try again.${response.data.message}`);
      }
    } catch (err) {
      setSubmitError(`An error occurred. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  function handleInputSubTypeChange(e){
    setDataSubscriptionType(e.value)
    setLoadSubscription(true)
  }
  function submitSubscription(){
    // 
    localStorage.setItem("subscriptionType", JSON.stringify({"type": DataSubscriptionType}));
    window.location.href = '/pay'

  }


  let subscriptionType = [
    { "value": "Monthly", "label": "Monthly" },
    { "value": "Yearly", "label": "Yearly" },
    { "value": "Lifetime", "label": "Life-time" }
]

  return (
    <div>
      <div className="max-w-md mx-auto p-4 mt-0 bg-white rounded-lg">
        <LockOut />
        {/* <img src={logo} alt="Logo" className="w-24 mx-auto mb-6" /> */}
        <h2 className="text-2xl font-semibold text-center text-gray-800 mt-5 mb-4">Change Password</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={`w-full p-2 mt-1 border rounded ${error.oldPassword ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your old password"
            />
            {error.oldPassword && <p className="text-red-500 text-sm">Old password is required.</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full p-2 mt-1 border rounded ${error.newPassword ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your new password"
            />
            {error.newPassword && <p className="text-red-500 text-sm">New password is required.</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
              className={`w-full p-2 mt-1 border rounded ${error.newPassword2 ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Confirm your new password"
            />
            {error.newPassword2 && <p className="text-red-500 text-sm">Confirming new password is required.</p>}
          </div>

          {submitError && <p className="text-red-500 text-center mt-2">{submitError}</p>}

          <button
            type="submit"
            className=" py-2 px-4 bg-color-light-blue hover:bg-blue-700 font-semibold rounded"
            disabled={loading}
          >
            {loading ? <span className="loader"></span> : 'Submit'}
          </button>
        </form>


        <div className="mt-9 text-center">
          {/*  */}
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-0"> Subscription </h2>
        </div>

        <label htmlFor="selectSubscriptionType" className="mb-0 mt-2"> Select Plan Type </label>
        <Select
          // isMulti
          className='mt-0'
          id='selectSubscriptionType'
          placeholder="Select Subscription Plan..."
          onChange={(e)=> handleInputSubTypeChange(e)}
          options={subscriptionType}
        />
        
        {loadSubscription ? 
            <button
              type="submit"
              className="mt-4 py-2 px-4 bg-color-light-blue hover:bg-blue-700 font-semibold rounded"
              // disabled={loadSubscription}
              // onClick={()=>submitSubscription()}
            >
              {'Subscribe'}
            </button>
            : "" }

      </div>


    </div>
  );
};

export default ChangePassword;
