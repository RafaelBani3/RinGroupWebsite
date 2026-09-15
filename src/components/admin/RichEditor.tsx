'use client';

import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Eye,
  Edit3,
} from 'lucide-react';
import sanitizeHtml from 'sanitize-html';

interface RichEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export function RichEditor({ value, onChange }: RichEditorProps) {
  const [tab, setTab] = useState<'write' | 'preview'>('write');

  const insertTag = (open: string, close: string) => {
    const textarea = document.getElementById('rich-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const replacement = `${open}${selectedText || 'Text'}${close}`;

    const newValue =
      textarea.value.substring(0, start) + replacement + textarea.value.substring(end);

    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + open.length, start + open.length + (selectedText.length || 4));
    }, 50);
  };

  const cleanPreview = sanitizeHtml(value, {
    allowedTags: ['p', 'b', 'i', 'em', 'strong', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'hr', 'a'],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
    },
  });

  return (
    <div className="border border-[#2B2B2B] rounded-lg overflow-hidden bg-[#111]">
      {/* Toolbar */}
      <div className="p-2 bg-[#1A1A1A] border-b border-[#2B2B2B] flex flex-wrap items-center justify-between gap-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => insertTag('<h2>', '</h2>')}
            title="Heading 2"
            className="p-1.5 rounded hover:bg-[#2A2A2A] text-neutral-300 hover:text-white"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<h3>', '</h3>')}
            title="Heading 3"
            className="p-1.5 rounded hover:bg-[#2A2A2A] text-neutral-300 hover:text-white"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-[#333] mx-1" />
          <button
            type="button"
            onClick={() => insertTag('<strong>', '</strong>')}
            title="Bold"
            className="p-1.5 rounded hover:bg-[#2A2A2A] text-neutral-300 hover:text-white"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<em>', '</em>')}
            title="Italic"
            className="p-1.5 rounded hover:bg-[#2A2A2A] text-neutral-300 hover:text-white"
          >
            <Italic className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-[#333] mx-1" />
          <button
            type="button"
            onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')}
            title="Bullet List"
            className="p-1.5 rounded hover:bg-[#2A2A2A] text-neutral-300 hover:text-white"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<ol>\n  <li>', '</li>\n</ol>')}
            title="Numbered List"
            className="p-1.5 rounded hover:bg-[#2A2A2A] text-neutral-300 hover:text-white"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<blockquote>', '</blockquote>')}
            title="Quote"
            className="p-1.5 rounded hover:bg-[#2A2A2A] text-neutral-300 hover:text-white"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        {/* Write / Preview Mode Toggle */}
        <div className="flex items-center gap-1 bg-[#141414] p-0.5 rounded border border-[#2B2B2B]">
          <button
            type="button"
            onClick={() => setTab('write')}
            className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 ${
              tab === 'write' ? 'bg-[#2B2B2B] text-white font-medium' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 ${
              tab === 'preview' ? 'bg-[#2B2B2B] text-[#B69B63] font-medium' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {tab === 'write' ? (
        <textarea
          id="rich-editor-textarea"
          rows={12}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="<p>Write or paste your article content here...</p>"
          className="w-full bg-[#111] p-4 text-neutral-200 text-sm outline-none font-mono resize-y"
        />
      ) : (
        <div
          className="p-6 min-h-[300px] prose prose-invert max-w-none text-neutral-200 text-sm space-y-3 bg-[#111]"
          dangerouslySetInnerHTML={{ __html: cleanPreview || '<p className="text-neutral-500 italic">No content to preview.</p>' }}
        />
      )}
    </div>
  );
}
