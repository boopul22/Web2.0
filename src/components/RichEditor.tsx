import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { useState, useCallback } from 'react'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Quote,
  Code,
  Undo,
  Redo,
} from 'lucide-react'
import { uploadImage } from '@/lib/uploadImage'

interface RichEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

const RichEditor = ({ content, onChange, placeholder = 'Start writing...' }: RichEditorProps) => {
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      const url = await uploadImage(file)
      editor?.chain().focus().setImage({ src: url }).run()
    } catch (error) {
      console.error('Failed to upload image:', error)
    }
  }, [editor])

  if (!editor) {
    return null
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }

  return (
    <div className="relative border border-gray-200 rounded-lg">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-2 flex flex-wrap gap-1 rounded-t-lg">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-100' : ''}`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-100' : ''}`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-100' : ''}`}
          title="Underline"
        >
          <UnderlineIcon size={16} />
        </button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <button
          onClick={() => setShowLinkInput(!showLinkInput)}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-100' : ''}`}
          title="Add Link"
        >
          <LinkIcon size={16} />
        </button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100' : ''}`}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100' : ''}`}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100' : ''}`}
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-100' : ''}`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-100' : ''}`}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-100' : ''}`}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-100' : ''}`}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('blockquote') ? 'bg-gray-100' : ''}`}
          title="Quote"
        >
          <Quote size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('codeBlock') ? 'bg-gray-100' : ''}`}
          title="Code Block"
        >
          <Code size={16} />
        </button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <label className="p-2 rounded hover:bg-gray-100 cursor-pointer" title="Upload Image">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                handleImageUpload(file)
              }
            }}
          />
          <ImageIcon size={16} />
        </label>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>

      {showLinkInput && (
        <div className="flex items-center gap-2 p-2 bg-gray-50 border-b border-gray-200">
          <input
            type="url"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1 px-2 py-1 border border-gray-300 rounded"
          />
          <button
            onClick={addLink}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
          <button
            onClick={() => {
              setShowLinkInput(false)
              setLinkUrl('')
            }}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      )}

      {editor && (
        <BubbleMenu
          className="bg-white shadow-lg border border-gray-200 rounded-lg p-1 flex gap-1"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-100' : ''}`}
          >
            <Bold size={14} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-100' : ''}`}
          >
            <Italic size={14} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-100' : ''}`}
          >
            <UnderlineIcon size={14} />
          </button>
          <button
            onClick={() => setShowLinkInput(!showLinkInput)}
            className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-100' : ''}`}
          >
            <LinkIcon size={14} />
          </button>
        </BubbleMenu>
      )}

      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[300px] focus:outline-none"
      />
    </div>
  )
}

export default RichEditor 