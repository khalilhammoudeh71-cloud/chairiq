import React, { useState, useEffect, useRef } from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';
import OptimizedImage from './OptimizedImage';

const EnhancedImageViewer = ({ 
  images = [], // Array of { src, alt } objects for comparison
  initialIndex = 0,
  title,
  onClose,
  language = 'en'
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonImages, setComparisonImages] = useState([0, 1]); // Indices to compare
  const imageContainerRef = useRef(null);

  const currentImage = images?.[currentIndex];
  const hasMultipleImages = images?.length > 1;

  // Reset transformations when image changes
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e?.key) {
        case 'Escape':
          onClose?.();
          break;
        case '+': case'=':
          handleZoomIn();
          break;
        case '-': case'_':
          handleZoomOut();
          break;
        case 'r': case'R':
          handleRotateRight();
          break;
        case 'ArrowLeft':
          if (hasMultipleImages && !comparisonMode) handlePrevious();
          break;
        case 'ArrowRight':
          if (hasMultipleImages && !comparisonMode) handleNext();
          break;
        case 'c': case'C':
          if (hasMultipleImages) toggleComparisonMode();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, hasMultipleImages, comparisonMode, zoom, rotation]);

  // Zoom controls
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Rotation controls
  const handleRotateLeft = () => {
    setRotation(prev => (prev - 90) % 360);
  };

  const handleRotateRight = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleResetRotation = () => {
    setRotation(0);
  };

  // Navigation
  const handlePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images?.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < images?.length - 1 ? prev + 1 : 0));
  };

  // Comparison mode
  const toggleComparisonMode = () => {
    setComparisonMode(prev => !prev);
    if (!comparisonMode && hasMultipleImages) {
      setComparisonImages([currentIndex, (currentIndex + 1) % images?.length]);
    }
    handleResetZoom();
    setRotation(0);
  };

  const handleComparisonImageChange = (position, direction) => {
    const newIndex = comparisonImages?.[position] + direction;
    const wrappedIndex = (newIndex + images?.length) % images?.length;
    const newComparison = [...comparisonImages];
    newComparison[position] = wrappedIndex;
    setComparisonImages(newComparison);
  };

  // Pan/drag functionality
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e?.clientX - position?.x,
        y: e?.clientY - position?.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e?.clientX - dragStart?.x,
        y: e?.clientY - dragStart?.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (zoom > 1 && e?.touches?.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e?.touches?.[0]?.clientX - position?.x,
        y: e?.touches?.[0]?.clientY - position?.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && zoom > 1 && e?.touches?.length === 1) {
      setPosition({
        x: e?.touches?.[0]?.clientX - dragStart?.x,
        y: e?.touches?.[0]?.clientY - dragStart?.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const imageTransform = `translate(${position?.x}px, ${position?.y}px) scale(${zoom}) rotate(${rotation}deg)`;

  return (
    <div className="enhanced-image-viewer-container">
      {/* Header with title and controls */}
      <div className="flex items-center justify-between p-4 bg-bg3 border-b border-bd">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-t1 truncate max-w-md">
            {title}
          </h3>
          {!comparisonMode && hasMultipleImages && (
            <span className="text-sm text-t3">
              {currentIndex + 1} / {images?.length}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Keyboard shortcuts hint */}
          <div className="hidden md:block text-xs text-t3 mr-4">
            {language === 'en' ? 'Keyboard: +/- zoom, R rotate, C compare, Esc close' : 'Teclado: +/- zoom, R rotar, C comparar, Esc cerrar'}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
            className="text-t3 hover:text-t1 hover:bg-bg2/80"
            aria-label={language === 'en' ? 'Close' : 'Cerrar'}
          />
        </div>
      </div>

      {/* Main image area */}
      <div className="flex-1 relative overflow-hidden">
        {!comparisonMode ? (
          // Single image view
          <div 
            ref={imageContainerRef}
            className="w-full h-full flex items-center justify-center p-4"
            style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            <OptimizedImage
              src={currentImage?.url}
              alt={currentImage?.alt || 'Procedure image'}
              className="main-procedure-image"
              style={{
                maxHeight: '70vh',
                objectFit: 'contain'
              }}
              width={1200}
              height={800}
              lazy={false}
              blur={true}
              optimizationOptions={{
                quality: 90,
                format: 'webp'
              }}
            />
          </div>
        ) : (
          // Side-by-side comparison view
          <div className="w-full h-full flex items-center justify-center gap-2 p-4">
            {comparisonImages?.map((imgIndex, position) => (
              <div key={position} className="flex-1 h-full flex flex-col items-center justify-center gap-2">
                <div className="relative w-full h-full flex items-center justify-center bg-bg3/40 rounded border border-bd">
                  <img
                    src={images?.[imgIndex]?.src}
                    alt={images?.[imgIndex]?.alt}
                    className="max-w-full max-h-full object-contain select-none"
                    draggable={false}
                  />
                  
                  {/* Navigation buttons for comparison images */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-bg3 rounded px-3 py-2 border border-bd">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleComparisonImageChange(position, -1)}
                      iconName="ChevronLeft"
                      className="text-t3 hover:text-t1 hover:bg-bg2/80"
                    />
                    <span className="text-sm text-t2 font-medium px-2">
                      {imgIndex + 1} / {images?.length}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleComparisonImageChange(position, 1)}
                      iconName="ChevronRight"
                      className="text-t3 hover:text-t1 hover:bg-bg2/80"
                    />
                  </div>
                </div>
                
                {/* Image description */}
                <p className="text-sm text-t3 text-center max-w-md line-clamp-2">
                  {images?.[imgIndex]?.alt}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Navigation arrows for single view */}
        {!comparisonMode && hasMultipleImages && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-bg3 hover:bg-bg2 text-t2 hover:text-t1 border border-bd rounded p-3"
              aria-label={language === 'en' ? 'Previous image' : 'Imagen anterior'}
            >
              <Icon name="ChevronLeft" size={24} />
            </button>
            
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-bg3 hover:bg-bg2 text-t2 hover:text-t1 border border-bd rounded p-3"
              aria-label={language === 'en' ? 'Next image' : 'Siguiente imagen'}
            >
              <Icon name="ChevronRight" size={24} />
            </button>
          </>
        )}
      </div>

      {/* Bottom toolbar */}
      <div className="bg-bg3 border-t border-bd p-4">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {/* Zoom controls */}
          {!comparisonMode && (
            <>
              <div className="flex items-center gap-1 bg-bg2 rounded p-1 border border-bd">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  iconName="ZoomOut"
                  className="text-t3 hover:text-t1 hover:bg-bg3/80"
                  disabled={zoom <= 0.5}
                  aria-label={language === 'en' ? 'Zoom out' : 'Alejar'}
                />
                <span className="text-t2 text-sm font-medium px-3 min-w-[4rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  iconName="ZoomIn"
                  className="text-t3 hover:text-t1 hover:bg-bg3/80"
                  disabled={zoom >= 5}
                  aria-label={language === 'en' ? 'Zoom in' : 'Acercar'}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetZoom}
                  iconName="Maximize2"
                  className="text-t3 hover:text-t1 hover:bg-bg3/80 ml-1"
                  aria-label={language === 'en' ? 'Reset zoom' : 'Restablecer zoom'}
                />
              </div>

              {/* Rotation controls */}
              <div className="flex items-center gap-1 bg-bg2 rounded p-1 border border-bd">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRotateLeft}
                  iconName="RotateCcw"
                  className="text-t3 hover:text-t1 hover:bg-bg3/80"
                  aria-label={language === 'en' ? 'Rotate left' : 'Rotar izquierda'}
                />
                <span className="text-t2 text-sm font-medium px-3 min-w-[4rem] text-center">
                  {rotation}°
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRotateRight}
                  iconName="RotateCw"
                  className="text-t3 hover:text-t1 hover:bg-bg3/80"
                  aria-label={language === 'en' ? 'Rotate right' : 'Rotar derecha'}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetRotation}
                  iconName="RefreshCw"
                  className="text-t3 hover:text-t1 hover:bg-bg3/80 ml-1"
                  aria-label={language === 'en' ? 'Reset rotation' : 'Restablecer rotación'}
                />
              </div>
            </>
          )}

          {/* Comparison mode toggle */}
          {hasMultipleImages && (
            <Button
              variant={comparisonMode ? 'default' : 'outline'}
              size="sm"
              onClick={toggleComparisonMode}
              iconName="Columns2"
              iconPosition="left"
              className={comparisonMode 
                ? 'bg-success hover:brightness-110 text-accent-foreground border-0' :'text-t3 hover:text-t1 border-bd hover:border-bd bg-bg2/50 hover:bg-bg2/80'
              }
            >
              {language === 'en' ? 'Compare' : 'Comparar'}
            </Button>
          )}
        </div>
        
        {/* Help text */}
        <div className="text-center mt-3 text-xs text-t3">
          {!comparisonMode ? (
            language === 'en' ?'Zoom in to enable image panning • Use mouse wheel or pinch to zoom' :'Aumente el zoom para habilitar el desplazamiento • Use la rueda del mouse o pellizque para hacer zoom'
          ) : (
            language === 'en' ?'Use arrows below each image to change comparison images' :'Use las flechas debajo de cada imagen para cambiar las imágenes de comparación'
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedImageViewer;