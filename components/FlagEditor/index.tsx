// ✅ FlagEditor.tsx limpio e integrado con Gallery
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useColor } from '../../context/ColorContext';
import ColorPanel from './ColorPanel';
import CanvasArea from './CanvasArea';
import LayersControls from './LayersControls';
import ModalTexto from './ModalTexto';
import Gallery from './Gallery';
import { useModal } from '../../context/ModalContext';

const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding-right: 30px;
`;

const CanvasWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
`;

type TextElement = {
  id: string;
  text: string;
  fontFamily: string;
  color: string;
  fontSize: number;
  filled: boolean;
  strokeWidth: number;
  position: { x: number; y: number };
};


type ImageElement = {
  id: string;
  src: string;
  position: { x: number; y: number };
  size: number;
  color: string;
};

type FlagEditorProps = {
  templateName: string;
  sides: number;
  layerColors: string[];
  setLayerColors: React.Dispatch<React.SetStateAction<string[]>>;
  handleLoadSavedDesign: () => void;

  texts: TextElement[];
  setTexts: React.Dispatch<React.SetStateAction<TextElement[]>>;
  images: ImageElement[];
  setImages: React.Dispatch<React.SetStateAction<ImageElement[]>>;
};


const pastelPalette = ['#3B82F6', '#8B5CF6', '#F43F5E', '#FBBF24', '#10B981', '#F87171', '#60A5FA', '#F472B6', '#34D399', '#FB923C'];

const FlagEditor = ({ 
  templateName,
  sides,
  layerColors,
  setLayerColors,
  handleLoadSavedDesign,
  texts,
  setTexts,
  images,
  setImages
}: FlagEditorProps) => {
  const { color, setColor } = useColor();
  const { isModalOpen } = useModal();

  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [lastSelectedTarget, setLastSelectedTarget] = useState<'layer' | 'text' | 'image' | null>(null);

  const skipReset = useRef(false);

  useEffect(() => {
    if (skipReset.current) {
      skipReset.current = false;
      return;
    }

    const reset = () => {
      const shuffled = pastelPalette.sort(() => 0.5 - Math.random());
      const recent = shuffled.slice(0, 5);
      const fullPalette = [...recent];
      const generated = Array.from({ length: sides + 1 }, (_, i) => fullPalette[i % fullPalette.length]);
      setLayerColors(generated);
      setSelectedLayer(0);
      setLastSelectedTarget('layer');
      setTexts([]);
      setImages([]);
      setSelectedTextId(null);
      setRecentColors(recent);
      if (recent.length > 0) setColor(recent[0]);
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
      setTexts((prev) => prev.map((t) => t.id === selectedTextId ? { ...t, color: 'transparent' } : t));
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
      fontSize: 24,
      filled: true,
      strokeWidth: 2, // valor inicial por defecto
      position: { x: 0.5, y: 0.5 },
    };
    setTexts([...texts, newText]);
    setSelectedTextId(newText.id);
    setLastSelectedTarget('text');
  };
  

  const addNewImage = (src: string) => {
    const newImage: ImageElement = {
      id: crypto.randomUUID(),
      src,
      position: { x: 0.5, y: 0.5 },
      size: 100,
      color: '#000',
    };
    setImages((prev) => [...prev, newImage]);
    setLastSelectedTarget('image');
  };

  useEffect(() => {
    const listener = () => {
      skipReset.current = true;
    };
    window.addEventListener('load-saved-design', listener);
    return () => window.removeEventListener('load-saved-design', listener);
  }, []);

  const selectedText = texts.find((t) => t.id === selectedTextId);
  const selectedFilled = selectedText?.filled ?? true;
  const selectedStrokeWidth = selectedText?.strokeWidth ?? 1;


  return (
    <EditorWrapper>
      <Gallery onImageSelect={addNewImage} />

      <Container>
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
              setTexts((prev) =>
                prev.map((t) => t.id === selectedTextId ? { ...t, fontFamily: font } : t)
              );
            }
          }}
          onToggleFilled={() => {
            if (!selectedTextId) return;
            setTexts((prev) =>
              prev.map((t) => t.id === selectedTextId ? { ...t, filled: !t.filled } : t)
            );
          }}
          filled={selectedFilled}
          strokeWidth={selectedStrokeWidth}
          onStrokeWidthChange={(val) => {
            if (!selectedTextId) return;
            setTexts((prev) =>
              prev.map((t) => t.id === selectedTextId ? { ...t, strokeWidth: val } : t)
            );
          }}
        />


        <CanvasWrapper>
          <CanvasArea
            templateName={templateName}
            sides={sides}
            layerColors={layerColors}
            texts={texts}
            setTexts={setTexts}
            selectedTextId={selectedTextId}
            setSelectedTextId={setSelectedTextId}
            setLastSelectedTarget={setLastSelectedTarget}
            images={images}
            setImages={setImages}
            previewMode={false}
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
        </CanvasWrapper>
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
