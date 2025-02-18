"use client";

import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { 
  FiImage, FiLink, FiBold, FiItalic, FiList, 
  FiAlignLeft, FiAlignCenter, FiAlignRight, 
  FiType, FiCode, FiEye, FiEyeOff, FiPlus,
  FiHash, FiFileText, FiUpload
} from 'react-icons/fi';
import { uploadImage } from '@/lib/uploadImage';

interface PostData {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  status: 'draft' | 'published';
  seoTitle: string;
  seoDescription: string;
  slug: string;
}

interface BlockButton {
  icon: React.ElementType;
  label: string;
  action: (editor: Editor) => void;
}

const MenuBar = ({ editor, onImageUpload }: { editor: Editor | null, onImageUpload: () => void }) => {
  const [showBlockMenu, setShowBlockMenu] = useState(false);

  if (!editor) {
    return null;
  }

  const blocks: BlockButton[] = [
    {
      icon: FiHash,
      label: 'Heading 1',
      action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      icon: FiHash,
      label: 'Heading 2',
      action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: FiFileText,
      label: 'Paragraph',
      action: (editor) => editor.chain().focus().setParagraph().run(),
    },
    {
      icon: FiList,
      label: 'Bullet List',
      action: (editor) => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: FiCode,
      label: 'Code Block',
      action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    },
  ];

  return (
    <div className="border-b">
      <div className="p-2 flex gap-2 flex-wrap items-center border-b">
        <div className="relative">
          <button
            onClick={() => setShowBlockMenu(!showBlockMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
          >
            <FiPlus className="w-5 h-5" />
            Add Block
          </button>
          {showBlockMenu && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-50">
              {blocks.map((block, index) => (
                <button
                  key={index}
                  onClick={() => {
                    block.action(editor);
                    setShowBlockMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left"
                >
                  <block.icon className="w-5 h-5" />
                  {block.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="h-6 border-l mx-2" />
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
        >
          <FiBold className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
        >
          <FiItalic className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            const url = window.prompt('Enter the URL:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
        >
          <FiLink className="w-5 h-5" />
        </button>
        <div className="h-6 border-l mx-2" />
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
        >
          <FiAlignLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
        >
          <FiAlignCenter className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
        >
          <FiAlignRight className="w-5 h-5" />
        </button>
        <button
          onClick={onImageUpload}
          className="p-2 rounded hover:bg-gray-100"
        >
          <FiImage className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const Preview = ({ content, title }: { content: string; title: string }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">{title}</h1>
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function PostEditor() {
  const [isMounted, setIsMounted] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [post, setPost] = useState<PostData>({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    status: 'draft',
    seoTitle: '',
    seoDescription: '',
    slug: '',
  });

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Link.configure({
          openOnClick: false,
        }),
        Image.configure({
          HTMLAttributes: {
            class: 'max-w-full rounded-lg',
          },
        }),
        Placeholder.configure({
          placeholder: 'Start writing or press "/" for commands...',
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
      ],
      content: post.content,
      onUpdate: ({ editor }) => {
        setPost(prev => ({ ...prev, content: editor.getHTML() }));
      },
      editorProps: {
        attributes: {
          class: 'prose focus:outline-none max-w-none min-h-[300px] p-4'
        }
      },
      immediatelyRender: false
    },
    [isMounted]
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (editor && post.content !== editor.getHTML()) {
      editor.commands.setContent(post.content);
    }
  }, [editor, post.content]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      if (editor) {
        const { view } = editor;
        const { state } = view;
        const pos = state.selection.anchor;
        
        editor.chain().focus().insertContent({
          type: 'paragraph',
          content: [{ type: 'text', text: 'Uploading image...' }]
        }).run();

        const imageUrl = await uploadImage(file);
        
        editor.commands.setContent(editor.getHTML().replace('Uploading image...', ''));
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
      alert(errorMessage);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFeaturedImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const imageUrl = await uploadImage(file);
      setPost(prev => ({ ...prev, featuredImage: imageUrl }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload featured image';
      alert(errorMessage);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const renderFileInputs = () => (
    <div className="hidden">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
      />
      <input
        type="file"
        id="featured-image-input"
        onChange={handleFeaturedImageUpload}
        accept="image/*"
      />
    </div>
  );

  const handleSave = async (status: 'draft' | 'published' = 'draft') => {
    try {
      setIsSaving(true);
      
      if (status === 'published') {
        const requiredFields = {
          title: 'Title',
          content: 'Content',
          excerpt: 'Excerpt',
          featuredImage: 'Featured Image',
          seoTitle: 'SEO Title',
          seoDescription: 'SEO Description'
        };

        const missingFields = Object.entries(requiredFields)
          .filter(([key]) => !post[key as keyof PostData])
          .map(([_, label]) => label);

        if (missingFields.length > 0) {
          alert(`Please fill in the following required fields:\n- ${missingFields.join('\n- ')}`);
          return;
        }
      }

      if (!post.slug) {
        const slug = post.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        setPost(prev => ({ ...prev, slug }));
      }

      const updatedPost = { ...post, status };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save post');
      }

      setPost(data.post);

      alert(status === 'published' ? 'Post published successfully!' : 'Draft saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      alert(error instanceof Error ? error.message : 'Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <div className="w-full h-10 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="bg-white rounded-lg shadow-sm">
          <div className="h-[500px] bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {renderFileInputs()}
      
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Add title"
          value={post.title}
          onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
          className="text-3xl font-bold focus:outline-none w-full"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            {isPreview ? (
              <>
                <FiEyeOff className="w-5 h-5" />
                Exit Preview
              </>
            ) : (
              <>
                <FiEye className="w-5 h-5" />
                Preview
              </>
            )}
          </button>
          <button
            onClick={() => handleSave('draft')}
            disabled={isSaving}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving && post.status === 'draft' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800" />
                Saving...
              </>
            ) : (
              'Save Draft'
            )}
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving && post.status === 'published' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Publishing...
              </>
            ) : (
              'Publish'
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {isPreview ? (
          <Preview content={post.content} title={post.title} />
        ) : (
          <>
            {editor && <MenuBar editor={editor} onImageUpload={() => fileInputRef.current?.click()} />}
            <div className="p-4 min-h-[600px] prose max-w-none">
              <EditorContent editor={editor} />
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Document</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Permalink
              </label>
              <input
                type="text"
                value={post.slug}
                onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full border rounded-lg p-2"
                placeholder="enter-post-slug"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Excerpt
              </label>
              <textarea
                value={post.excerpt}
                onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                className="w-full border rounded-lg p-2"
                rows={3}
                placeholder="Write a short excerpt..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Featured Image</h3>
          <div 
            onClick={() => document.getElementById('featured-image-input')?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 relative"
          >
            {isUploading ? (
              <div className="space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500">Uploading...</p>
              </div>
            ) : post.featuredImage ? (
              <div className="relative group">
                <img
                  src={post.featuredImage}
                  alt="Featured"
                  className="max-h-40 mx-auto rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <FiUpload className="w-8 h-8 text-white" />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <FiImage className="w-8 h-8 mx-auto text-gray-400" />
                <p className="text-sm text-gray-500">
                  Click to upload featured image
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO Title
              </label>
              <input
                type="text"
                value={post.seoTitle}
                onChange={(e) => setPost(prev => ({ ...prev, seoTitle: e.target.value }))}
                className="w-full border rounded-lg p-2"
                placeholder="SEO optimized title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                value={post.seoDescription}
                onChange={(e) => setPost(prev => ({ ...prev, seoDescription: e.target.value }))}
                className="w-full border rounded-lg p-2"
                rows={3}
                placeholder="SEO meta description..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 