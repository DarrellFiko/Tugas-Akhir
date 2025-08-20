// utils/fileUtils.js
import readXlsFile from "read-excel-file";
import * as XLSX from "xlsx";

// Upload Excel file and validate headers
export const handleUploadFile = async (file, headers, onSuccess, onError) => {
  try {
    let itemsData = [];
    let headersData = [];

    const datas = await readXlsFile(file);
    headersData = datas[0];

    itemsData = datas.slice(1).map((row) => {
      const obj = {};
      datas[0].forEach((key, i) => {
        obj[key] = row[i];
      });
      return obj;
    });

    const headersValue = headers.map((header) => header.value);
    const headersEqual =
      headersData.length === headersValue.length &&
      headersData
        .slice()
        .sort()
        .every((v, i) => v === headersValue.slice().sort()[i]);

    if (headersEqual) {
      onSuccess && onSuccess(itemsData);
    } else {
      onError &&
        onError("Headers are not equal! Please check your file before upload.");
    }
  } catch (err) {
    onError && onError("Failed to read the file.");
  }
};

// Download data as Excel
export const handleDownloadFile = (items, fileName = "download") => {
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

