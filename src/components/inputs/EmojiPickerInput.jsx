import { useState, useEffect } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
  Popover,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import EmojiPicker from "emoji-picker-react";

export default function EmojiPickerInput({ value, onChange, onSend }) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [pickerReady, setPickerReady] = useState(false);

  // preload emoji picker di background saat mount
  useEffect(() => {
    setPickerReady(true);
  }, []);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  const handleEmojiClick = (emoji) => {
    onChange((value || "") + emoji.emoji);
  };

  return (
    <>
      <TextField
        fullWidth
        size="small"
        placeholder="Tulis komentar..."
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value?.trim()) onSend();
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={handleOpen}>
                <EmojiEmotionsIcon />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                color="primary"
                onClick={() => {
                  if (value?.trim()) onSend();
                }}
              >
                <SendOutlinedIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Popover emoji picker */}
      {pickerReady && (
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <EmojiPicker
            theme={theme.palette.mode === "dark" ? "dark" : "light"}
            onEmojiClick={(emoji) => {
              handleEmojiClick(emoji);
            }}
            lazyLoadEmojis={true}
            searchDisabled={false}
            skinTonesDisabled={false}
          />
        </Popover>
      )}

      {/* Hidden preload supaya data emoji sudah diload sejak awal */}
      {pickerReady && (
        <div style={{ display: "none" }}>
          <EmojiPicker
            theme={theme.palette.mode === "dark" ? "dark" : "light"}
            lazyLoadEmojis={true}
          />
        </div>
      )}
    </>
  );
}
