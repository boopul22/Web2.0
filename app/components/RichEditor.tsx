'use client';

import { useEditor, EditorContent, BubbleMenu, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { useState, useCallback, useEffect, useMemo } from 'react'
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
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [editorError, setEditorError] = useState<string | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline'
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg'
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[200px] px-4 py-2'
      }
    }
  })

  useEffect(() => {
    setIsEditorReady(true)
  }, [])

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const handleError = useCallback((error: unknown, fallbackMessage: string) => {
    const errorMessage = error instanceof Error ? error.message : fallbackMessage
    setEditorError(errorMessage)
    console.error(errorMessage)
  }, [])

  const handleCommand = useCallback((command: () => void) => {
    if (!editor || editor.isDestroyed) return
    
    try {
      command()
      setEditorError(null)
    } catch (error) {
      handleError(error, 'Failed to execute command')
    }
  }, [editor, handleError])

  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor || editor.isDestroyed) return

    try {
      const url = await uploadImage(file)
      editor.chain().focus().setImage({ src: url }).run()
      setEditorError(null)
    } catch (error) {
      handleError(error, 'Failed to upload image')
    }
  }, [editor, handleError])

  const addLink = useCallback(() => {
    if (!editor || editor.isDestroyed || !linkUrl) return
    
    try {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setShowLinkInput(false)
      setEditorError(null)
    } catch (error) {
      handleError(error, 'Failed to add link')
    }
  }, [editor, linkUrl, handleError])

  if (!editor || !isEditorReady) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 text-gray-500">
        Loading editor...
      </div>
    )
  }

  return (
    <div className="relative border border-gray-200 rounded-lg">
      {editorError && (
        <div className="bg-red-50 text-red-500 p-2 text-sm border-b border-gray-200">
          {editorError}
        </div>
      )}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-2 flex flex-wrap gap-1 rounded-t-lg">
        <button
          onClick={() => handleCommand(() => editor.chain().focus().toggleBold().run())}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-100' : ''}`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => handleCommand(() => editor.chain().focus().toggleItalic().run())}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-100' : ''}`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => handleCommand(() => editor.chain().focus().toggleUnderline().run())}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-100' : ''}`}
          title="Underline"
        >
          <UnderlineIcon size={16} />
        </button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <button
          onClick={() => handleCommand(() => editor.chain().focus().toggleBulletList().run())}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-100' : ''}`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          onClick={() => handleCommand(() => editor.chain().focus().toggleOrderedList().run())}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-100' : ''}`}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <button
          onClick={() => handleCommand(() => editor.chain().focus().toggleHeading({ level: 1 }).run())}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-100' : ''}`}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          onClick={() => handleCommand(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-100' : ''}`}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          onClick={() => handleCommand(() => editor.chain().focus().toggleBlockquote().run())}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('blockquote') ? 'bg-gray-100' : ''}`}
          title="Quote"
        >
          <Quote size={16} />
        </button>
        <button
          onClick={() => handleCommand(() => editor.chain().focus().toggleCodeBlock().run())}
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
          onClick={() => handleCommand(() => editor.chain().focus().undo().run())}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          onClick={() => handleCommand(() => editor.chain().focus().redo().run())}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
          title="Redo"
        >
          <Redo size={16} />
        </button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <button
          onClick={() => handleCommand(() => setShowLinkInput(!showLinkInput))}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-100' : ''}`}
          title="Add Link"
        >
          <LinkIcon size={16} />
        </button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <button
          onClick={() => handleCommand(() => editor.chain().focus().setTextAlign('left').run())}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100' : ''}`}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          onClick={() => handleCommand(() => editor.chain().focus().setTextAlign('center').run())}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100' : ''}`}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          onClick={() => handleCommand(() => editor.chain().focus().setTextAlign('right').run())}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100' : ''}`}
          title="Align Right"
        >
          <AlignRight size={16} />
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
            onClick={() => handleCommand(() => editor.chain().focus().toggleBold().run())}
            className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-100' : ''}`}
          >
            <Bold size={14} />
          </button>
          <button
            onClick={() => handleCommand(() => editor.chain().focus().toggleItalic().run())}
            className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-100' : ''}`}
          >
            <Italic size={14} />
          </button>
          <button
            onClick={() => handleCommand(() => editor.chain().focus().toggleUnderline().run())}
            className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-100' : ''}`}
          >
            <UnderlineIcon size={14} />
          </button>
          <button
            onClick={() => handleCommand(() => setShowLinkInput(!showLinkInput))}
            className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-100' : ''}`}
          >
            <LinkIcon size={14} />
          </button>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />
    </div>
  )
}

export default RichEditor 