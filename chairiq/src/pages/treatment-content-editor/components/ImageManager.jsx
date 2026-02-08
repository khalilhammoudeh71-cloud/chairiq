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
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10' :'border-gray-700 hover:border-gray-600'
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
        
        <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        
        <h3 className="text-lg font-semibold text-white mb-2">
          Upload Treatment Images
        </h3>
        
        <p className="text-gray-400 mb-4">
          Drag and drop images here, or click to browse
        </p>
        
        <button
          onClick={() => fileInputRef?.current?.click()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Select Images
        </button>
        
        <p className="text-sm text-gray-500 mt-4">
          Supported: JPG, PNG, GIF • Max size: 5MB per image
        </p>
      </div>
      {/* Image Grid */}
      {images?.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Uploaded Images ({images?.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {images?.map((image) => (
              <div
                key={image?.id}
                className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden"
              >
                {/* Image Preview */}
                <div className="relative aspect-video bg-gray-800">
                  <img
                    src={image?.url || image?.src}
                    alt={image?.alt || 'Treatment image'}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => setSelectedImage(image)}
                      className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(image?.id)}
                      className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Image Details */}
                <div className="p-4 space-y-3">
                  {/* Alt Text */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Alt Text (Accessibility)
                    </label>
                    <input
                      type="text"
                      value={image?.alt || ''}
                      onChange={(e) => handleUpdateAlt(image?.id, e?.target?.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe the image for accessibility"
                    />
                  </div>

                  {/* Caption English */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Caption (English)
                    </label>
                    <input
                      type="text"
                      value={image?.caption?.en || ''}
                      onChange={(e) => handleUpdateCaption(image?.id, 'en', e?.target?.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Image caption in English"
                    />
                  </div>

                  {/* Caption Spanish */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Caption (Español)
                    </label>
                    <input
                      type="text"
                      value={image?.caption?.es || ''}
                      onChange={(e) => handleUpdateCaption(image?.id, 'es', e?.target?.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Descripción de la imagen en español"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-700">
          <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No images uploaded yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Add images to enhance the treatment documentation
          </p>
        </div>
      )}
      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full" onClick={(e) => e?.stopPropagation()}>
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">Image Preview</h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              
              <div className="p-4">
                <img
                  src={selectedImage?.url || selectedImage?.src}
                  alt={selectedImage?.alt || 'Treatment image'}
                  className="w-full h-auto rounded-lg"
                />
                
                {selectedImage?.caption?.en && (
                  <p className="text-gray-300 text-center mt-4">
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