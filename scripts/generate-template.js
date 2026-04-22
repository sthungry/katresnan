/**
 * Script to generate the guest import Excel template.
 * Run: node scripts/generate-template.js
 */
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const outputDir = path.join(__dirname, '..', 'public', 'templates', 'guest');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Create workbook
const wb = XLSX.utils.book_new();

// Header row
const headers = ['Nama', 'No. WA / Link Grup', 'Email', 'Tipe', 'Jumlah Pax', 'Kategori'];

// Example data rows
const exampleData = [
  ['Budi Setiawan', '081234567890', 'budi@email.com', 'VIP', 2, 'Keluarga'],
  ['Siti Rahayu', '082198765432', 'siti@email.com', 'Reguler', 1, 'Teman'],
  ['Ahmad Fauzi', 'https://chat.whatsapp.com/XXXXX', '', 'Reguler', 3, 'Rekan Kerja'],
];

const data = [headers, ...exampleData];
const ws = XLSX.utils.aoa_to_sheet(data);

// Set column widths
ws['!cols'] = [
  { wch: 25 },  // A: Nama
  { wch: 30 },  // B: No. WA / Link Grup
  { wch: 25 },  // C: Email
  { wch: 12 },  // D: Tipe
  { wch: 12 },  // E: Jumlah Pax
  { wch: 15 },  // F: Kategori
];

XLSX.utils.book_append_sheet(wb, ws, 'Template Tamu');

// Write file
const outputPath = path.join(outputDir, 'Template_Tamu.xlsx');
XLSX.writeFile(wb, outputPath);
console.log('✅ Template generated:', outputPath);
