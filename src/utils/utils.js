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

// ====================== COMPRESS FILE (UNIVERSAL) ======================
/**
 * Compress berbagai jenis file sebelum upload
 * - Gambar (jpg, jpeg, png, webp)
 * - PDF
 * - Word (.doc, .docx)
 * - PowerPoint (.ppt, .pptx)
 */
export const compressFile = async (file) => {
  if (!file) return null;

  const ext = file.name.split(".").pop().toLowerCase();

  try {
    // === Kompres GAMBAR ===
    if (["jpg", "jpeg", "png", "webp"].includes(ext)) {
      const options = {
        maxSizeMB: 1, // maksimal 1MB
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedBlob = await imageCompression(file, options);
      const compressedFile = new File([compressedBlob], file.name, {
        type: compressedBlob.type,
        lastModified: Date.now(),
      });
      return compressedFile;
    }

    // === Kompres PDF ===
    if (ext === "pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Buat dokumen baru dan salin halaman
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => newPdf.addPage(page));

      // Kompres hasil PDF
      const compressedBytes = await newPdf.save({ useObjectStreams: true });
      const compressedFile = new File([compressedBytes], file.name, {
        type: "application/pdf",
        lastModified: Date.now(),
      });
      return compressedFile;
    }

    // === Kompres FILE DOKUMEN (Word, PPT) ===
    if (["doc", "docx", "ppt", "pptx"].includes(ext)) {
      const arrayBuffer = await file.arrayBuffer();

      // Kompres dengan zip (lossless, efektif jika file punya gambar besar)
      const zip = new JSZip();
      zip.file(file.name, arrayBuffer);

      const compressedBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 9 },
      });

      const compressedFile = new File([compressedBlob], file.name, {
        type: file.type || "application/octet-stream",
        lastModified: Date.now(),
      });
      return compressedFile;
    }

    // === File lain → langsung dikembalikan ===
    return file;
  } catch (err) {
    console.error("Gagal compress file:", err);
    return file;
  }
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
