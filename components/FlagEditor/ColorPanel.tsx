import React from 'react';
import styled from 'styled-components';
import { MdTextFields, MdFontDownload } from 'react-icons/md';

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const IconButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background-color: #f3f4f6;
  color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.3s;

  &:hover {
    transform: scale(1.1);
    background-color: #e5e7eb;
  }
`;

const ColorInput = styled.input`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
`;

const RecentColors = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RecentColorButton = styled.button<{ color: string }>`
  width: 40px;
  height: 40px;
  background-color: ${(props) => props.color};
  border: 2px solid #fff;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

type ColorPanelProps = {
  color: string;
  recentColors: string[];
  onColorChange: (color: string) => void;
  onRecentColorClick: (color: string) => void;

  openTextModal: () => void;
  fontOptions: string[];
  selectedFont: string;
  onFontChange: (font: string) => void;
};

const ColorPanel = ({
  color,
  recentColors,
  onColorChange,
  onRecentColorClick,
  openTextModal,
  fontOptions,
  selectedFont,
  onFontChange,
}: ColorPanelProps) => {
  return (
    <Panel>
      <IconButton onClick={openTextModal} title="Agregar / Editar texto">
        {/** @ts-ignore */}
        <MdTextFields size={24} />
      </IconButton>

      {/* Dropdown de Tipografías */}
      <select
        value={selectedFont}
        onChange={(e) => onFontChange(e.target.value)}
        style={{
          padding: '0.5rem',
          borderRadius: '8px',
          border: '1px solid #ccc',
          width: '100%',
        }}
      >
        {fontOptions.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>

      {/* Color Picker */}
      <ColorInput
        type="color"
        value={color}
        onChange={(e) => onColorChange(e.target.value)}
      />

      {/* Colores recientes */}
      <RecentColors>
        {recentColors.map((recent, idx) => (
          <RecentColorButton
            key={idx}
            color={recent}
            onClick={() => onRecentColorClick(recent)}
          />
        ))}
      </RecentColors>
    </Panel>
  );
};

export default ColorPanel;
