"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface ToolbarButton {
  label: string;
  command: string;
  attrs?: Record<string, unknown>;
  icon: string;
  separator?: boolean;
}

const TOOLBAR: ToolbarButton[] = [
  { label: "Bold", command: "bold", icon: "B" },
  { label: "Italic", command: "italic", icon: "I" },
  { label: "Strike", command: "strike", icon: "S" },
  { label: "Heading 2", command: "heading", attrs: { level: 2 }, icon: "H2", separator: true },
  { label: "Heading 3", command: "heading", attrs: { level: 3 }, icon: "H3" },
  { label: "Bullet List", command: "bulletList", icon: "•", separator: true },
  { label: "Ordered List", command: "orderedList", icon: "1." },
  { label: "Blockquote", command: "blockquote", icon: "❝", separator: true },
  { label: "Code Block", command: "codeBlock", icon: "</>" },
  { label: "Horizontal Rule", command: "horizontalRule", icon: "—" },
  { label: "Görsel Ekle", command: "image", icon: "🖼", separator: true },
];

export default function TiptapEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageTab, setImageTab] = useState<"url" | "upload">("url");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState(defaultValue || "");
  const [isDragging, setIsDragging] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Image.configure({ inline: false })],
    content: defaultValue || "",
    editorProps: {
      attributes: {
        class: "tiptap-content",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    const handler = () => setContent(editor.getHTML());

    editor.on("update", handler);
    handler();

    return () => {
      editor.off("update", handler);
    };
  }, [editor]);

  const insertImage = (src: string) => {
    if (!editor || !src.trim()) return;
    editor.chain().focus().setImage({ src: src.trim() }).run();
    setShowImageDialog(false);
    setImageUrl("");
  };

  const handleUrlSubmit = () => {
    insertImage(imageUrl);
  };

  const uploadAndInsert = async (file: File) => {
    setUploading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const ext = file.name.split(".").pop();
      const path = `inline/${user?.id ?? "anon"}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("recipe-images")
        .upload(path, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("recipe-images").getPublicUrl(path);

      insertImage(publicUrl);
    } catch {
      alert("Görsel yüklenirken hata oluştu.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadAndInsert(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    for (const file of files) {
      await uploadAndInsert(file);
    }
  };

  const handleToolbarClick = (btn: ToolbarButton) => {
    if (!editor) return;

    if (btn.command === "image") {
      setShowImageDialog((prev) => !prev);
      return;
    }

    const chain = editor.chain().focus();

    switch (btn.command) {
      case "bold":
        chain.toggleBold().run();
        break;
      case "italic":
        chain.toggleItalic().run();
        break;
      case "strike":
        chain.toggleStrike().run();
        break;
      case "heading":
        chain.toggleHeading({ level: btn.attrs?.level as 2 | 3 }).run();
        break;
      case "bulletList":
        chain.toggleBulletList().run();
        break;
      case "orderedList":
        chain.toggleOrderedList().run();
        break;
      case "blockquote":
        chain.toggleBlockquote().run();
        break;
      case "codeBlock":
        chain.toggleCodeBlock().run();
        break;
      case "horizontalRule":
        chain.setHorizontalRule().run();
        break;
    }
  };

  const isActive = (btn: ToolbarButton): boolean => {
    if (!editor) return false;
    if (btn.command === "image") return showImageDialog;
    if (btn.attrs) {
      return editor.isActive(btn.command, btn.attrs);
    }
    return editor.isActive(btn.command);
  };

  return (
    <div
      className={`relative border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-black focus-within:border-transparent ${isDragging ? "ring-2 ring-blue-400 border-blue-400" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-20 bg-blue-50/80 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="text-blue-600 font-medium text-sm flex items-center gap-2">
            <span className="text-lg">📥</span>
            Görseli buraya bırakın
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 bg-gray-50/50">
        {TOOLBAR.map((btn, i) => (
          <span key={btn.label} className="flex items-center">
            {btn.separator && i > 0 && (
              <span className="w-px h-5 bg-gray-200 mx-1.5" />
            )}
            <button
              type="button"
              onClick={() => handleToolbarClick(btn)}
              title={btn.label}
              className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                isActive(btn)
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-200"
              } ${
                btn.command === "bold" ? "font-bold" : ""
              } ${
                btn.command === "italic" ? "italic" : ""
              } ${
                btn.command === "strike" ? "line-through" : ""
              }`}
            >
              {btn.icon}
            </button>
          </span>
        ))}
      </div>

      {showImageDialog && (
        <div className="border-b border-gray-100 bg-gray-50 p-3">
          <div className="flex gap-4 mb-3">
            <button
              type="button"
              onClick={() => setImageTab("url")}
              className={`text-xs font-medium pb-1 transition-colors ${
                imageTab === "url"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              URL ile Ekle
            </button>
            <button
              type="button"
              onClick={() => setImageTab("upload")}
              className={`text-xs font-medium pb-1 transition-colors ${
                imageTab === "upload"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Dosya Yükle
            </button>
          </div>

          {imageTab === "url" ? (
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleUrlSubmit(); } }}
                placeholder="https://ornek.com/gorsel.jpg"
                className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                disabled={!imageUrl.trim()}
                className="px-3 py-1.5 text-xs font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40"
              >
                Ekle
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50 file:cursor-pointer"
              />
              {uploading && (
                <span className="text-xs text-gray-400">Yükleniyor...</span>
              )}
            </div>
          )}
        </div>
      )}

      <EditorContent
        editor={editor}
        className="tiptap-wrapper"
      />

      <input type="hidden" name={name} value={content} />
    </div>
  );
}
