// ✅ CanvasArea.tsx corregido
import React from 'react';
import styled from 'styled-components';
import TextOverlay from './TextOverlay';

const AspectRatioBox = styled.div`
  position: relative;
  max-height: 50vh;
  width: 80%;
  margin: auto;
  height: 100%;
  aspect-ratio: 2700 / 2100;
  background-color: #eee;
  overflow: hidden;
  border: 2px solid #ccc;
`;

const MaskedLayer = styled.div<{ zIndex: number; color: string; $maskUrl: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${(props) => props.zIndex};
  background-color: ${(props) => props.color};
  mask-image: url(${(props) => props.$maskUrl});
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
  -webkit-mask-image: url(${(props) => props.$maskUrl});
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
`;

type CanvasAreaProps = {
  templateName: string;
  sides: number;
  layerColors: string[];
  texts: {
    id: string;
    text: string;
    color: string;
    fontFamily: string;
    fontSize: number;
    filled: boolean;
    position: { x: number; y: number };
  }[];
  setTexts: React.Dispatch<React.SetStateAction<any[]>>;
  selectedTextId: string | null;
  setSelectedTextId: (id: string) => void;
  setLastSelectedTarget: (target: 'text' | 'layer') => void;
};

const CanvasArea = ({
  templateName,
  sides,
  layerColors,
  texts,
  setTexts,
  selectedTextId,
  setSelectedTextId,
  setLastSelectedTarget,
}: CanvasAreaProps) => {
  const fullimgColor = layerColors[sides];

  return (
    <AspectRatioBox>
      {Array.from({ length: sides }, (_, index) => {
        const layerColor = layerColors[index];
        if (!layerColor || layerColor.trim() === '' || layerColor === 'transparent') return null;
        return (
          <MaskedLayer
            key={index}
            zIndex={index + 1}
            color={layerColor}
            $maskUrl={`/templates/${templateName}/img${index + 1}.png`}
          />
        );
      })}

      {fullimgColor && fullimgColor.trim() !== '' && (
        <MaskedLayer
          zIndex={sides + 1}
          color={fullimgColor}
          $maskUrl={`/templates/${templateName}/fullimg.png`}
        />
      )}

      {texts.map((textObj) => (
        <TextOverlay
          key={textObj.id}
          text={textObj.text}
          position={textObj.position}
          setPosition={(pos) =>
            setTexts((prev) => prev.map((t) => t.id === textObj.id ? { ...t, position: pos } : t))
          }
          color={textObj.color}
          fontFamily={textObj.fontFamily}
          fontSize={textObj.fontSize}
          setFontSize={(size) =>
            setTexts((prev) => prev.map((t) => t.id === textObj.id ? { ...t, fontSize: size } : t))
          }
          filled={textObj.filled}
          setLastSelectedTarget={() => {
            setLastSelectedTarget('text');
            setSelectedTextId(textObj.id);
          }}
          selected={selectedTextId === textObj.id}
          onTextChange={(newText) =>
            setTexts((prev) => prev.map((t) => t.id === textObj.id ? { ...t, text: newText } : t))
          }
        />
      ))}
    </AspectRatioBox>
  );
};

export default CanvasArea;
