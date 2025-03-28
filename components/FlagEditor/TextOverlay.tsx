import React, { useState } from 'react';
import styled from 'styled-components';

const Overlay = styled.div<{ x: number; y: number; color: string; fontFamily: string }>`
  position: absolute;
  top: ${(props) => props.y * 100}%;
  left: ${(props) => props.x * 100}%;
  transform: translate(-50%, -50%);
  color: ${(props) => props.color};
  font-family: ${(props) => props.fontFamily};
  font-size: 2rem;
  cursor: grab;
  user-select: none;
  z-index: 100000;

  &:active {
    cursor: grabbing;
  }
`;

type TextOverlayProps = {
  text: string;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
  color: string;
  fontFamily: string;
  setLastSelectedTarget: (target: 'text') => void;
};

const TextOverlay = ({
  text,
  position,
  setPosition,
  color,
  fontFamily,
  setLastSelectedTarget,
}: TextOverlayProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setLastSelectedTarget('text');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
  
    const parent = e.currentTarget.parentElement;
    if (!parent) return;
  
    const bounds = parent.getBoundingClientRect();
    const newX = (e.clientX - bounds.left) / bounds.width;
    const newY = (e.clientY - bounds.top) / bounds.height;
  
    setPosition({
      x: Math.min(1, Math.max(0, newX)),
      y: Math.min(1, Math.max(0, newY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <Overlay
      x={position.x}
      y={position.y}
      color={color}
      fontFamily={fontFamily}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {text}
    </Overlay>
  );
};

export default TextOverlay;
