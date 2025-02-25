'use client';

import { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { uploadImage } from '../lib/uploadImage';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
} from 'lucide-react';

interface BlogEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function BlogEditor({ content, onChange }: BlogEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
      Placeholder.configure({
        placeholder: 'Write your blog post here...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return;
    
    try {
      setIsUploading(true);
      setUploadError(null);
      
      const url = await uploadImage(file);
      
      // Insert image at current cursor position
      editor
        .chain()
        .focus()
        .setImage({ src: url, alt: file.name })
        .run();
    } catch (error) {
      console.error('Failed to upload image:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    
    // cancelled
    if (url === null) return;
    
    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    // update link
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run();
  }, [editor]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
        {/* Text formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
          title="Underline"
        >
          <UnderlineIcon size={16} />
        </button>
        <button
          onClick={setLink}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
          title="Link"
        >
          <LinkIcon size={16} />
        </button>
        
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        
        {/* Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
          title="Align left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
          title="Align center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
          title="Align right"
        >
          <AlignRight size={16} />
        </button>
        
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        
        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          title="Bullet list"
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
          title="Numbered list"
        >
          <ListOrdered size={16} />
        </button>
        
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        
        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
          title="Quote"
        >
          <Quote size={16} />
        </button>
        
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        
        {/* Image upload */}
        <div className="relative">
          <input
            type="file"
            id="image-upload"
            className="absolute inset-0 opacity-0 w-full cursor-pointer"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleImageUpload(file);
              }
              e.target.value = ''; // Reset the input
            }}
            disabled={isUploading}
          />
          <button
            className={`p-2 rounded hover:bg-gray-200 ${isUploading ? 'opacity-50' : ''}`}
            title="Upload image"
          >
            <ImageIcon size={16} />
          </button>
        </div>
      </div>
      
      {uploadError && (
        <div className="bg-red-100 text-red-700 p-2 text-sm">
          {uploadError}
        </div>
      )}
      
      <div className="p-4 min-h-[300px]">
        <EditorContent editor={editor} className="prose max-w-none min-h-[300px]" />
      </div>
    </div>
  );
} 