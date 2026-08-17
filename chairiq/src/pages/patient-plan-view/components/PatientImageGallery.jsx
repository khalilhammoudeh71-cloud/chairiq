import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';

export default function PatientImageGallery({ images = [], language = 'EN' }) {
  const [expandedImage, setExpandedImage] = useState(null);

  if (!images || images.length === 0) return null;

  const title = language === 'ES'
    ? 'Por Qué Se Necesita Este Tratamiento'
    : 'Why This Treatment Is Needed';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Camera size={20} className="text-accent" />
        <h4 className="text-lg font-medium text-t1">
          {title}
        </h4>
      </div>

      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: images.length === 1 ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))'
        }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            className="rounded-xl overflow-hidden bg-bg2 border border-bd"
          >
            <div
              className="cursor-pointer"
              onClick={() => setExpandedImage(img)}
            >
              <img
                src={img.imageUrl}
                alt={img.note || (language === 'ES' ? 'Imagen del paciente' : 'Patient image')}
                className="w-full h-auto object-contain bg-bg3"
                style={{ maxHeight: '300px' }}
              />
            </div>
            {img.note && (
              <div className="p-3">
                <p className="text-sm leading-relaxed text-t2">
                  {img.note}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay"
          onClick={() => setExpandedImage(null)}
        >
          <button
            onClick={() => setExpandedImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-bg2 border border-bd hover:bg-bg3 transition-colors"
          >
            <X size={24} className="text-t1" />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={expandedImage.imageUrl}
              alt={expandedImage.note || ''}
              className="w-full h-auto object-contain rounded-xl"
              style={{ maxHeight: '80vh' }}
            />
            {expandedImage.note && (
              <p className="text-center mt-4 text-base text-t2">
                {expandedImage.note}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
