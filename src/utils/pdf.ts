import { jsPDF } from 'jspdf';

export const generatePDF = (text: string): void => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Prescription Details', 20, 20);
  
  // Add timestamp
  const date = new Date();
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${date.toLocaleString()}`, 20, 30);
  
  // Add extracted text
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  // Split text into lines and add them to the PDF
  const textLines = doc.splitTextToSize(text, 170);
  doc.text(textLines, 20, 40);
  
  // Save the PDF with a filename
  doc.save('prescription_text.pdf');
};