import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div<{ x: number; y: number; size: number; previewMode: boolean }>`
  position: absolute;
  top: ${(p) => p.y * 100}%;
  left: ${(p) => p.x * 100}%;
  transform: translate(-50%, -50%);
  width: ${(p) => (p.previewMode ? p.size * 0.8 : p.size)}px;
  height: ${(p) => (p.previewMode ? p.size * 0.8 : p.size)}px;
  cursor: move;
  user-select: none;
  z-index: 12;
`;

const Img = styled.img<{ tint: string }>`
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  filter: ${(props) => `drop-shadow(0 0 0 ${props.tint}) saturate(1000%)`};
`;

const ColoredImage = styled.div<{ src: string; color: string }>`
  width: 100%;
  height: 100%;
  background-color: ${(p) => p.color};

  mask-image: url(${(p) => p.src});
  mask-repeat: no-repeat;
  mask-size: contain;
  mask-position: center;

  -webkit-mask-image: url(${(p) => p.src});
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  -webkit-mask-position: center;

  pointer-events: none;
`;


const Resizer = styled.div`
  width: 6px;
  height: 6px;
  background: black;
  position: absolute;
  bottom: -6px;
  right: -6px;
  cursor: nwse-resize;
  z-index: 13;
`;

type ImageOverlayProps = {
  image: {
    id: string;
    src: string;
    position: { x: number; y: number };
    size: number;
    color: string;
  };
  setImage: (img: Partial<typeof image>) => void;
  onDelete: () => void;
  selected: boolean;
  setSelected: () => void;
  previewMode: boolean;
  className: string;
};

const ImageOverlay = ({
  image,
  setImage,
  onDelete,
  selected,
  setSelected,
  previewMode,
  className
}: ImageOverlayProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setSelected();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const parent = ref.current?.parentElement;
    if (!parent || previewMode) return;

    const bounds = parent.getBoundingClientRect();

    if (isDragging) {
      const newX = (e.clientX - bounds.left) / bounds.width;
      const newY = (e.clientY - bounds.top) / bounds.height;
      setImage({ position: { x: Math.min(1, Math.max(0, newX)), y: Math.min(1, Math.max(0, newY)) } });
    }

    if (isResizing) {
      const newSize = image.size + e.movementX;
      setImage({ size: Math.max(10, newSize) });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selected && (e.key === 'Delete' || e.key === 'Backspace')) {
        e.preventDefault();
        onDelete();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selected]);

  console.log("IMAGE COLOR: ", image.color)

  return (
    <Wrapper
      ref={ref}
      x={image.position.x}
      y={image.position.y}
      size={image.size}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      previewMode={previewMode}
      style={{ border: selected ? '1px dashed black' : 'none' }}
      className={className}
    >
<ColoredImage src={image.src} color={image.color} />
{selected && <Resizer onMouseDown={() => setIsResizing(true)} />}
    </Wrapper>
  );
};

export default ImageOverlay;
