import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const VisualGallery = ({ visuals, currentLanguage }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const content = currentLanguage === 'en' 
    ? { title: 'Visual Guide', close: 'Close' }
    : { title: 'Guía Visual', close: 'Cerrar' };

  return (
    <div className="visual-gallery mb-6">
      <h2 className="text-2xl md:text-3xl font-bold font-heading text-card-foreground mb-6">
        {content?.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visuals?.map((visual, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(visual)}
            className="group relative aspect-video rounded-xl overflow-hidden shadow-subtle focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <Image
              src={visual?.image}
              alt={visual?.imageAlt}
              className="w-full h-full object-cover"
            />
            {/* Removed hover overlays and animations for clinical stability */}
          </button>
        ))}
      </div>
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-card flex items-center justify-center hover:bg-muted transition-smooth"
              aria-label={content?.close}
            >
              <Icon name="X" size={24} />
            </button>
            <div className="bg-card rounded-2xl overflow-hidden shadow-medium">
              <Image
                src={selectedImage?.image}
                alt={selectedImage?.imageAlt}
                className="w-full h-auto"
              />
              <div className="p-6">
                <p className="text-lg text-card-foreground">
                  {selectedImage?.caption}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualGallery;