import { Box, Button, Grid, Typography } from "@mui/material";
import TableTemplate from "../../components/tables/TableTemplate";
import { useRef } from "react";
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import { handlePrint } from "../../utils/utils";

export default function JadwalPage() {
  // States
  const printRef = useRef();

  const columns = [
    { field: "jam", label: "Jam", width: "auto" },
    { field: "pelajaran", label: "Pelajaran", width: "170px", },
    { field: "pengajar", label: "Pengajar", width: "230px" },
  ];

  const rows = [
    { jam: "08:00 - 09:00", pelajaran: "Matematikaaaaaaaaaaaaaaaaaaaa", pengajar: "Darrell Fiko Alexander Darrell Fiko Alexander" },
    { jam: "08:00 - 10:00", pelajaran: "Matematika", pengajar: "Darrell Fiko Alexander" },
    { jam: "08:00 - 09:00", pelajaran: "Matematika", pengajar: "Darrell Fiko Alexander" },
    { jam: "08:00 - 09:00", pelajaran: "Matematika", pengajar: "Darrell Fiko Alexander" },
    { jam: "08:00 - 09:00", pelajaran: "Matematika", pengajar: "Darrell Fiko Alexander" },
    { jam: "08:00 - 09:00", pelajaran: "Matematika", pengajar: "Darrell Fiko Alexander" },
    { jam: "08:00 - 09:00", pelajaran: "Matematikaaaaaaaaaaaaaaaaaaaa", pengajar: "Darrell Fiko Alexander Darrell Fiko Alexander" },
    { jam: "08:00 - 10:00", pelajaran: "Matematika", pengajar: "Darrell Fiko Alexander" },
    { jam: "08:00 - 09:00", pelajaran: "Matematika", pengajar: "Darrell Fiko Alexander" },
    { jam: "08:00 - 09:00", pelajaran: "Matematika", pengajar: "Darrell Fiko Alexander" },
    { jam: "08:00 - 09:00", pelajaran: "Matematika", pengajar: "Darrell Fiko Alexander" },
    { jam: "08:00 - 09:00", pelajaran: "Matematika", pengajar: "Darrell Fiko Alexander" },
  ];

  return <>

    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Jadwal Pelajaran
      </Typography>

      {/* Print Button */}
      <Button variant="contained" color="primary" endIcon={ <PrintOutlinedIcon /> } onClick={ () => handlePrint(printRef) } sx={{ mb: 2 }}>
        Print Jadwal
      </Button>
    </Box>

    <Box ref={printRef}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TableTemplate 
            key={"Senin"}
            title="Senin"
            columns={ columns }
            rows={ rows }
            initialRowsPerPage={ 100 } 
            tableHeight={ 400 }
            isCheckbox={ false }
            isUpdate={ false }
            isDelete={ false }
            isUpload={ false }
            isCreate={ false }
            isDownload={ false }
            isPagination={ false }
            hideToolbar
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TableTemplate 
            key={"Selasa"}
            title="Selasa"
            columns={ columns }
            initialRowsPerPage={ 100 } 
            tableHeight={ 400 }
            isCheckbox={ false }
            isUpdate={ false }
            isDelete={ false }
            isUpload={ false }
            isCreate={ false }
            isDownload={ false }
            isPagination={ false }
            hideToolbar
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TableTemplate
            key={"Rabu"} 
            title="Rabu"
           columns={ columns }
            rows={ rows }
            initialRowsPerPage={ 100 } 
            tableHeight={ 400 }
            isCheckbox={ false }
            isUpdate={ false }
            isDelete={ false }
            isUpload={ false }
            isCreate={ false }
            isDownload={ false }
            isPagination={ false }
            hideToolbar
          />
        </Grid>
      </Grid>
    </Box>
  </>
}