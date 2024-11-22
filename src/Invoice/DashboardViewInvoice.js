import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import getLogo from '../logo.png'
import { Col, Container, Row } from 'reactstrap';

import { Printer } from '@bcyesil/capacitor-plugin-printer';


let userDataStore = JSON.parse(localStorage.getItem("userDataStore"));

// console.log("userDataStore ", userDataStore)
const logo = userDataStore?.user?.file_photo || 'https://test.ventureinnovo.com/static/media/logo.a51192bf9b20006900d6.png';

// get old invoice list
const getInvoice = JSON.parse(localStorage.getItem("old-invoice"));

const DashboardViewInvoice = () => {
    const [invoiceData, setInvoiceData] = useState(getInvoice);

    const calculateSubtotal = () => {
        return invoiceData?.items?.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    };

    const calculateTax = () => {
        return calculateSubtotal() * 0.1; // 10% tax rate
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax();
    };

    // print invoive
    const printInvoice = async () => {
        // Create the HTML content
        const invoiceContent = `
            <!DOCTYPE html>
            <html>
            <head>
            <title>${invoiceData?.invoiceType || "Invoice"}</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                font-family: Arial, sans-serif;
                padding: 20px;
                }

                h1 {
                font-size: 24px;
                margin-bottom: 10px;
                }

                .section {
                margin-bottom: 20px;
                }

                .section h2 {
                font-size: 18px;
                margin-bottom: 8px;
                }

                table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                }

                table, th, td {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
                }

                .logo {
                width: 90px;
                }

                .watermark {
                position: fixed;
                top: 40%;
                left: 12%;
                transform: translate(-50%, -50%);
                opacity: 0.3;
                z-index: -1;
                }
                .total {
                font-weight: bold;
                }

                .text-right {
                text-align: right;
                }

                @media print {
                body {
                    margin: 0;
                    padding: 20px;
                    -webkit-print-color-adjust: exact;
                }

                .watermark {
                    opacity: 0.3 !important;
                }
                }
            </style>
            </head>
            <body>
            <!-- <img src=${logo} alt="Company Logo" class="watermark" style="width: 400px; height: auto;" /> -->

            <!-- Table layout for logo and invoice Type -->
            <table style="width: 100%; margin-bottom: 20px; padding-left: 0px; border: none;">
                <tr style="border: 0px solid #fff; padding-left: 0px;" >
                <td style="width: 30%; vertical-align: top; border: 0px solid #fff; padding-left: 0px;">
                    <h1>${invoiceData?.invoiceType || "Invoice"}</h1>
                </td>
                <td style="width: 40%; vertical-align: top; border: 1px solid #fff"> </td>
                <td style="width: 30%; text-align: right; border: 1px solid #fff">
                    <img src=${logo} alt="Company Logo" class="logo" />
                </td>
                </tr>
            </table>

            <!-- Table layout for billing sections -->
            <table style="width: 100%; margin-bottom: 0px; padding-left: 0px; border: none;">
                <tr style="border: 0px solid #fff; padding-left: 0px;" >
                <td style="width: 40%; vertical-align: top; border: 0px solid #fff; padding-left: 0px;">
                    <div class="section-bill-from padding-left: 0px;">
                    <h2>From</h2>
                    <p>${invoiceData?.companyName}</p>
                    <p>${invoiceData?.companyAddress}</p>
                    </div>
                </td>
                <td style="width: 40%; vertical-align: top; border: 1px solid #fff">
                    <div class="section-bill-to">
                    <h2>Bill To</h2>
                    <p>${invoiceData?.clientName}</p>
                    <p>${invoiceData?.clientAddress}</p>
                    </div>
                </td>
                </tr>
            </table>

            <div class="section">
                <h2>${invoiceData?.invoiceType || "Invoice"} Details</h2>
                <p>${invoiceData?.invoiceType || "Invoice"} Number: ${invoiceData?.invoiceNumber}</p>
                <p>Date: ${invoiceData?.date}</p>
            </div>

            <div class="section">
                <h2>Items</h2>
                <table>
                <thead>
                    <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoiceData?.items?.map(item => `
                    <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>${invoiceData?.currency} ${item.price.toFixed(2)}</td>
                    <td class="text-right">${invoiceData?.currency} ${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                    `).join('')}
                    
               
                    <tr style=" padding-top: 0px; margin-top: 0px; border: 1px solid #000">
                        <td style="border: 0px solid #fff"></td>
                        <td style="border: 0px solid #fff"></td>  
                        <td style="border: 0px solid #fff"></td>                        
                        <td class="text-right" style="border: 0px solid #fff">        
                            <div class="section-total">
                                <p>Subtotal: ${invoiceData?.currency} ${calculateSubtotal().toFixed(2)}</p>
                                <p>Tax (10%): ${invoiceData?.currency} ${calculateTax().toFixed(2)}</p>
                                <p class="total">Total: ${invoiceData?.currency} ${calculateTotal().toFixed(2)}</p>
                            </div>
                        </td>
                    </tr>
                </tbody>
                
                </table>
            </div>

            <div class="section">
                <h2>Notes</h2>
                <p>${invoiceData?.notes}</p>
            </div>
            </body>
            </html>
        `;


        try {
            if (/Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                // Create a new window for printing
                window.document.write(`${invoiceContent}`);
                window.document.close()
                if (window?.Capacitor?.platform === "web") {
                    // for web
                    window.print()
                }
                else {
                    // for mobile
                    console.log('Print start:');
                    try {
                        Printer.print({ content: invoiceContent })

                    } catch (error) {
                        console.error('Error printing invoice:', error);
                    } finally {
                        console.log('Print result:');
                    }

                }
                window.location.reload();

            } else {

                // Create an iframe and set its content
                const iframe = document.createElement('iframe');
                document.body.appendChild(iframe);
                iframe.style.position = 'absolute';
                iframe.style.width = '0';
                iframe.style.height = '0';
                iframe.style.border = 'none';

                const doc = iframe.contentWindow.document;
                doc.open();
                doc.write(invoiceContent);
                doc.close();

                // Trigger print dialog
                iframe.contentWindow.print();

                // Remove the iframe after printing
                iframe.onload = () => {
                    setTimeout(() => document.body.removeChild(iframe), 500);
                };
            }
        } catch (error) {
            console.error('Printing failed:', error);
            // Fallback for mobile
            const printFallback = () => {
                const printContent = document.createElement('div');
                printContent.innerHTML = invoiceContent;
                document.body.appendChild(printContent);
                window.print();
                document.body.removeChild(printContent);
            };
            printFallback();
        }
    };


    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            {/* <div className=""> */}
            <Container className=' mb-10 '>
                <div className="text-3xl font-bold mb-6 text-gray-800">Preview {invoiceData?.invoiceType || "Invoice"}</div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1"> {invoiceData?.invoiceType || "Invoice"} Number</label>
                        <input
                            type="text"
                            name="invoiceNumber"
                            defaultValue={invoiceData?.invoiceNumber}
                            // onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            placeholder="INV-001"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            name="date"
                            defaultValue={invoiceData?.date}
                            // onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <div className="font-medium mb-2">From:</div>
                        <input
                            type="text"
                            name="companyName"
                            defaultValue={invoiceData?.companyName}
                            // onChange={handleInputChange}
                            className="w-full p-2 border rounded mb-2"
                            placeholder="Your Company Name"
                        />
                        <textarea
                            name="companyAddress"
                            defaultValue={invoiceData?.companyAddress}
                            // onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            placeholder="Your Company Address"
                            rows="3"
                        />
                    </div>
                    <div>
                        <div className="font-medium mb-2">Bill To:</div>
                        <input
                            type="text"
                            name="clientName"
                            defaultValue={invoiceData?.clientName}
                            // onChange={handleInputChange}
                            className="w-full p-2 border rounded mb-2"
                            placeholder="Client Name"
                        />
                        <textarea
                            name="clientAddress"
                            defaultValue={invoiceData?.clientAddress}
                            // onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            placeholder="Client Address"
                            rows="3"
                        />
                    </div>
                </div>


                <div className="mb-6">
                    <div className="font-medium mb-2">Items:</div>
                    <div className="space-y-2">
                        {invoiceData?.items?.map((item, index) => (
                            <div key={index} className="flex gap-0 items-start">
                                <input
                                    type="text"
                                    defaultValue={item.description}
                                    className="flex-grow w-20 p-2 border rounded grid grid-cols-2"
                                    placeholder="Item description"
                                />
                                <input
                                    type="number"
                                    defaultValue={item.quantity}
                                    className="w-20 p-2 border rounded"
                                // min="1"
                                />
                                <input
                                    type="number"
                                    defaultValue={item.price}
                                    className="w-20 p-2 border rounded"
                                // min="0"
                                // step="0.01"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-end space-y-2">
                        <div className="w-64">
                            <div className="flex justify-between mb-2">
                                <span>Subtotal:</span>
                                <span>{invoiceData?.currency} {calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span>Tax (10%):</span>
                                <span>{invoiceData?.currency} {calculateTax().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span>{invoiceData?.currency}{calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                        name="notes"
                        defaultValue={invoiceData?.notes}
                        // onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Additional notes..."
                        rows="3"
                    />
                </div>

                <button
                    onClick={() => printInvoice()}
                    className="mt-6 mb-6 bg-color-light-blue p-2 rounded"
                >
                    View Invoice
                </button>

            </Container>

        </div>
    );
};

export default DashboardViewInvoice;
