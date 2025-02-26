import React, { useState } from 'react';
import { Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react';
import type { TextOverlay } from '../types';

interface TextOverlayEditorProps {
  onAdd: (overlay: Omit<TextOverlay, 'id'>) => void;
}

export function TextOverlayEditor({ onAdd }: TextOverlayEditorProps) {
  const [text, setText] = useState('');
  const [font, setFont] = useState('Arial');
  const [size, setSize] = useState(24);
  const [color, setColor] = useState('#ffffff');
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [style, setStyle] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: 'center',
  });

  const handleAdd = () => {
    if (!text) return;

    onAdd({
      text,
      font,
      size,
      color,
      position,
      animation: {
        type: 'fade',
        duration: 1,
        parameters: {
          delay: 0,
          opacity: [0, 1],
        },
      },
    });

    setText('');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Enter text..."
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Font</label>
          <select
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Courier">Courier</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
          <input
            type="number"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-full p-2 border rounded-md"
            min="8"
            max="72"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full p-1 h-10 border rounded-md"
          />
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => setStyle(s => ({ ...s, bold: !s.bold }))}
          className={`p-2 rounded ${style.bold ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => setStyle(s => ({ ...s, italic: !s.italic }))}
          className={`p-2 rounded ${style.italic ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => setStyle(s => ({ ...s, underline: !s.underline }))}
          className={`p-2 rounded ${style.underline ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
        >
          <Underline className="w-4 h-4" />
        </button>
        <div className="border-l mx-2" />
        <button
          onClick={() => setStyle(s => ({ ...s, align: 'left' }))}
          className={`p-2 rounded ${style.align === 'left' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => setStyle(s => ({ ...s, align: 'center' }))}
          className={`p-2 rounded ${style.align === 'center' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          onClick={() => setStyle(s => ({ ...s, align: 'right' }))}
          className={`p-2 rounded ${style.align === 'right' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
        >
          <AlignRight className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={handleAdd}
        disabled={!text}
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add Text Overlay
      </button>
    </div>
  );
}