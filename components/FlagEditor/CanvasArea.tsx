import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import TextOverlay from './TextOverlay';
import ImageOverlay from './ImageOverlay';
import { templateDefaultColors } from '../../lib/templateColors';

const AspectRatioBox = styled.div`
  border-radius: 1rem;
  position: relative;
  height: 452px;
  aspect-ratio: 2700 / 2100;
  background-color: #eee;
  overflow: hidden;
  border: 2px solid #ccc;
`;

const MaskedLayer = styled.div<{
  zIndex: number;
  color: string;
  $maskUrl: string;
  previewMode: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${(props) => props.zIndex};
  background-color: ${(props) => props.color};
  mask-image: url(${(props) => props.$maskUrl});
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
  -webkit-mask-image: url(${(props) => props.$maskUrl});
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
`;

type CanvasAreaProps = {
  templateName: string;
  sides: number;
  texts: {
    id: string;
    text: string;
    color: string;
    fontFamily: string;
    fontSize: number;
    filled: boolean;
    strokeWidth: number;
    position: { x: number; y: number };
  }[];
  setTexts?: React.Dispatch<React.SetStateAction<any[]>>;
  selectedTextId?: string | null;
  setSelectedTextId?: (id: string | null) => void;
  setLastSelectedTarget?: (target: 'text' | 'layer' | 'image' | null) => void;
  images: {
    id: string;
    src: string;
    position: { x: number; y: number };
    size: number;
    color: string;
  }[];
  setImages?: React.Dispatch<React.SetStateAction<any[]>>;
  previewMode?: boolean;
  style?: any;
  selectedImageId?: string | null;
  setSelectedImageId?: any;
  className?: string;
  layerColors: string[]; // NEW: override colors
};

const CanvasArea = ({
  templateName,
  sides,
  texts,
  setTexts,
  selectedTextId,
  setSelectedTextId,
  setLastSelectedTarget,
  images,
  setImages,
  previewMode = false,
  style,
  selectedImageId,
  setSelectedImageId,
  className,
  layerColors
}: CanvasAreaProps) => {
  const defaultColors = templateDefaultColors[templateName || templateName.toLowerCase()] || [];
  const effectiveColors = layerColors.length ? layerColors : defaultColors;
  const boxRef = useRef<HTMLDivElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const src = e.dataTransfer.getData('text/plain');
    if (!src) return;

    const bounds = boxRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const x = (e.clientX - bounds.left) / bounds.width;
    const y = (e.clientY - bounds.top) / bounds.height;

    const newImage = {
      id: crypto.randomUUID(),
      src,
      position: { x, y },
      size: 100,
      color: '#000',
    };

    setImages((prev) => [...prev, newImage]);
    setSelectedImageId?.(newImage.id);
    setLastSelectedTarget?.('image');
  };

  useEffect(() => {
    const handleDelete = (e: KeyboardEvent) => {
      if (e.key === 'Delete') {
        if (selectedImageId) {
          setImages((prev) => prev.filter((img) => img.id !== selectedImageId));
          setSelectedImageId?.(null);
        }
      }
    };
    window.addEventListener('keydown', handleDelete);
    return () => window.removeEventListener('keydown', handleDelete);
  }, [selectedImageId]);

  const handleTextClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setTimeout(() => {
      console.log('TEXT CLICKK');
    }, 100);
  };

  return (
    <AspectRatioBox
      ref={boxRef}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{ ...style }}
      className={className}
    >
      {Array.from({ length: sides }, (_, index) => {
        const layerColor = effectiveColors[index];
        if (!layerColor || layerColor.trim() === '' || layerColor === 'transparent') return null;
        return (
          <MaskedLayer
            key={index}
            zIndex={index + 1}
            color={layerColor}
            $maskUrl={`/templates/${templateName}/img${index + 1}.png`}
            previewMode={previewMode}
          />
        );
      })}

      {texts.map((textObj) => (
        <TextOverlay
          key={textObj.id}
          text={textObj.text}
          position={textObj.position}
          setPosition={(pos) =>
            setTexts((prev) =>
              prev.map((t) => (t.id === textObj.id ? { ...t, position: pos } : t))
            )
          }
          color={textObj.color}
          fontFamily={textObj.fontFamily}
          fontSize={textObj.fontSize}
          setFontSize={(size) =>
            setTexts((prev) =>
              prev.map((t) => (t.id === textObj.id ? { ...t, fontSize: size } : t))
            )
          }
          filled={textObj.filled}
          strokeWidth={textObj.strokeWidth}
          setLastSelectedTarget={() => {
            if (previewMode) return;
            setLastSelectedTarget?.('text');
            setSelectedTextId?.(textObj.id);
            setSelectedImageId?.(null);
          }}
          onClick={handleTextClick}
          onDelete={() => setTexts((prev) => prev.filter((t) => t.id !== textObj.id))}
          selected={selectedTextId === textObj.id}
          onTextChange={(newText) =>
            setTexts((prev) =>
              prev.map((t) => (t.id === textObj.id ? { ...t, text: newText } : t))
            )
          }
          previewMode={previewMode}
        />
      ))}

      {images.map((img) => (
        <ImageOverlay
          key={img.id}
          image={img}
          setImage={(partial) =>
            setImages((prev) =>
              prev.map((i) => (i.id === img.id ? { ...i, ...partial } : i))
            )
          }
          onDelete={() => setImages((prev) => prev.filter((i) => i.id !== img.id))}
          selected={selectedImageId === img.id}
          setSelected={() => {
            setSelectedImageId?.(img.id);
            setLastSelectedTarget?.('image');
            setSelectedTextId?.(null);
          }}
          previewMode={previewMode}
          className="imgWrapper"
          hasSelectedText={!!selectedTextId}
          setSelectedImageId={setSelectedImageId}
        />
      ))}
    </AspectRatioBox>
  );
};

export default CanvasArea;
