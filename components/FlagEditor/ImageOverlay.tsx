import React, { useState, useRef } from 'react';
import styled from 'styled-components';

const ImageWrapper = styled.div<{
  x: number;
  y: number;
  size: number;
  selected: boolean;
  previewMode: boolean;
}>`
  position: absolute;
  top: ${(props) => props.y * 100}%;
  left: ${(props) => props.x * 100}%;
  transform: translate(-50%, -50%);
  width: ${(props) => props.previewMode ? props.size * .6 : props.size}px;
  height: ${(props) =>  props.previewMode ? props.size * .6 : props.size}px;
  cursor: move;
  z-index: ${(props) => (props.selected ? 100001 : 100000)};
  border: ${(props) => (props.selected ? '1px dashed #000' : 'none')};
  user-select: none;
`;

const OverlayImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
`;

const Resizer = styled.div`
  width: 12px;
  height: 12px;
  background: black;
  position: absolute;
  bottom: -6px;
  right: -6px;
  cursor: nwse-resize;
  z-index: 100002;
`;

type ImageOverlayProps = {
  src: string;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
  size: number;
  setSize: (size: number) => void;
  selected: boolean;
  setSelected: () => void;
  previewMode: boolean;
};

const ImageOverlay = ({
  src,
  position,
  setPosition,
  size,
  setSize,
  selected,
  setSelected,
  previewMode,
}: ImageOverlayProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setSelected();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const parent = wrapperRef.current?.parentElement;
    if (!parent) return;
    const bounds = parent.getBoundingClientRect();

    if (isDragging) {
      const newX = (e.clientX - bounds.left) / bounds.width;
      const newY = (e.clientY - bounds.top) / bounds.height;
      setPosition({
        x: Math.min(1, Math.max(0, newX)),
        y: Math.min(1, Math.max(0, newY)),
      });
    }

    if (isResizing) {
      const newSize = size + e.movementX;
      setSize(Math.max(10, newSize));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  return (
    <ImageWrapper
      ref={wrapperRef}
      x={position.x}
      y={position.y}
      size={size}
      selected={selected}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      previewMode={previewMode}
    >
      <OverlayImage src={src} />
      {selected && <Resizer onMouseDown={() => setIsResizing(true)} />}
    </ImageWrapper>
  );
};

export default ImageOverlay;
