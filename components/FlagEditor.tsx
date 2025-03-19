import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useColor } from '../context/ColorContext';

type TemplateInfo = {
  name: string;
  sides: number;
};

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const AspectRatioBox = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 2700 / 2100;
  background-color: #eee;
  overflow: hidden;
  border: 2px solid #ccc;
`;

const MaskedLayer = styled.div<{ zIndex: number; color: string; maskUrl: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${(props) => props.zIndex};

  background-color: ${(props) => props.color};

  mask-image: url(${(props) => props.maskUrl});
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;

  -webkit-mask-image: url(${(props) => props.maskUrl});
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const LayerButton = styled.button<{ selected: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 2px solid ${(props) => (props.selected ? '#3b82f6' : '#ccc')};
  background-color: ${(props) => (props.selected ? '#bfdbfe' : '#f3f4f6')};
  cursor: pointer;
`;

const FullOverlayLayer = styled.div<{ maskUrl: string }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 50000;

    background-color: black;

    mask-image: url(${(props) => props.maskUrl});
    mask-repeat: no-repeat;
    mask-position: center;
    mask-size: contain;

    -webkit-mask-image: url(${(props) => props.maskUrl});
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    -webkit-mask-size: contain;
`;

const TemplateButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 2px solid ${(props) => (props.active ? '#10b981' : '#ccc')};
  background-color: ${(props) => (props.active ? '#6ee7b7' : '#f3f4f6')};
  color: ${(props) => (props.active ? '#065f46' : '#374151')};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.active ? '#34d399' : '#e5e7eb')};
  }
`;


const FlagEditor = () => {
  const { color } = useColor();

  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState<number>(0);
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const [layerColors, setLayerColors] = useState<string[]>([]);

  const currentTemplate = templates[currentTemplateIndex];

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('/api/templates');
        const data: TemplateInfo[] = await res.json();
        setTemplates(data);

        // Setear colores iniciales para el primer template
        if (data.length > 0) {
          setLayerColors(Array(data[0].sides).fill('white'));
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplates();
  }, []);

  const handleTemplateChange = (index: number) => {
    setCurrentTemplateIndex(index);
    setLayerColors(Array(templates[index].sides).fill('white'));
    setSelectedLayer(null);
  };

  const applyColorToLayer = () => {
    if (selectedLayer === null) return;

    const updatedColors = [...layerColors];
    updatedColors[selectedLayer] = color;
    setLayerColors(updatedColors);
  };

  if (templates.length === 0) {
    return <div>Cargando templates...</div>;
  }

  return (
    <Container>
      <ButtonGroup>
        {templates.map((template, index) => (
          <TemplateButton
            key={template.name}
            active={index === currentTemplateIndex}
            onClick={() => handleTemplateChange(index)}
          >
            {template.name}
          </TemplateButton>
        ))}
      </ButtonGroup>

      <AspectRatioBox>
        {Array.from({ length: currentTemplate.sides }, (_, index) => (
          <MaskedLayer
            key={index}
            zIndex={index + 1}
            color={layerColors[index]}
            maskUrl={`/templates/${currentTemplate.name}/img${index + 1}.png`}
          />
        ))}

        <FullOverlayLayer
          maskUrl={`/templates/${currentTemplate.name}/fullimg.png`}
        />
      </AspectRatioBox>

      <ButtonGroup>
        {Array.from({ length: currentTemplate.sides }, (_, index) => (
          <LayerButton
            key={index}
            selected={selectedLayer === index}
            onClick={() => setSelectedLayer(index)}
          >
            Lado {index + 1}
          </LayerButton>
        ))}
      </ButtonGroup>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button
          onClick={applyColorToLayer}
          disabled={selectedLayer === null}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: selectedLayer !== null ? '#10b981' : '#ccc',
            color: 'white',
            borderRadius: '4px',
            cursor: selectedLayer !== null ? 'pointer' : 'not-allowed',
          }}
        >
          Aplicar Color
        </button>
      </div>
    </Container>
  );
};

export default FlagEditor;
