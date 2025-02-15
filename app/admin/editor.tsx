"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

// Define type for a content block
type Block = {
  id: string;
  type: 'text' | 'image';
  content: string; // For text, HTML content; for image, URL
};

export default function AdminEditor() {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: 'block-1', type: 'text', content: '' }
  ]);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  // Handle drag end event for reordering blocks
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newBlocks = Array.from(blocks);
    const [removed] = newBlocks.splice(result.source.index, 1);
    newBlocks.splice(result.destination.index, 0, removed);
    setBlocks(newBlocks);
  };

  // Function to add a new block
  const addBlock = (type: 'text' | 'image') => {
    const newBlock: Block = {
      id: `block-${new Date().getTime()}`,
      type,
      content: ''
    };
    setBlocks([...blocks, newBlock]);
  };

  // Update the content of a block
  const updateBlockContent = (id: string, content: string) => {
    setBlocks(blocks.map(block => block.id === id ? { ...block, content } : block));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Modern Admin Editor</h1>
      <div className="mb-4">
        <button 
          className={`px-4 py-2 mr-2 ${activeTab === 'editor' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveTab('editor')}
        >
          Editor
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
      </div>
      {activeTab === 'editor' ? (
        <div>
          <div className="mb-4">
            <button onClick={() => addBlock('text')} className="px-4 py-2 bg-green-600 text-white rounded mr-2">Add Text Block</button>
            <button onClick={() => addBlock('image')} className="px-4 py-2 bg-green-600 text-white rounded">Add Image Block</button>
          </div>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="blocks">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {blocks.map((block, index) => (
                    <Draggable key={block.id} draggableId={block.id} index={index}>
                      {(provided) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="border border-gray-300 rounded p-4 mb-4 bg-white shadow"
                        >
                          {block.type === 'text' ? (
                            <ReactQuill
                              value={block.content}
                              onChange={(content) => updateBlockContent(block.id, content)}
                              theme="snow"
                            />
                          ) : (
                            <div>
                              <input 
                                type="text" 
                                placeholder="Enter image URL" 
                                value={block.content}
                                onChange={(e) => updateBlockContent(block.id, e.target.value)} 
                                className="w-full border border-gray-300 p-2 rounded mb-2"
                              />
                              {block.content && <img src={block.content} alt="Block Image" className="mt-2 max-h-64 object-contain" />}
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      ) : (
        <div className="prose max-w-full">
          {blocks.map((block) => (
            <div key={block.id} className="mb-4">
              {block.type === 'text' ? (
                <div dangerouslySetInnerHTML={{ __html: block.content }} />
              ) : (
                block.content && <img src={block.content} alt="Block Image" className="max-w-full" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 