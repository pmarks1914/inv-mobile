import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

import logo from '../logo.png'
import { Col, Container, Row } from 'reactstrap';
import Swal from 'sweetalert2';
import Select, { ActionMeta, OnChangeValue } from 'react-select';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/outline';
import LockOut from './LockOut';



const Profile = () => {
    // get old invoice list
    const profileGetData = JSON.parse(localStorage.getItem("profile"));
    const [profileData, setprofileData] = useState(profileGetData);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setprofileData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleInputInvTypeChange = (e) => {
        setprofileData(prev => ({
            ...prev,
            "invoiceType": e.value
        }));
        // console.log( e.value, profileData)        
    };

    const handleInputTaxChange = (e) => {
        const { name, value } = e.target;
        setprofileData({
            ...profileData,
            'tax': (value / 100)
        });

    };

    // print invoive
    const profilePost = () => {

        Swal.fire({
            icon: 'info',
            title: 'Action: Save Profile',
            text: 'Proceed to save',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: "Cancel",
            cancelButtonColor: 'red',
            confirmButtonColor: 'blue'
        }).then((result) => {
            if (result.isConfirmed) {
                // console.log("profileData ", profileData)
                // set new Profile
                localStorage.setItem("profile", JSON.stringify(profileData));
            }
            else {
                // 
            }
        });
    };

    // const optionRoles = Object.keys( roleData?.all_roles || []).map((post, id) => {
    //     console.log("optionRoles ", roleData?.all_roles)
    //     return {
    //       "value": roleData?.all_roles[id].role_id,
    //       "label": roleData?.all_roles[id]?.name?.toUpperCase()
    //   }});
    let invoiceType = [
        { "value": "Invoice", "label": "Invoice" },
        { "value": "Pro-Forma", "label": "Pro-Forma" },
        { "value": "Receipt", "label": "Receipt" }
    ]


    return (
        <div className="max-w-4xl mx-auto p-6 mb-10 bg-white rounded-lg ">
            {/* <div className="m"> */}
            <LockOut />

            <Container className=' mb-10 '>
                <div className="text-3xl font-bold mb-6 text-gray-800">Profile</div>

                <div className="grid gap-6">
                    <div>
                        <label htmlFor='companyName'> Company Name </label>
                        <input
                            type="text"
                            name="companyName"
                            id="companyName"
                            value={profileData?.companyName}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded mb-2"
                            placeholder="Your Company Name"
                        />
                        <label htmlFor='companyAddress'> Address </label>
                        <textarea
                            name="companyAddress"
                            id='companyAddress'
                            value={profileData?.companyAddress}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded mb-2"
                            placeholder="Your Company Address"
                            rows="3"
                        />
                        <label htmlFor='currency'> Currency </label>
                        <input
                            type="text"
                            name="currency"
                            id='currency'
                            value={profileData?.currency}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded mb-2"
                            placeholder="Your Currency"
                        />
                        <label htmlFor='notes'> Notes </label>
                        <textarea
                            name="notes"
                            id='notes'
                            value={profileData?.notes}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded mb-2"
                            placeholder="Your Notes"
                        />
                        <label htmlFor='tax'> Tax </label>
                        <input
                            type="number"
                            name="tax"
                            value={profileData?.tax * 100}
                            onChange={(e) => handleInputTaxChange(e)}
                            className="w-full p-2 border rounded"
                            placeholder="Tax rate eg. 10"
                            min="0"
                            max="100"
                        />
                        <label htmlFor="selectInvoiceType" className="mb-0 mt-2"> Type </label>
                        <Select
                            // isMulti
                            className='mt-0'
                            id='selectInvoiceType'
                            defaultInputValue={profileData?.invoiceType}
                            placeholder="Select an invoice..."
                            onChange={(e) => handleInputInvTypeChange(e)}
                            options={invoiceType}
                        />
                    </div>

                </div>

                <button
                    onClick={profilePost}
                    className="mt-6 bg-color-light-blue p-2 rounded"
                >
                    Save
                </button>

            </Container>


        </div>
    );
};

export default Profile;