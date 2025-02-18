"use client";

import { useState, useEffect } from 'react';
import { FiUpload, FiImage, FiFile, FiTrash2, FiSearch } from 'react-icons/fi';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  title: string;
  size: string;
  uploadedAt: string;
  metadata?: {
    width?: number;
    height?: number;
    contentType?: string;
  };
}

export default function MediaLibrary() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    try {
      setIsLoading(true);
      const { data: files, error } = await supabase
        .storage
        .from('blog-images')
        .list();

      if (error) {
        console.error('Error fetching media:', error);
        return;
      }

      const mediaData: MediaItem[] = await Promise.all(
        files.map(async (file) => {
          const { data: { publicUrl } } = supabase
            .storage
            .from('blog-images')
            .getPublicUrl(file.name);

          return {
            id: file.id,
            type: getFileType(file.metadata?.mimetype || ''),
            url: publicUrl,
            title: file.name,
            size: formatFileSize(file.metadata?.size || 0),
            uploadedAt: new Date(file.created_at).toISOString(),
            metadata: file.metadata
          };
        })
      );

      setMediaItems(mediaData);
    } catch (error) {
      console.error('Error processing media:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);
    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error } = await supabase
          .storage
          .from('blog-images')
          .upload(fileName, file);

        if (error) {
          console.error('Error uploading file:', error);
        }
      }
      
      await fetchMediaItems(); // Refresh the media list
    } catch (error) {
      console.error('Error in upload process:', error);
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleDeleteItems = async () => {
    if (!selectedItems.length) return;

    try {
      const itemsToDelete = mediaItems
        .filter(item => selectedItems.includes(item.id))
        .map(item => item.title);

      const { error } = await supabase
        .storage
        .from('blog-images')
        .remove(itemsToDelete);

      if (error) {
        console.error('Error deleting files:', error);
        return;
      }

      await fetchMediaItems(); // Refresh the media list
      setSelectedItems([]); // Clear selection
    } catch (error) {
      console.error('Error in delete process:', error);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const getFileType = (mimetype: string): MediaItem['type'] => {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    return 'document';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Media Library</h1>
          <p className="text-gray-600">Manage your media files</p>
        </div>
        <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 cursor-pointer">
          <FiUpload className="w-5 h-5" />
          Upload New
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,video/*,application/pdf"
          />
        </label>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Type:</label>
            <select className="border rounded-lg px-3 py-2">
              <option value="all">All Media</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>
          </div>
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search media..."
                className="w-full border rounded-lg pl-10 pr-3 py-2"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mediaItems.map((item) => (
              <div
                key={item.id}
                className={`group relative rounded-lg border-2 cursor-pointer
                  ${selectedItems.includes(item.id)
                    ? 'border-blue-500'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
                onClick={() => toggleSelection(item.id)}
              >
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                  {item.type === 'image' ? (
                    <div className="relative w-full h-40">
                      <Image
                        src={item.url}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40">
                      <FiFile className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500">{item.size}</p>
                </div>
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                    <FiImage className="w-5 h-5 text-gray-700" />
                  </button>
                  <button 
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItems([item.id]);
                      handleDeleteItems();
                    }}
                  >
                    <FiTrash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Bar - Selected Items */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t shadow-lg p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedItems.length} items selected
            </div>
            <div className="space-x-2">
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={handleDeleteItems}
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress Indicator */}
      {uploadingFiles && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t shadow-lg p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Uploading files...
            </div>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        </div>
      )}
    </div>
  );
} 