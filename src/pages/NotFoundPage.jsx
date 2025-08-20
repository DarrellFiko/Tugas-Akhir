import { Box } from "@mui/material";
import NotFoundPage from "../components/animations/NotFoundPage";

export default function HomePage() {
  return (
    <Box
      width="100%"
      height="100vh"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box width="70%">
        <NotFoundPage />
      </Box>
    </Box>
  );
}
