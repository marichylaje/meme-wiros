import React from 'react';
import styled from 'styled-components';
import { MdTextFields } from 'react-icons/md';
import Button from '../ui/Button';
import ColorButton from '../ui/ColorButton';

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
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

const StyleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 160px;
`;

const StrokeInput = styled.input`
  width: 2rem;
  padding: 0.3rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  text-align: center;
`;

const StyledSelect = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 100%;
  background-color: #2563eb;
  color: white;
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='white' viewBox='0 0 24 24' width='24' height='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
`;


type ColorPanelProps = {
  color: string;
  recentColors: string[];
  onColorChange: (color: string) => void;
  onRecentColorClick: (color: string) => void;

  onAddText: () => void;
  fontOptions: string[];
  selectedFont: string;
  onFontChange: (font: string) => void;
  onToggleFilled: () => void;

  filled: boolean;
  strokeWidth: number;
  onStrokeWidthChange: (val: number) => void;
};

const ColorPanel = ({
  color,
  recentColors,
  onColorChange,
  onRecentColorClick,
  onAddText,
  fontOptions,
  selectedFont,
  onFontChange,
  onToggleFilled,
  filled,
  strokeWidth,
  onStrokeWidthChange
}: ColorPanelProps) => {
  return (
    <Panel>
      <Button onClick={onAddText}>
        Agregar nuevo texto
      </Button>
      <StyleRow>
        <Button style={{ width: '160px', maxWidth: '160px', backgroundColor: `${filled ? '#2563eb' : '#ef4444'}` }} onClick={onToggleFilled}>
          {!filled ? 'Quitar' : 'Agregar borde texto'}
        </Button>
        {!filled && (
          <>
            <StrokeInput
              type="number"
              min="0"
              max="9"
              maxLength={1}
              value={strokeWidth}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 1 && value <= 9) {
                  onStrokeWidthChange(value);
                }
              }}
            />
            <span>px</span>
          </>
        )}
      </StyleRow>
      <StyledSelect
        value={selectedFont}
        onChange={(e) => onFontChange(e.target.value)}
      >
        {fontOptions.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </StyledSelect>
      <ColorInput
        type="color"
        value={color}
        onChange={(e) => onColorChange(e.target.value)}
      />

      <RecentColors>
        {recentColors.map((recent, idx) => (
          <ColorButton
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
