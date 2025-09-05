import { useState, useEffect } from "react";
import Pengumuman from "../Pengumuman";

export default function TabPengumuman() {
  const [loading, setLoading] = useState(false);
  const [pengumuman, setPengumuman] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});

  const sendComment = (id, text, setText) => {
    if (!text.trim()) return;
    console.log("Pengumuman ID:", id, "Comment:", text);
    setText("");
  };

  useEffect(() => {
    setLoading(true);
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
    setLoading(false)
  }, []);

  return (
    <Pengumuman
      title="Pengumuman Kelas"
      data={pengumuman}
      commentInputs={commentInputs}
      setCommentInputs={setCommentInputs}
      sendComment={sendComment}
      itemsPerPage={10}
    />
  );
}
