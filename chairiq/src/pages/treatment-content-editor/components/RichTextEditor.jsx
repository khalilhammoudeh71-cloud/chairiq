import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ],
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'link'
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-gray-900 text-white rounded-lg"
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          background-color: #111827;
          border-color: #374151;
          border-radius: 0 0 0.5rem 0.5rem;
          min-height: 200px;
          font-size: 15px;
        }
        
        .rich-text-editor .ql-toolbar {
          background-color: #1f2937;
          border-color: #374151;
          border-radius: 0.5rem 0.5rem 0 0;
        }
        
        .rich-text-editor .ql-editor {
          color: #ffffff;
          min-height: 200px;
        }
        
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #6b7280;
          font-style: normal;
        }
        
        .rich-text-editor .ql-stroke {
          stroke: #9ca3af;
        }
        
        .rich-text-editor .ql-fill {
          fill: #9ca3af;
        }
        
        .rich-text-editor .ql-picker-label {
          color: #9ca3af;
        }
        
        .rich-text-editor .ql-toolbar button:hover,
        .rich-text-editor .ql-toolbar button.ql-active {
          color: #60a5fa;
        }
        
        .rich-text-editor .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #60a5fa;
        }
        
        .rich-text-editor .ql-toolbar button:hover .ql-fill,
        .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #60a5fa;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;