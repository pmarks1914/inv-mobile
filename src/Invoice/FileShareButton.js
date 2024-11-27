import React, { useState } from 'react';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import html2pdf from 'html2pdf.js';

const ShareProForma = () => {
  const [isSharing, setIsSharing] = useState(false);

  const htmlContent = `<!DOCTYPE html>
        <html>
        <head>
        <title>Pro-Forma</title>
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
        <table style="width: 100%; margin-bottom: 20px; padding-left: 0px; border: none;">
            <tr style="border: 0px solid #fff; padding-left: 0px;" >
            <td style="width: 30%; vertical-align: top; border: 0px solid #fff; padding-left: 0px;">
                <h1>Pro-Forma</h1>
            </td>
            <td style="width: 40%; vertical-align: top; border: 1px solid #fff"> </td>
            <td style="width: 30%; text-align: right; border: 1px solid #fff">
                <img src="https://invoice-ms-s3.s3.us-east-2.amazonaws.com/65bae6b2-dfa9-40d9-a432-315cab3c9922.png" alt="Company Logo" class="logo" />
            </td>
            </tr>
        </table>

        <table style="width: 100%; margin-bottom: 0px; padding-left: 0px; border: none;">
            <tr style="border: 0px solid #fff; padding-left: 0px;" >
            <td style="width: 40%; vertical-align: top; border: 0px solid #fff; padding-left: 0px;">
                <div class="section-bill-from padding-left: 0px;">
                <h2>From</h2>
                <p>Cone </p>
                <p>P.o.Box 23456 PME st.</p>
                </div>
            </td>
            <td style="width: 40%; vertical-align: top; border: 1px solid #fff">
                <div class="section-bill-to">
                <h2>Bill To</h2>
                <p></p>
                <p></p>
                </div>
            </td>
            </tr>
        </table>

        <div class="section">
            <h2>Pro-Forma Details</h2>
            <p>Pro-Forma Number: </p>
            <p>Date: 2024-11-20</p>
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
                <tr>
                <td></td>
                <td>1</td>
                <td>USD 0.00</td>
                <td class="text-right">USD 0.00</td>
                </tr>
                <tr style=" padding-top: 0px; margin-top: 0px; border: 1px solid #000">
                    <td style="border: 0px solid #fff"></td>
                    <td style="border: 0px solid #fff"></td>  
                    <td style="border: 0px solid #fff"></td>                        
                    <td class="text-right" style="border: 0px solid #fff">        
                        <div class="section-total">
                            <p>Subtotal: USD 0.00</p>
                            <p>Tax (10%): USD 0.00</p>
                            <p class="total">Total: USD 0.00</p>
                        </div>
                    </td>
                </tr>
            </tbody>
            </table>
        </div>

        <div class="section">
            <h2>Notes</h2>
            <p>This is for the purchase of goods and services</p>
        </div>
        </body>
        </html>`;

  const shareProforma = async () => {
    try {
      setIsSharing(true);

      // Create a temporary container for the HTML content
      const container = document.createElement('div');
      container.innerHTML = htmlContent;
      document.body.appendChild(container);

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
    <div className="p-4">
      <button
        onClick={shareProforma}
        disabled={isSharing}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
      >
        {isSharing ? 'Creating PDF...' : 'Share as PDF'}
      </button>
    </div>
  );
};

export default ShareProForma;