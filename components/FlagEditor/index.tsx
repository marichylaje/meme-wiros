import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useColor } from '../../context/ColorContext';

import ColorPanel from './ColorPanel';
import CanvasArea from './CanvasArea';
import LayersControls from './LayersControls';
import ModalTexto from './ModalTexto';
import { useModal } from '../../context/ModalContext';

const EditorWrapper = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  max-height: 100vh;
  flex: 1;
`;

type FlagEditorProps = {
  templateName: string;
  sides: number;
  layerColors: string[];
  setLayerColors: React.Dispatch<React.SetStateAction<string[]>>;
  customText: string;
  setCustomText: React.Dispatch<React.SetStateAction<string>>;
  fontFamily: string;
  setFontFamily: React.Dispatch<React.SetStateAction<string>>;
  textColor: string;
  setTextColor: React.Dispatch<React.SetStateAction<string>>;
  textPosition: { x: number; y: number };
  setTextPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  handleLoadSavedDesign: () => void;
};

const pastelPalette = [
  '#3B82F6', '#8B5CF6', '#F43F5E', '#FBBF24', '#10B981',
  '#F87171', '#60A5FA', '#F472B6', '#34D399', '#FB923C'
];

const FlagEditor = ({
  templateName,
  sides,
  layerColors,
  setLayerColors,
  customText,
  setCustomText,
  fontFamily,
  setFontFamily,
  textColor,
  setTextColor,
  textPosition,
  setTextPosition,
  handleLoadSavedDesign
}: FlagEditorProps) => {
  const { color, setColor } = useColor();
  const { isModalOpen } = useModal();

  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [lastSelectedTarget, setLastSelectedTarget] = useState<'layer' | 'text' | null>(null);

  const skipReset = useRef(false); // 👈 controla si evitamos reset

  useEffect(() => {
    if (skipReset.current) {
      skipReset.current = false;
      return;
    }

    const reset = () => {
      setLayerColors(Array(sides).fill(''));
      setSelectedLayer(sides);
      setColor('#000000');
      setCustomText('');
      setTextPosition({ x: 0.5, y: 0.5 });
      setLastSelectedTarget('layer');
      const shuffled = pastelPalette.sort(() => 0.5 - Math.random());
      setRecentColors(shuffled.slice(0, 5));
    };

    reset();
  }, [templateName, sides]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) return;

      if (!/^[1-9]$/.test(e.key)) return;
      const index = parseInt(e.key, 10) - 1;
      if (index < sides) {
        const updated = [...layerColors];
        updated[index] = color;
        setLayerColors(updated);
        updateRecentColors(color);
        setSelectedLayer(index);
        setLastSelectedTarget('layer');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [color, layerColors, sides, isModalOpen]);

  const applyColor = () => {
    if (lastSelectedTarget === 'text' && customText) {
      setTextColor(color);
      updateRecentColors(color);
      return;
    }

    if (lastSelectedTarget === 'layer' && selectedLayer !== null) {
      const updatedColors = [...layerColors];
      updatedColors[selectedLayer] = color;
      setLayerColors(updatedColors);
      updateRecentColors(color);
      return;
    }
  };

  const removeColor = () => {
    if (selectedLayer === null) return;
    const updatedColors = [...layerColors];
    updatedColors[selectedLayer] = 'transparent';
    setLayerColors(updatedColors);
  };

  const updateRecentColors = (newColor: string) => {
    setRecentColors((prev) => {
      const filtered = prev.filter((c) => c !== newColor);
      return [newColor, ...filtered].slice(0, 5);
    });
  };

  // ⚡ función expuesta para evitar el reset cuando se carga diseño
  useEffect(() => {
    const listener = () => {
      skipReset.current = true;
    };

    window.addEventListener('load-saved-design', listener);
    return () => window.removeEventListener('load-saved-design', listener);
  }, []);

  return (
    <EditorWrapper>
      <ColorPanel
        color={color}
        recentColors={recentColors}
        onColorChange={setColor}
        onRecentColorClick={setColor}
        openTextModal={() => {
          setIsTextModalOpen(true);
          setLastSelectedTarget('text');
        }}
        fontOptions={['Arial', 'Roboto', 'Courier New', 'Georgia']}
        selectedFont={selectedFont}
        onFontChange={(font: string) => {
          setSelectedFont(font);
          if (customText) setFontFamily(font);
        }}
      />

      <Container>
        <CanvasArea
          templateName={templateName}
          sides={sides}
          layerColors={layerColors}
          customText={customText}
          fontFamily={fontFamily}
          textColor={textColor}
          textPosition={textPosition}
          setTextPosition={setTextPosition}
          setLastSelectedTarget={setLastSelectedTarget}
        />

        <LayersControls
          sides={sides}
          selectedLayer={selectedLayer}
          setSelectedLayer={(i: number) => {
            setSelectedLayer(i);
            setLastSelectedTarget('layer');
          }}
          applyColor={applyColor}
          removeColor={removeColor}
          handleLoadSavedDesign={() => {
            // señal para evitar reset
            window.dispatchEvent(new Event('load-saved-design'));
            handleLoadSavedDesign();
          }}
        />
      </Container>

      {isTextModalOpen && (
        <ModalTexto
          onClose={() => setIsTextModalOpen(false)}
          initialText={customText}
          onSave={(text) => {
            setCustomText(text);
            setFontFamily(selectedFont);
            setLastSelectedTarget('text');
            setTextPosition({ x: 0.5, y: 0.5 });
          }}
        />
      )}
    </EditorWrapper>
  );
};

export default FlagEditor;
