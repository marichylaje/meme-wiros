// ✅ TextOverlay.tsx actualizado con doble click para editar
import React, { useState, useRef } from 'react';
import styled from 'styled-components';

const Overlay = styled.div<{
  x: number;
  y: number;
  color: string;
  fontFamily: string;
  selected: boolean;
  fontSize: number;
  filled: boolean;
}>`
  position: absolute;
  top: ${(props) => props.y * 100}%;
  left: ${(props) => props.x * 100}%;
  transform: translate(-50%, -50%);
  color: ${(props) => props.color};
  font-family: ${(props) => props.fontFamily};
  font-size: ${(props) => props.fontSize}px;
  font-weight: ${(props) => (props.filled ? 'bold' : 'normal')};
  -webkit-text-stroke: ${(props) => props.filled ? '0px' : `${Math.max(1, Math.floor(props.fontSize / 30))}px #000`};
  background: transparent;
  user-select: none;
  z-index: ${(props) => (props.selected ? 100001 : 100000)};
  border: ${(props) => (props.selected ? '1px dashed black' : 'none')};
  padding: 4px;
  cursor: move;
  white-space: nowrap;
  overflow: visible;
  max-width: none;
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

const EditableInput = styled.input`
  position: absolute;
  transform: translate(-50%, -50%);
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  z-index: 100003;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
`;

type TextOverlayProps = {
  text: string;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
  color: string;
  fontFamily: string;
  fontSize: number;
  setFontSize: (size: number) => void;
  filled: boolean;
  setLastSelectedTarget: () => void;
  selected: boolean;
  onTextChange: (text: string) => void; // 🆕
};

const TextOverlay = ({
  text,
  position,
  setPosition,
  color,
  fontFamily,
  fontSize,
  setFontSize,
  filled,
  setLastSelectedTarget,
  selected,
  onTextChange,
}: TextOverlayProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [editing, setEditing] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setLastSelectedTarget();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const parent = overlayRef.current?.parentElement;
    if (!parent) return;

    const bounds = parent.getBoundingClientRect();

    if (isDragging) {
      const newX = (e.clientX - bounds.left) / bounds.width;
      const newY = (e.clientY - bounds.top) / bounds.height;
      setPosition({ x: Math.min(1, Math.max(0, newX)), y: Math.min(1, Math.max(0, newY)) });
    }

    if (isResizing) {
      const newFontSize = fontSize + e.movementY;
      setFontSize(Math.max(8, newFontSize));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  return (
    <>
      <Overlay
        ref={overlayRef}
        x={position.x}
        y={position.y}
        color={color}
        fontFamily={fontFamily}
        fontSize={fontSize}
        filled={filled}
        selected={selected}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={() => setEditing(true)} // 🆕
      >
        {text}
        {selected && <Resizer onMouseDown={() => setIsResizing(true)} />}
      </Overlay>

      {editing && (
        <EditableInput
          style={{
            top: `${position.y * 100}%`,
            left: `${position.x * 100}%`,
            position: 'absolute',
          }}
          autoFocus
          defaultValue={text}
          onBlur={(e) => {
            onTextChange(e.target.value);
            setEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onTextChange((e.target as HTMLInputElement).value);
              setEditing(false);
            }
          }}
        />
      )}
    </>
  );
};

export default TextOverlay;
