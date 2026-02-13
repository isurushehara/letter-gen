import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface Props {
  content: string;
  onChange: (value: string) => void;
}

export default function RichEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="bg-white p-4 rounded shadow">
      
      {/* Toolbar */}
      <div className="mb-4 space-x-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-3 py-1 border rounded"
        >
          Bold
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="px-3 py-1 border rounded"
        >
          Italic
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="px-3 py-1 border rounded"
        >
          H2
        </button>
      </div>

      {/* Editor Area */}
      <div className="border p-4 min-h-[400px] bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
