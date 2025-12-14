import * as XLSX from "xlsx";
import moment from "moment/min/moment-with-locales";
import imageCompression from "browser-image-compression";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

moment.locale("id");

// ====================== FORMAT TANGGAL ======================
export const formatDate = (date, format = "dddd, DD MMMM YYYY", language = "id") => {
  const dt = date instanceof Date ? date : new Date(date);
  return moment(dt).locale(language).format(format);
};

export const formatRelativeTime = (date) => {
  if (!date) return "";
  return moment(date).locale("id").fromNow();
};

// ====================== PARSE EXCEL / CSV ======================
export const handleUploadFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      if (!jsonData || jsonData.length === 0) {
        reject(new Error("File kosong atau format salah"));
        return;
      }

      const headers = Object.keys(jsonData[0]);
      const columns = headers.map((header) => ({
        field: header.toLowerCase().replace(/\s+/g, "_"),
        label: header,
        width: "150px",
      }));

      const rows = jsonData.map((row, index) => {
        const newRow = { id: index + 1 };
        headers.forEach((h) => {
          newRow[h.toLowerCase().replace(/\s+/g, "_")] = row[h];
        });
        return newRow;
      });

      resolve({ columns, rows });
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};

// ====================== DOWNLOAD EXCEL ======================
export const handleDownloadFileExcel = (items, fileName = "download") => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(items);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    return true;
  } catch (error) {
    return false;
  }
};

// ====================== PRINT ======================
export const handlePrint = (printRef) => {
  const printContent = printRef.current.innerHTML;
  const iframe = document.createElement("iframe");

  iframe.style.position = "absolute";
  iframe.style.width = "0px";
  iframe.style.height = "0px";
  iframe.style.border = "0";

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <html>
      <head>
        <title>Print</title>
        <style>
          @media print {
            body { -webkit-print-color-adjust: exact; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ccc; padding: 8px; }
          }
        </style>
      </head>
      <body>${printContent}</body>
    </html>
  `);
  doc.close();

  iframe.contentWindow.focus();
  iframe.contentWindow.print();

  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 1000);
};
