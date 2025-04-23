import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

export const exportToPDF = (teamData) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('Team Analytics Report', 15, 20);
  
  // Set up table header
  doc.setFontSize(12);
  doc.setTextColor(40, 53, 147); // Dark blue color
  const headers = ['Name', 'Role', 'Rating', 'Joining Date'];
  let yPos = 40;
  const cellWidth = 45; // Increased width since we removed one column
  
  // Draw headers
  headers.forEach((header, i) => {
    doc.text(header, 15 + (i * cellWidth), yPos);
  });
  
  // Draw line under headers
  doc.setDrawColor(63, 81, 181);
  doc.line(15, yPos + 2, 190, yPos + 2);
  
  // Add team member data
  doc.setTextColor(0);
  doc.setFontSize(10);
  teamData.forEach((member, index) => {
    yPos = 50 + (index * 10);
    
    // Add new page if content exceeds page height
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.text(member.name.substring(0, 15), 15, yPos);
    doc.text(member.role.substring(0, 15), 15 + cellWidth, yPos);
    doc.text(member.rating?.toString() || 'N/A', 15 + cellWidth * 2, yPos);
    doc.text(member.joiningDate || 'N/A', 15 + cellWidth * 3, yPos);
  });
  
  doc.save('team-analytics-report.pdf');
};

export const exportToCSV = (teamData) => {
  // Prepare data for CSV
  const csvData = teamData.map(member => ({
    Name: member.name,
    Email: member.email,
    Role: member.role,
    Skills: member.skills,
    Rating: member.rating,
    'Joining Date': member.joiningDate,
    Address: member.address,
    Nickname: member.nickname,
    'Fun Fact': member.funFact
  }));
  
  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'team-analytics-report.csv');
};