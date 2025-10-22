import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";

// Import service (like Pinia actions)
import {
  getAllBarang,
  uploadBarang,
  deleteBarang,
} from "../services/barangService";
import TableTemplate from "../components/tables/TableTemplate";
import { handleDownloadFileExcel } from "../utils/utils";

export default function BackendPage() {
  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(false);

  const headers = [
    { label: "ID Barang", field: "id_barang", sortable: true },
    { label: "Nama", field: "nama", sortable: true },
    { label: "Harga", field: "harga", sortable: true },
    { label: "Kategori", field: "kategori", sortable: true },
  ];

  // Methods
  const fetchBarang = async () => {
    setLoading(true);
    
    const data = await getAllBarang();
    setTimeout(() => {
      const withId = data.map((item, idx) => ({
        id: item.id_barang ?? idx,
        ...item,
      }));
      setBarang(withId);
      setLoading(false);
    }, 1000);

  };

  const handleUpload = async (items) => {
    await uploadBarang(items);
    fetchBarang();
  };

  const handleDownload = () => {
    const success = handleDownloadFileExcel(barang, "mydata");
    if (success) ToastSuccess.fire({ title: "Download Success!" });
    else ToastError.fire({ title: "Download Failed!" });
  };

  const handleDelete = async (ids) => {
    for (const id of ids) {
      await deleteBarang(id);
    }
    fetchBarang();
  };

  // Lifecycle
  useEffect(() => {
    fetchBarang();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Connect Backend
      </Typography>

      <TableTemplate
        isLoading={loading}
        columns={headers}
        rows={barang}
        title="Table Template"
        isCheckbox
        isUpload
        isDownload
        isDelete
        onDownload={handleDownload} 
        onUpload={handleUpload}
        onDelete={handleDelete}
      />
    </div>
  );
}
