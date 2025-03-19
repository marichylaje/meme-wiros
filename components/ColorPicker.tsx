import React, { useState } from 'react';
import styled from 'styled-components';
import { useColor } from '../context/ColorContext';

const PickerContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
`;

const ColorButton = styled.button`
  background-color: #f3f4f6; /* gris claro */
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #d1d5db;
  font-weight: bold;
`;

const ColorPreview = styled.div<{ color: string }>`
  width: 24px;
  height: 24px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: ${(props) => props.color || 'transparent'};
`;

const HiddenInput = styled.input`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
`;

const ColorPicker = () => {
  const { color, setColor } = useColor();
  const [showPicker, setShowPicker] = useState(false);

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    setShowPicker(false);
  };

  return (
    <PickerContainer>
      <ColorButton onClick={togglePicker}>Color</ColorButton>
      <ColorPreview color={color} onClick={togglePicker} />
      {showPicker && (
        <HiddenInput
          type="color"
          value={color === 'transparent' ? '#ffffff' : color}
          onChange={handleColorChange}
        />
      )}
    </PickerContainer>
  );
};

export default ColorPicker;
