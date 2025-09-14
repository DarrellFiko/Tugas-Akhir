import { useState, useEffect } from "react";
import { Typography, Grid, Card, CardContent, Divider } from "@mui/material";
import Pengumuman from "../../components/classes/Pengumuman";

export default function HomePage() {
  const [pengumuman, setPengumuman] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const role = localStorage.getItem("role")

  const sendComment = (id, text, setText) => {
    if (!text.trim()) return;
    console.log("Pengumuman ID:", id, "Comment:", text);
    setText("");
  };

  useEffect(() => {
    const data = [];
    for (let i = 1; i <= 95; i++) {
      const hasComments = Math.random() > 0.5;

      const comments = hasComments
        ? Array.from({ length: 12 }, (_, idx) => ({
            from: idx % 2 === 0 ? "Fiko" : "No Name",
            text: `Komentar ${String.fromCharCode(65 + idx)} untuk pengumuman aaaaaaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaa aaa aaa ${i}`,
          }))
        : [];

      data.push({
        id: i,
        title: `Pengumuman ${i}`,
        detail: `Ini detail pengumuman yang ke-${i}`,
        comments,
        file: Math.random() > 0.5,
        from: "admin",
      });
    }
    setPengumuman(data);
  }, []);

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3 }}>Pengumuman</Typography>
      <Grid container spacing={2}>
        {/* Pengumuman */}
        <Grid item size={{ xs: 12 }}>
          <Pengumuman
            data={pengumuman}
            commentInputs={commentInputs}
            setCommentInputs={setCommentInputs}
            sendComment={sendComment}
            itemsPerPage={10}
          />
        </Grid>
      </Grid>
    </div>
  );
}
