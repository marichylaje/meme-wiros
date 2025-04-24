import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useModal } from '../../context/ModalContext';

const Overlay = styled.div<{
  x: number;
  y: number;
  color: string;
  fontFamily: string;
  selected: boolean;
  fontSize: number;
  filled: boolean;
  strokeWidth: number;
  previewMode: boolean;
}>`
  position: absolute;
  top: ${(props) => props.y * 100}%;
  left: ${(props) => props.x * 100}%;
  transform: translate(-50%, -50%);
  color: ${(props) => props.color};
  font-family: ${(props) => props.fontFamily};
  font-size: ${(props) => props.previewMode ? props.fontSize * 0.8 : props.fontSize}px;
  font-weight: ${(props) => (props.filled ? 'bold' : 'normal')};
  -webkit-text-stroke: ${(props) => props.filled ? '0px' : `${props.strokeWidth}px #000`};
  background: transparent;
  user-select: none;
  z-index: ${(props) => (props.selected ? 12 : 11)};
  border: ${(props) => (props.selected ? '1px dashed black' : 'none')};
  padding: 4px;
  cursor: move;
  white-space: nowrap;
  overflow: visible;
  max-width: none;
  pointer-events: auto;
`;

const Resizer = styled.div`
  width: 12px;
  height: 12px;
  background: black;
  position: absolute;
  bottom: -6px;
  right: -6px;
  cursor: nwse-resize;
  z-index: 13;
`;

const EditableInput = styled.input`
  position: absolute;
  transform: translate(-50%, -50%);
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  z-index: 13;
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
  onTextChange: (text: string) => void;
  onDelete: () => void;
  strokeWidth: number;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  previewMode: boolean;
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
  onDelete,
  strokeWidth,
  onClick,
  previewMode,
}: TextOverlayProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [editing, setEditing] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { isModalOpen } = useModal();

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isResizing) setIsDragging(true);
    setLastSelectedTarget();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editing || isModalOpen) return;
      if (selected && (e.key === 'Backspace' || e.key === 'Delete')) {
        e.preventDefault();
        onDelete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected, editing, isModalOpen]);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const parent = overlayRef.current?.parentElement;
      if (!parent || previewMode) return;

      const bounds = parent.getBoundingClientRect();

      if (isDragging && !isResizing) {
        const newX = (e.clientX - bounds.left) / bounds.width;
        const newY = (e.clientY - bounds.top) / bounds.height;
        setPosition({ x: Math.min(1, Math.max(0, newX)), y: Math.min(1, Math.max(0, newY)) });
      }

      if (isResizing) {
        const newFontSize = fontSize + e.movementY;
        setFontSize(Math.max(8, newFontSize));
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, isResizing, fontSize, previewMode]);

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
        strokeWidth={strokeWidth}
        previewMode={previewMode}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => setEditing(true)}
        onClick={(e) => {
          e.stopPropagation();
          setLastSelectedTarget();
        }}
        style={{ opacity: 0.9 }}
      >
        {text}
        {selected && <Resizer onMouseDown={(e) => {
          e.stopPropagation();
          setIsResizing(true);
        }} />}
      </Overlay>

      {editing && (
        <EditableInput
          style={{
            top: `${position.y * 100}%`,
            left: `${position.x * 100}%`,
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
