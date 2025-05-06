import { jsPDF } from 'jspdf';
import { Medication } from '../types';
import 'jspdf-autotable';

interface ExtendedJsPDF extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export const generatePDF = (text: string, medications?: Medication[]): void => {
  const doc = new jsPDF() as ExtendedJsPDF;
  
  // Add title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Prescription Details', 20, 20);
  
  // Add timestamp
  const date = new Date();
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${date.toLocaleString()}`, 20, 30);
  
  let yPosition = 40;
  
  // If we have structured medication data, display it in a table
  if (medications && medications.length > 0) {
    // Add medications title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Prescribed Medications', 20, yPosition);
    yPosition += 10;
    
    // Create table headers and rows
    const tableColumn = ["Medicine Name", "Doses/Day", "Duration", "Total Quantity"];
    const tableRows = medications.map(med => [
      med.name,
      med.dosesPerDay,
      med.duration,
      med.totalQuantity
    ]);
    
    // Add medication table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: yPosition,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
        3: { cellWidth: 40 }
      },
      styles: { overflow: 'linebreak', cellPadding: 4 },
      margin: { top: 10 }
    });
    
    // Update position after table
    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Add raw text title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Full Prescription Text', 20, yPosition);
  yPosition += 10;
  
  // Add extracted text
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  // Split text into lines and add them to the PDF
  const textLines = doc.splitTextToSize(text, 170);
  doc.text(textLines, 20, yPosition);
  
  // Save the PDF with a filename
  doc.save('prescription_details.pdf');
};