import styled from 'styled-components';
import CanvasArea from './FlagEditor/CanvasArea';
import { maxHeaderSize } from 'http';

const PreviewContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
`;

const PreviewBox = styled.div`
  position: relative;
  width: auto;
  height: 300px;
  aspect-ratio: 2700 / 2100;
  overflow: hidden;
`;

const LayerImage = styled.img<{ zIndex: number; opacity?: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 300px;
  object-fit: contain;
  z-index: ${(props) => props.zIndex};
  opacity: ${(props) => props.opacity ?? 1};
`;

type PreviewSectionProps = {
  templateName: string;
  layerColors: string[];
  texts: {
    id: string;
    text: string;
    color: string;
    fontFamily: string;
    fontSize: number;
    filled: boolean;
    strokeWidth: number;
    position: { x: number; y: number };
  }[];
  images: {
    id: string;
    src: string;
    position: { x: number; y: number };
    size: number;
    color: string;
  }[];
};

const PreviewSection = ({
  templateName,
  layerColors,
  texts,
  images,
}: PreviewSectionProps) => {
  const previews = ['A', 'B', 'C'];

  return (
    <div style={{ marginBottom: '3rem' }}>
      <h2 style={{ textAlign: 'center', color: 'white' }}>Vista previa</h2>
      <PreviewContainer>
        {previews.map((letter, key) => (
          <PreviewBox key={letter}>
            {/* 1️⃣ Fondo visible del wiro */}
            <LayerImage
              src={`/wiros/wiro${letter}Visible.png`}
              alt={`wiro${letter}`}
              zIndex={1}
              style={{ left: key === 0 ? '40px' : '84px' }}
            />
            <CanvasArea
              templateName={templateName}
              sides={layerColors.length - 1}
              layerColors={layerColors}
              texts={texts}
              images={images}
              previewMode={true}
              style={{
                left: key === 0 ? '115px' : key === 1 ? '-15px' : '-160px',
                top: key === 0 ? '-5px' : '5px',
                maxHeight: key === 0 ? '310px' : '290px',
              }}
            />
            {/* 5️⃣ Capa superior invisible (marco wiro) */}
            <LayerImage
              src={`/wiros/wiro${letter}Invisible.png`}
              alt={`overlay${letter}`}
              zIndex={12}
            />
          </PreviewBox>
        ))}
      </PreviewContainer>
    </div>
  );
};

export default PreviewSection;
