import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Eye } from 'lucide-react';
import { useToast } from '../../../hooks/useToast';

const ImageManager = ({ images, onUpdate, procedureName }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  const handleFileSelect = (files) => {
    const validFiles = Array.from(files)?.filter(file => {
      if (!file?.type?.startsWith('image/')) {
        showToast('Only image files are allowed', 'error');
        return false;
      }
      if (file?.size > 5 * 1024 * 1024) {
        showToast('Image size must be less than 5MB', 'error');
        return false;
      }
      return true;
    });

    if (validFiles?.length > 0) {
      const newImages = validFiles?.map(file => ({
        id: Date.now() + Math.random(),
        file,
        url: URL.createObjectURL(file),
        name: file?.name,
        alt: '',
        caption: { en: '', es: '' }
      }));

      onUpdate([...images, ...newImages]);
      showToast(`${validFiles?.length} image(s) added successfully`, 'success');
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragging(false);
    handleFileSelect(e?.dataTransfer?.files);
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDelete = (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      const updatedImages = images?.filter(img => img?.id !== imageId);
      onUpdate(updatedImages);
      showToast('Image deleted successfully', 'success');
    }
  };

  const handleUpdateCaption = (imageId, language, value) => {
    const updatedImages = images?.map(img =>
      img?.id === imageId
        ? {
            ...img,
            caption: {
              ...img?.caption,
              [language]: value
            }
          }
        : img
    );
    onUpdate(updatedImages);
  };

  const handleUpdateAlt = (imageId, value) => {
    const updatedImages = images?.map(img =>
      img?.id === imageId ? { ...img, alt: value } : img
    );
    onUpdate(updatedImages);
  };

  return (
    <div className="space-y-6">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-accent bg-accent/10' :'border-bd hover:border-t3'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e?.target?.files)}
          className="hidden"
        />
        
        <Upload className="w-12 h-12 text-t3 mx-auto mb-4" />
        
        <h3 className="text-lg font-semibold text-t1 mb-2">
          Upload Treatment Images
        </h3>
        
        <p className="text-t3 mb-4">
          Drag and drop images here, or click to browse
        </p>
        
        <button
          onClick={() => fileInputRef?.current?.click()}
          className="px-6 py-3 bg-accent text-white rounded-lg hover:brightness-110 transition-colors"
        >
          Select Images
        </button>
        
        <p className="text-sm text-t3 mt-4">
          Supported: JPG, PNG, GIF • Max size: 5MB per image
        </p>
      </div>
      {images?.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold text-t1 mb-4">
            Uploaded Images ({images?.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {images?.map((image) => (
              <div
                key={image?.id}
                className="bg-bg3 rounded-lg border border-bd overflow-hidden"
              >
                <div className="relative aspect-video bg-bg2">
                  <img
                    src={image?.url || image?.src}
                    alt={image?.alt || 'Treatment image'}
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => setSelectedImage(image)}
                      className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(image?.id)}
                      className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-danger transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-t3 mb-1">
                      Alt Text (Accessibility)
                    </label>
                    <input
                      type="text"
                      value={image?.alt || ''}
                      onChange={(e) => handleUpdateAlt(image?.id, e?.target?.value)}
                      className="w-full px-3 py-2 bg-bg2 border border-bd rounded text-t1 text-sm focus:border-accent focus:outline-none"
                      placeholder="Describe the image for accessibility"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-t3 mb-1">
                      Caption (English)
                    </label>
                    <input
                      type="text"
                      value={image?.caption?.en || ''}
                      onChange={(e) => handleUpdateCaption(image?.id, 'en', e?.target?.value)}
                      className="w-full px-3 py-2 bg-bg2 border border-bd rounded text-t1 text-sm focus:border-accent focus:outline-none"
                      placeholder="Image caption in English"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-t3 mb-1">
                      Caption (Español)
                    </label>
                    <input
                      type="text"
                      value={image?.caption?.es || ''}
                      onChange={(e) => handleUpdateCaption(image?.id, 'es', e?.target?.value)}
                      className="w-full px-3 py-2 bg-bg2 border border-bd rounded text-t1 text-sm focus:border-accent focus:outline-none"
                      placeholder="Descripción de la imagen en español"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-bg3 rounded-lg border border-bd">
          <ImageIcon className="w-16 h-16 text-t2 mx-auto mb-4" />
          <p className="text-t3">No images uploaded yet</p>
          <p className="text-sm text-t3 mt-2">
            Add images to enhance the treatment documentation
          </p>
        </div>
      )}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-[var(--overlay)] backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full" onClick={(e) => e?.stopPropagation()}>
            <div className="bg-bg2 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-bd">
                <h3 className="text-lg font-semibold text-t1">Image Preview</h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 hover:bg-bg3 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-t1" />
                </button>
              </div>
              
              <div className="p-4">
                <img
                  src={selectedImage?.url || selectedImage?.src}
                  alt={selectedImage?.alt || 'Treatment image'}
                  className="w-full h-auto rounded-lg"
                />
                
                {selectedImage?.caption?.en && (
                  <p className="text-t3 text-center mt-4">
                    {selectedImage?.caption?.en}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageManager;