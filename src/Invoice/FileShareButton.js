import React, { useState } from 'react';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import html2pdf from 'html2pdf.js';


let userDataStore = JSON.parse(localStorage.getItem("userDataStore"));

const logo = userDataStore?.user?.file_photo || 'https://test.ventureinnovo.com/static/media/logo.a51192bf9b20006900d6.png';

// get old invoice list
const getInvoice = JSON.parse(localStorage.getItem("old-invoice"));

console.log("logo >>>>", userDataStore?.user?.file_photo)
const ShareProForma = () => {
  const [isSharing, setIsSharing] = useState(false);
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

  const shareProforma = async () => {
    try {
      setIsSharing(true);

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

      // Create a temporary container for the HTML content
      const container = document.createElement('div');
      container.innerHTML = invoiceContent;
      document.body.appendChild(container);


      // Create an iframe and set its content
      // const iframe = document.createElement('iframe');
      // document.body.appendChild(iframe);
      // iframe.style.position = 'absolute';
      // iframe.style.width = '0';
      // iframe.style.height = '0';
      // iframe.style.border = 'none';

      // const doc = iframe.contentWindow.document;
      // doc.open();
      // doc.write(invoiceContent);
      // doc.close();


      // Configure PDF options
      const opt = {
        margin: 10,
        filename: 'proforma.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Generate PDF
      const pdfBlob = await html2pdf().from(container).set(opt).outputPdf('blob');
      document.body.removeChild(container);

      // Convert blob to base64
      const reader = new FileReader();
      const base64Data = await new Promise((resolve) => {
        reader.onloadend = () => {
          const base64data = reader.result.split(',')[1];
          resolve(base64data);
        };
        reader.readAsDataURL(pdfBlob);
      });

      // Save PDF to filesystem
      const fileName = `proforma-${Date.now()}.pdf`;
      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache,
        encoding: Filesystem.Encoding.BASE64
      });

      // Get URI for sharing
      const fileUri = await Filesystem.getUri({
        path: fileName,
        directory: Directory.Cache
      });

      // Share the PDF
      await Share.share({
        title: 'Pro-Forma Invoice',
        text: 'Sharing Pro-Forma Invoice PDF',
        url: fileUri.uri,
        dialogTitle: 'Share Pro-Forma PDF'
      });

      // Cleanup
      await Filesystem.deleteFile({
        path: fileName,
        directory: Directory.Cache
      });

    } catch (error) {
      console.error('Error sharing pro-forma:', error);
      alert('Error sharing pro-forma: ' + error.message);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="pt-4">
      {
        window.Capacitor.platform === "web" ? "" :
          <button
            onClick={shareProforma}
            disabled={isSharing}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
          >
            {isSharing ? 'Creating PDF...' : 'Share as PDF'}
          </button>
      }
    </div>
  );
};

export default ShareProForma;