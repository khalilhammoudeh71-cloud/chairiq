import React, { useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

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
        className="bg-bg3 text-t1 rounded-lg"
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          background-color: var(--bg3);
          border-color: var(--bd);
          border-radius: 0 0 0.5rem 0.5rem;
          min-height: 200px;
          font-size: 15px;
        }
        
        .rich-text-editor .ql-toolbar {
          background-color: var(--bg2);
          border-color: var(--bd);
          border-radius: 0.5rem 0.5rem 0 0;
        }
        
        .rich-text-editor .ql-editor {
          color: var(--t1);
          min-height: 200px;
        }
        
        .rich-text-editor .ql-editor.ql-blank::before {
          color: var(--t3);
          font-style: normal;
        }
        
        .rich-text-editor .ql-stroke {
          stroke: var(--t3);
        }
        
        .rich-text-editor .ql-fill {
          fill: var(--t3);
        }
        
        .rich-text-editor .ql-picker-label {
          color: var(--t3);
        }
        
        .rich-text-editor .ql-toolbar button:hover,
        .rich-text-editor .ql-toolbar button.ql-active {
          color: var(--accent);
        }
        
        .rich-text-editor .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: var(--accent);
        }
        
        .rich-text-editor .ql-toolbar button:hover .ql-fill,
        .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: var(--accent);
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;