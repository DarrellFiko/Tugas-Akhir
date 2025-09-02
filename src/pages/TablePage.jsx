import React from "react";
import TableTemplate from "../components/tables/TableTemplate";
import { Box, Typography } from "@mui/material";
import { 
  PopupCreate,
  PopupDelete,
  ToastSuccess,
  ToastError,
} from "../composables/sweetalert";
import { handleDownloadFile, handleUploadFile } from "../utils/utils";

export default function TablePage() {
  const columns = [
    { field: "id", label: "ID", width: 80, sortable: true },
    { field: "name", label: "Name", width: 150, sortable: true, align: "center" },
    { field: "email", label: "Email", width: 250 },
    { field: "phone", label: "Phone", width: 150 },
  ];

  const rows = [
    { id: 1, name: "Alice", email: "alice@example.com", phone: "1234567890" },
    { id: 3, name: "Charlie", email: "charlie@example.com", phone: "1234567890" },
    { id: 4, name: "David", email: "david@example.com", phone: "1234567890" },
    { id: 2, name: "Bob", email: "bob@example.com", phone: "1234567890" },
    { id: 6, name: "Frank", email: "frank@example.com", phone: "1234567890" },
    { id: 5, name: "Eve", email: "eve@example.com", phone: "1234567890" },
  ];

  const handleCreate = () => {
    PopupCreate.fire();
  };
  const handleUpdate = (selectedIds) => {
    console.log("Edited rows with IDs:", selectedIds);
  };
  const handleDelete = (selectedIds) => {
    console.log("Delete rows with IDs:", selectedIds);
    PopupDelete.fire();
  };
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    await handleUploadFile(
      file,
      columns,
      (itemsData) => {
        setRows(itemsData); // replace with uploaded rows
        ToastSuccess.fire({ title: "Data uploaded successfully!" });
      },
      (errorMsg) => {
        ToastError.fire({ title: errorMsg });
      }
    );

    // reset input value
    event.target.value = "";
  };

  const handleDownload = () => {
    const success = handleDownloadFile(rows, "mydata");
    if (success) ToastSuccess.fire({ title: "Download Success!" });
    else ToastError.fire({ title: "Download Failed!" });
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Table Pages
      </Typography>

      <Box sx={{ width: "100%" }}>
        <TableTemplate
          title="Example Table"
          columns={columns}
          rows={rows}
          isCheckbox      
          initialRowsPerPage={5} 
          isDownload
          isUpload
          isUpdate
          isDelete
          onCreate={handleCreate} 
          onUpdate={handleUpdate} 
          onDelete={handleDelete} 
          onUpload={handleUpload} 
          onDownload={handleDownload} 
        />
      </Box>
    </div>
  );
}
