import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Popover,
  Menu,
  MenuItem,
  useTheme,
  Tooltip,
} from "@mui/material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import CodeIcon from "@mui/icons-material/Code";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import LinkIcon from "@mui/icons-material/Link";
import TitleIcon from "@mui/icons-material/Title";
import EmojiPicker from "emoji-picker-react";
import PaletteIcon from "@mui/icons-material/Palette";
import FunctionsIcon from "@mui/icons-material/Functions";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";

// highlight.js setup
import { lowlight } from "lowlight/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import "highlight.js/styles/github-dark.css";

lowlight.registerLanguage("html", html);
lowlight.registerLanguage("javascript", javascript);
lowlight.registerLanguage("css", css);

export default function TextEditor({ value, onChange, disabled = false }) {
  const theme = useTheme();
  const [emojiAnchor, setEmojiAnchor] = useState(null);
  const [colorAnchor, setColorAnchor] = useState(null);
  const [headingAnchor, setHeadingAnchor] = useState(null);
  const [symbolAnchor, setSymbolAnchor] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Link.configure({ openOnClick: false }),
      TextStyle,
      Color,
      Highlight,
      CodeBlockLowlight.configure({ lowlight }),
      Placeholder.configure({
        placeholder: "Tulis sesuatu di sini...",
      }),
    ],
    content: value || "",
    editable: !disabled,
    editorProps: {
      attributes: {
        class:
          "focus:outline-none min-h-[180px] w-full text-base transition-all",
      },
    },
    onUpdate: ({ editor }) => {
      onChange && onChange(editor.getHTML());
    },
  });

  const handleEmojiClick = (emojiData) => {
    editor?.commands.insertContent(emojiData.emoji);
  };

  const addLink = () => {
    const url = window.prompt("Masukkan URL:");
    if (url)
      editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleSetColor = (color) => {
    editor?.chain().focus().setColor(color).run();
  };

  const handleSetHeading = (level) => {
    editor?.chain().focus().toggleHeading({ level }).run();
  };

  const insertSymbol = (symbol) => {
    editor?.chain().focus().insertContent(symbol).run();
    setSymbolAnchor(null);
  };

  useEffect(() => {
    if (editor && value === "") {
      editor.commands.clearContent();
      editor.commands.focus();
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: theme.palette.divider,
        borderRadius: 2,
        overflow: "hidden",
        backgroundColor: "transparent",
        backdropFilter: "blur(4px)",
        boxShadow:
          theme.palette.mode === "dark" ? "0 0 8px #0005" : "0 2px 8px #0001",
      }}
    >
      {/* === TOOLBAR === */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 0.5,
          p: 1,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(40,40,40,0.8)"
              : "rgba(250,250,250,0.8)",
          borderBottom: "1px solid",
          borderColor: theme.palette.divider,
          backdropFilter: "blur(6px)",
        }}
      >
        <Tooltip title="Heading">
          <IconButton
            size="small"
            disabled={disabled}
            onClick={(e) => setHeadingAnchor(e.currentTarget)}
          >
            <TitleIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Bold">
          <IconButton
            size="small"
            disabled={disabled}
            color={editor.isActive("bold") ? "primary" : "default"}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <FormatBoldIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Italic">
          <IconButton
            size="small"
            disabled={disabled}
            color={editor.isActive("italic") ? "primary" : "default"}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <FormatItalicIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Underline">
          <IconButton
            size="small"
            disabled={disabled}
            color={editor.isActive("underline") ? "primary" : "default"}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <FormatUnderlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Strikethrough">
          <IconButton
            size="small"
            disabled={disabled}
            color={editor.isActive("strike") ? "primary" : "default"}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <StrikethroughSIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Code Inline">
          <IconButton
            size="small"
            disabled={disabled}
            color={editor.isActive("code") ? "primary" : "default"}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <CodeIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Bullet List">
          <IconButton
            size="small"
            disabled={disabled}
            color={editor.isActive("bulletList") ? "primary" : "default"}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <FormatListBulletedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Numbered List">
          <IconButton
            size="small"
            disabled={disabled}
            color={editor.isActive("orderedList") ? "primary" : "default"}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <FormatListNumberedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Insert Link">
          <IconButton size="small" disabled={disabled} onClick={addLink}>
            <LinkIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Text Color">
          <IconButton size="small" disabled={disabled} onClick={(e) => setColorAnchor(e.currentTarget)}>
            <PaletteIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Emoji">
          <IconButton size="small" disabled={disabled} onClick={(e) => setEmojiAnchor(e.currentTarget)}>
            <EmojiEmotionsIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Simbol">
          <IconButton size="small" disabled={disabled} onClick={(e) => setSymbolAnchor(e.currentTarget)}>
            <FunctionsIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* === CONTENT === */}
      <Box
        sx={{
          m: 2,
          backgroundColor: "transparent",
          "& .tiptap": {
            width: "100%",
            minHeight: "160px",
            fontSize: "1rem",
            margin: 0,
            padding: 0,
            color:
              theme.palette.mode === "dark"
                ? theme.palette.grey[100]
                : theme.palette.text.primary,
            outline: "none",
          },
        }}
      >
        <EditorContent editor={editor} className="tiptap" />
      </Box>

      {/* === Menus & Popover === */}
      <Menu
        anchorEl={headingAnchor}
        open={Boolean(headingAnchor)}
        onClose={() => setHeadingAnchor(null)}
      >
        {[1, 2, 3].map((lvl) => (
          <MenuItem
            key={lvl}
            onClick={() => {
              handleSetHeading(lvl);
              setHeadingAnchor(null);
            }}
          >
            Heading {lvl}
          </MenuItem>
        ))}
      </Menu>

      {/* === SYMBOL PICKER === */}
      <Popover
        open={Boolean(symbolAnchor)}
        anchorEl={symbolAnchor}
        onClose={() => setSymbolAnchor(null)}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 1, maxWidth: 320 }}>
          <Section title="Operator Dasar" symbols={["+", "−", "×", "÷", "=", "≠", "<", ">", "≤", "≥", "±", "∓", "√", "∛", "∜"]} onSelect={insertSymbol} />
          <Section title="Pangkat & Indeks" symbols={["²", "³", "⁴", "⁵", "₁", "₂", "₃", "₄", "₅"]} onSelect={insertSymbol} />
          <Section title="Simbol Matematika" symbols={["∞", "∑", "∏", "∫", "∂", "∇", "≈", "≡", "≜", "≅"]} onSelect={insertSymbol} />
          <Section title="Huruf Yunani" symbols={["α","β","γ","δ","ε","θ","λ","μ","π","ρ","σ","τ","φ","χ","ψ","ω"]} onSelect={insertSymbol} />
          <Section title="Panah" symbols={["→","←","↑","↓","↔","⇒","⇐","⇑","⇓"]} onSelect={insertSymbol} />
        </Box>
      </Popover>

      {/* === COLOR PICKER === */}
      <Menu
        anchorEl={colorAnchor}
        open={Boolean(colorAnchor)}
        onClose={() => setColorAnchor(null)}
      >
        <Box sx={{ display: "flex", p: 1, gap: 1 }}>
          {["#000000", "#e91e63", "#3f51b5", "#4caf50", "#ff9800", "#ffffff"].map(
            (color) => (
              <Box
                key={color}
                onClick={() => {
                  handleSetColor(color);
                  setColorAnchor(null);
                }}
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  bgcolor: color,
                  border: "1px solid #ccc",
                  cursor: "pointer",
                }}
              />
            )
          )}
        </Box>
      </Menu>

      {/* === EMOJI PICKER === */}
      <Popover
        open={Boolean(emojiAnchor)}
        anchorEl={emojiAnchor}
        onClose={() => setEmojiAnchor(null)}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          theme={theme.palette.mode === "dark" ? "dark" : "light"}
        />
      </Popover>
    </Box>
  );
}

/* Komponen kecil untuk kategori simbol */
function Section({ title, symbols, onSelect }) {
  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ fontSize: "0.8rem", opacity: 0.6, mb: 0.5 }}>{title}</Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {symbols.map((s) => (
          <Box
            key={s}
            onClick={() => onSelect(s)}
            sx={{
              cursor: "pointer",
              p: 1,
              fontSize: "1.2rem",
              textAlign: "center",
              width: "2rem",
              borderRadius: "6px",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            {s}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
