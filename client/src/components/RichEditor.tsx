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
    <div className="letter-editor-wrapper">
      
      {/* Toolbar - Modern Bar Design */}
      <div className="flex items-center justify-end gap-1 p-2 bg-gray-100 border border-gray-300 rounded-t-lg border-b-0">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`w-9 h-9 flex items-center justify-center rounded transition-all ${
            editor.isActive('bold')
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
          }`}
          title="Bold (Ctrl+B)"
        >
          <span className="font-bold text-lg">B</span>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`w-9 h-9 flex items-center justify-center rounded transition-all ${
            editor.isActive('italic')
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
          }`}
          title="Italic (Ctrl+I)"
        >
          <span className="italic text-lg font-serif">I</span>
        </button>

        

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`w-9 h-9 flex items-center justify-center rounded transition-all ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
          }`}
          title="Heading 2"
        >
          <span className="font-bold text-sm">H2</span>
        </button>
      </div>

      {/* Editor Area */}
      <div className="border border-gray-300 p-4 min-h-[400px] bg-white rounded-b-lg letter-editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
