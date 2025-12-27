import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateInvoicePDF = (invoice, settings) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header - Pharmacy Name
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(settings.pharmacyName || 'PHARMACY NAME', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(settings.address || 'Address Line', pageWidth / 2, 27, { align: 'center' });
  doc.text(`Phone: ${settings.phone || 'N/A'}`, pageWidth / 2, 32, { align: 'center' });
  
  doc.setFontSize(9);
  doc.text(`PAN: ${settings.pan || 'N/A'}    DDA: ${settings.dda || 'N/A'}`, pageWidth / 2, 37, { align: 'center' });
  
  // Invoice Title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth / 2, 45, { align: 'center' });
  
  // Line separator
  doc.line(15, 48, pageWidth - 15, 48);
  
  // Customer and Invoice Details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Left side - Customer details
  doc.text('Sold To:', 15, 55);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.customerName || 'N/A', 15, 60);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.customerAddress || '', 15, 65);
  doc.text(`PAN: ${invoice.customerPan || 'N/A'}`, 15, 70);
  doc.text(`Phone: ${invoice.customerPhone || 'N/A'}`, 15, 75);
  doc.text(`Mode of Payment: ${invoice.paymentMode || 'CASH'}`, 15, 80);
  
  // Right side - Invoice details
  doc.text(`Transaction Date: ${invoice.date}`, pageWidth - 15, 55, { align: 'right' });
  doc.text(`INVOICE NO: ${invoice.invoiceNo}`, pageWidth - 15, 60, { align: 'right' });
  doc.text(`DATE: ${invoice.date}`, pageWidth - 15, 65, { align: 'right' });
  doc.text(`MITI: ${invoice.miti || 'N/A'}`, pageWidth - 15, 70, { align: 'right' });
  
  // Line separator
  doc.line(15, 85, pageWidth - 15, 85);
  
  // Items Table
  const tableData = invoice.items.map((item, index) => [
    index + 1,
    item.description,
    item.packing,
    item.batch,
    item.expiry,
    item.quantity.toFixed(2),
    item.qtyDiscount ? item.qtyDiscount.toFixed(2) : '',
    item.rate.toFixed(2),
    item.amount.toFixed(2),
    item.mrp.toFixed(2),
    item.remarks || ''
  ]);
  
  doc.autoTable({
    startY: 90,
    head: [['NO.', 'DESCRIPTION', 'PACKING', 'BATCH NO', 'EXPIRY', 'QUANTITY', 'QTY.DISC', 'RATE', 'AMOUNT', 'MRP', 'REMARKS']],
    body: tableData,
    theme: 'plain',
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      lineWidth: 0.1,
      lineColor: [0, 0, 0]
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 35 },
      2: { cellWidth: 20 },
      3: { cellWidth: 20 },
      4: { cellWidth: 18 },
      5: { cellWidth: 18 },
      6: { cellWidth: 15 },
      7: { cellWidth: 18 },
      8: { cellWidth: 20 },
      9: { cellWidth: 18 },
      10: { cellWidth: 18 }
    },
    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();
      const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
      
      if (currentPage === pageCount) {
        const finalY = data.cursor.y;
        
        // Remarks
        if (invoice.remarks) {
          doc.setFontSize(9);
          doc.text(`Remarks: ${invoice.remarks}`, 15, finalY + 10);
        }
        
        // Totals section
        const totalsY = finalY + 20;
        doc.setFontSize(10);
        doc.text('TOTAL', pageWidth - 80, totalsY);
        doc.text(`: ${invoice.total.toFixed(2)}`, pageWidth - 50, totalsY, { align: 'right' });
        
        doc.text('Less Discount', pageWidth - 80, totalsY + 5);
        doc.text(`: ${invoice.discount.toFixed(2)}`, pageWidth - 50, totalsY + 5, { align: 'right' });
        
        if (invoice.ccOnFree > 0) {
          doc.text('Add C C on Free', pageWidth - 80, totalsY + 10);
          doc.text(`: ${invoice.ccOnFree.toFixed(2)}`, pageWidth - 50, totalsY + 10, { align: 'right' });
        }
        
        doc.text('Round Off', pageWidth - 80, totalsY + 15);
        doc.text(`: ${invoice.roundOff}`, pageWidth - 50, totalsY + 15, { align: 'right' });
        
        doc.setFont('helvetica', 'bold');
        doc.text('NET AMOUNT ....', pageWidth - 80, totalsY + 22);
        doc.text(`: ${invoice.netAmount.toFixed(2)}`, pageWidth - 50, totalsY + 22, { align: 'right' });
        
        // Amount in words
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(`In Words Rs. ${invoice.amountInWords}`, 15, totalsY + 30);
        
        // Footer notes
        doc.setFontSize(8);
        doc.text('E.& O.E.', pageWidth - 15, totalsY + 40, { align: 'right' });
        doc.text('* PLEASE PROVIDE DEAL/BONUS BENEFIT, IF ANY OF THIS INVOICE TO CONSUMERS', 15, totalsY + 45);
        
        // Signature section
        doc.text('RECEIVED BY', 15, totalsY + 55);
        doc.text('CHECKED BY', 80, totalsY + 55);
        doc.text(`FOR ${settings.pharmacyName || 'PHARMACY'}`, pageWidth - 15, totalsY + 55, { align: 'right' });
        
        // Print date
        doc.text(`Print Date: ${new Date().toLocaleString()}`, 15, totalsY + 65);
      }
    }
  });
  
  return doc;
};

export const downloadInvoicePDF = (invoice, settings) => {
  const doc = generateInvoicePDF(invoice, settings);
  doc.save(`Invoice_${invoice.invoiceNo}.pdf`);
};

export const printInvoice = (invoice, settings) => {
  const doc = generateInvoicePDF(invoice, settings);
  doc.autoPrint();
  window.open(doc.output('bloburl'), '_blank');
};