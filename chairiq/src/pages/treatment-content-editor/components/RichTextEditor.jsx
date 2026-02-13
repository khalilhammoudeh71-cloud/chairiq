import React, { useRef, useCallback } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link, Type, Trash2 } from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);

  const execCommand = useCallback((command, val = null) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleLink = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  }, [execCommand]);

  const handleHeading = useCallback((level) => {
    execCommand('formatBlock', level === 'p' ? 'p' : `h${level}`);
  }, [execCommand]);

  const toolbarButtons = [
    { icon: Type, action: () => handleHeading(2), title: 'Heading' },
    { icon: Bold, action: () => execCommand('bold'), title: 'Bold' },
    { icon: Italic, action: () => execCommand('italic'), title: 'Italic' },
    { icon: Underline, action: () => execCommand('underline'), title: 'Underline' },
    { icon: ListOrdered, action: () => execCommand('insertOrderedList'), title: 'Ordered List' },
    { icon: List, action: () => execCommand('insertUnorderedList'), title: 'Bullet List' },
    { icon: Link, action: handleLink, title: 'Insert Link' },
    { icon: Trash2, action: () => execCommand('removeFormat'), title: 'Clear Formatting' },
  ];

  return (
    <div className="rich-text-editor border border-bd rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 bg-bg2 border-b border-bd">
        {toolbarButtons.map((btn, i) => (
          <button
            key={i}
            type="button"
            onClick={btn.action}
            title={btn.title}
            className="p-2 rounded hover:bg-bg3 text-t3 hover:text-t1 transition-colors"
          >
            <btn.icon className="w-4 h-4" />
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value || '' }}
        data-placeholder={placeholder}
        className="min-h-[200px] p-4 bg-bg3 text-t1 text-[15px] leading-relaxed outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-t3"
      />
    </div>
  );
};

export default RichTextEditor;
