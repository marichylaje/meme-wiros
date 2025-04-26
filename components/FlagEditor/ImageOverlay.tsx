import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useModal } from '../../context/ModalContext';

const Wrapper = styled.div<{
  x: number;
  y: number;
  size: number;
  previewMode: boolean;
  hasSelectedText: boolean;
}>`
  position: absolute;
  top: ${(p) => p.y * 100}%;
  left: ${(p) => p.x * 100}%;
  transform: translate(-50%, -50%);
  width: ${(p) => (p.previewMode ? p.size * 0.8 : p.size)}px;
  height: ${(p) => (p.previewMode ? p.size * 0.8 : p.size)}px;
  cursor: move;
  user-select: none;
  z-index: ${(p) => (p.hasSelectedText ? 10 : 10)};
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
  setImage: (img) => void;
  onDelete: () => void;
  selected: boolean;
  setSelected: () => void;
  previewMode: boolean;
  className: string;
  hasSelectedText: boolean;
  setSelectedImageId: any;
};

const ImageOverlay = ({
  image,
  setImage,
  onDelete,
  selected,
  setSelected,
  previewMode,
  className,
  hasSelectedText,
  setSelectedImageId
}: ImageOverlayProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { isModalOpen } = useModal();

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isResizing) setIsDragging?.(true);
    setSelected?.();
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isModalOpen) return;
      if (selected && (e.key === 'Delete' || e.key === 'Backspace')) {
        e.preventDefault();
        onDelete();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selected, isModalOpen]);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const parent = ref.current?.parentElement;
      if (!parent || previewMode) return;

      const bounds = parent.getBoundingClientRect();

      if (isDragging && !isResizing) {
        const newX = (e.clientX - bounds.left) / bounds.width;
        const newY = (e.clientY - bounds.top) / bounds.height;
        setImage({ position: { x: Math.min(1, Math.max(0, newX)), y: Math.min(1, Math.max(0, newY)) } });
      }

      if (isResizing) {
        const newSize = image.size + e.movementX;
        setImage({ size: Math.max(10, newSize) });
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging?.(false);
      setIsResizing?.(false);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, isResizing, image.size, previewMode]);

  return (
    <Wrapper
      ref={ref}
      x={image.position.x}
      y={image.position.y}
      size={image.size}
      previewMode={previewMode}
      style={{ border: selected ? '1px dashed black' : 'none' }}
      className={className}
      hasSelectedText={hasSelectedText}
      onMouseDown={handleMouseDown}
    >
      <ColoredImage src={image.src} color={image.color} />
      {selected && (
        <Resizer
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsResizing(true);
          }}
        />
      )}
    </Wrapper>
  );
};

export default ImageOverlay;
