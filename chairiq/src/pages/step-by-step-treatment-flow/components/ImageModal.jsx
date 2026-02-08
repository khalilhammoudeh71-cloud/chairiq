import React, { useEffect } from 'react';
import Image from '../../../components/AppImage';

import Button from '../../../components/ui/Button';

const ImageModal = ({ 
  isOpen, 
  onClose, 
  image, 
  imageAlt, 
  title 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full bg-card rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e?.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
          <h3 className="text-lg font-semibold text-card-foreground truncate pr-4">
            {title}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
            iconSize={20}
            className="flex-shrink-0"
            aria-label="Close image"
          />
        </div>

        {/* Image */}
        <div className="relative bg-muted">
          <Image
            src={image}
            alt={imageAlt}
            className="w-full h-auto max-h-[70vh] object-contain"
          />
        </div>

        {/* Footer */}
        <div className="p-4 bg-muted/50 flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            iconName="X"
            iconPosition="left"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;