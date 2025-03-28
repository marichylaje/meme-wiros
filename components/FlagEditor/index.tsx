import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useColor } from '../../context/ColorContext';

import ColorPanel from './ColorPanel';
import CanvasArea from './CanvasArea';
import LayersControls from './LayersControls';
import ModalTexto from './ModalTexto';

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
    '#A5F3FC', // celeste claro
    '#C4B5FD', // lila suave
    '#BBF7D0', // verde menta
    '#FBCFE8', // rosado suave
    '#FDE68A', // amarillo pastel
    '#FCD34D', // mostaza claro
    '#E0E7FF', // lavanda
    '#FCA5A5', // coral
    '#D9F99D', // lima suave
    '#FDE2E4'  // rosita empolvado
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

  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [lastSelectedTarget, setLastSelectedTarget] = useState<'layer' | 'text' | null>(null);

  useEffect(() => {
    setLayerColors(Array(sides));
    setSelectedLayer(null);
    setCustomText('');
    setTextPosition({ x: .5, y: .5 });
    setLastSelectedTarget('layer');

    const shuffled = pastelPalette.sort(() => 0.5 - Math.random());
  setRecentColors(shuffled.slice(0, 5));
  }, [templateName, sides]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Acepta solo del 1 al 9
      if (!/^[1-9]$/.test(e.key)) return;
  
      const index = parseInt(e.key, 10) - 1;
  
      // Si existe ese layer
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
  }, [color, layerColors, sides]);
  

  const applyColor = () => {
    if (lastSelectedTarget === 'text' && customText) {
      console.log('Aplicando color al texto:', color);
      setTextColor(color);
      updateRecentColors(color);
      return;
    }
  
    if (lastSelectedTarget === 'layer' && selectedLayer !== null) {
      console.log('Aplicando color al layer:', selectedLayer, color);
      const updatedColors = [...layerColors];
      updatedColors[selectedLayer] = color;
      setLayerColors(updatedColors);
      updateRecentColors(color);
      return;
    }
  
    console.log('No hay un target seleccionado.');
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

  const applyMetalBorders = () => {
    const updatedColors = [...layerColors];
    updatedColors[sides] = '#9CA3AF'; // gris metálico
    setLayerColors(updatedColors);
    updateRecentColors('#9CA3AF');
    setLastSelectedTarget('layer');
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
            applyMetalBorders={applyMetalBorders}
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
