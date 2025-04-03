// ✅ FlagEditor.tsx
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

type TextElement = {
  id: string;
  text: string;
  fontFamily: string;
  color: string;
  fontSize: number;
  filled: boolean;
  position: { x: number; y: number };
};


type FlagEditorProps = {
  templateName: string;
  sides: number;
  layerColors: string[];
  setLayerColors: React.Dispatch<React.SetStateAction<string[]>>;
  handleLoadSavedDesign: () => void;
};

const pastelPalette = ['#3B82F6', '#8B5CF6', '#F43F5E', '#FBBF24', '#10B981', '#F87171', '#60A5FA', '#F472B6', '#34D399', '#FB923C'];

const FlagEditor = ({ templateName, sides, layerColors, setLayerColors, handleLoadSavedDesign }: FlagEditorProps) => {
  const { color, setColor } = useColor();
  const { isModalOpen } = useModal();

  const [texts, setTexts] = useState<TextElement[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [lastSelectedTarget, setLastSelectedTarget] = useState<'layer' | 'text' | null>(null);

  const skipReset = useRef(false);

  useEffect(() => {
    if (skipReset.current) {
      skipReset.current = false;
      return;
    }

    const reset = () => {
      // Generar N + 1 colores random (los sides y el fullimg)
      const shuffled = pastelPalette.sort(() => 0.5 - Math.random());
      const recent = shuffled.slice(0, 5);
      const fullPalette = [...recent]; // usamos los mismos
    
      const generated = Array.from({ length: sides + 1 }, (_, i) => {
        return fullPalette[i % fullPalette.length];
      });
    
      setLayerColors(generated); // ✅ aplicar todos los colores iniciales
      setSelectedLayer(0);       // ✅ seleccionar Lado 1
      setLastSelectedTarget('layer');
      setTexts([]);
      setSelectedTextId(null);
    
      setRecentColors(recent);
    
      if (recent.length > 0) setColor(recent[0]); // ✅ color activo listo
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
    if (lastSelectedTarget === 'text' && selectedTextId) {
      setTexts((prev) => prev.map((t) => t.id === selectedTextId ? { ...t, color } : t));
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
    if (lastSelectedTarget === 'text' && selectedTextId) {
      setTexts((prev) =>
        prev.map((t) =>
          t.id === selectedTextId ? { ...t, color: 'transparent' } : t
        )
      );
      return;
    }
  
    if (selectedLayer === null) return;
    const updatedColors = [...layerColors];
    updatedColors[selectedLayer] = 'transparent';
    setLayerColors(updatedColors);
  };
  

  const updateRecentColors = (newColor: string) => {
    setRecentColors((prev) => [newColor, ...prev.filter((c) => c !== newColor)].slice(0, 5));
  };

  const addNewText = () => {
    const newText: TextElement = {
      id: crypto.randomUUID(),
      text: 'Nuevo texto',
      fontFamily: selectedFont,
      color,
      fontSize: 24, // Tamaño por defecto
      filled: true, // O false si querés que empiece con contorno
      position: { x: 0.5, y: 0.5 },
    };
    setTexts([...texts, newText]);
    setSelectedTextId(newText.id);
    setLastSelectedTarget('text');
  };
  

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
        fontOptions={['Arial', 'Roboto', 'Courier New', 'Georgia']}
        selectedFont={selectedFont}
        onAddText={addNewText}
        onFontChange={(font: string) => {
          setSelectedFont(font);
          if (selectedTextId) {
            setTexts((prev) => prev.map((t) => t.id === selectedTextId ? { ...t, fontFamily: font } : t));
          }
        }}
        onToggleFilled={() => {
          if (!selectedTextId) return;
          setTexts((prev) =>
            prev.map((t) =>
              t.id === selectedTextId ? { ...t, filled: !t.filled } : t
            )
          );
        }}
      />

      <Container>
        <CanvasArea
          templateName={templateName}
          sides={sides}
          layerColors={layerColors}
          texts={texts}
          setTexts={setTexts}
          selectedTextId={selectedTextId}
          setSelectedTextId={setSelectedTextId}
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
            window.dispatchEvent(new Event('load-saved-design'));
            handleLoadSavedDesign();
          }}
        />
      </Container>

      {isTextModalOpen && (
        <ModalTexto
          onClose={() => setIsTextModalOpen(false)}
          initialText={selectedTextId ? texts.find((t) => t.id === selectedTextId)?.text || '' : ''}
          onSave={(text) => {
            if (!selectedTextId) return;
            setTexts((prev) => prev.map((t) => t.id === selectedTextId ? { ...t, text } : t));
          }}
        />
      )}
    </EditorWrapper>
  );
};

export default FlagEditor;
