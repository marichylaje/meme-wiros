import React, { useState, useEffect } from 'react';
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
};
  
const pastelPalette = [
    '#3B82F6', // azul eléctrico suave
    '#8B5CF6', // violeta vibrante
    '#F43F5E', // fucsia fuerte
    '#FBBF24', // amarillo dorado intenso
    '#10B981', // verde menta saturado
    '#F87171', // rosa chicle
    '#60A5FA', // celeste saturado
    '#F472B6', // rosa intenso
    '#34D399', // verde brillante
    '#FB923C', // naranja sunset
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
    setTextPosition
  }: FlagEditorProps) => {
    const { color, setColor } = useColor();
    const { isModalOpen } = useModal();

  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [lastSelectedTarget, setLastSelectedTarget] = useState<'layer' | 'text' | null>(null);

  useEffect(() => {
    setLayerColors(Array(sides).fill(''));
  
    setSelectedLayer(sides);
  
    setColor('#000000');
  
    setCustomText('');
    setTextPosition({ x: 0.5, y: 0.5 });
  
    setLastSelectedTarget('layer');
  
    const shuffled = pastelPalette.sort(() => 0.5 - Math.random());
    setRecentColors(shuffled.slice(0, 5));
  }, [templateName, sides]);
  

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) return; // 🚫 evita aplicar color si hay un modal abierto
  
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
    setRecentColors((prevColors) => {
      const withoutNewColor = prevColors.filter((c) => c !== newColor);
      return [newColor, ...withoutNewColor].slice(0, 5);
    });
  };

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
          setLastSelectedTarget={setLastSelectedTarget} // 👈 Ahora lo enviamos
        />

        <LayersControls
            sides={sides}
            selectedLayer={selectedLayer}
            setSelectedLayer={(index: number) => {
                setSelectedLayer(index);
                setLastSelectedTarget('layer');
            }}
            applyColor={applyColor}
            removeColor={removeColor}
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
