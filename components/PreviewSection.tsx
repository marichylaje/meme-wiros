// src/components/PreviewSection.tsx
import styled from 'styled-components';
import CanvasArea from './FlagEditor/CanvasArea';

const PreviewContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  max-width: 900px;
  margin-top: 2rem;
  margin-left: auto;
  margin-right: auto;

  > :last-child {
    padding-right: 1rem;
  }
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

const StyledCanvasArea = styled(CanvasArea)`
  > div {
    opacity: 0.9;
  }
  > div:not(.imgWrapper) {
    opacity: 0.7;
  }
`;

type PreviewSectionProps = {
  templateName: string;
  layerColors: string[]; // 👈 agregar
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
  texts,
  images,
  layerColors
}: PreviewSectionProps) => {
  const previews = ['A', 'B', 'C'];
  return (
    <div style={{ marginBottom: '3rem', marginRight: '2rem' }}>
      <h2 style={{ textAlign: 'center', color: 'white' }}>Vista previa</h2>
      <PreviewContainer>
        {previews.map((letter, key) => (
          <PreviewBox key={letter}>
            <LayerImage
              src={`/wiros/wiro${letter}Visible.png`}
              alt={`wiro${letter}`}
              zIndex={1}
              style={{ left: key === 0 ? '40px' : '84px' }}
            />
            <StyledCanvasArea
              templateName={templateName}
              sides={layerColors.length}
              layerColors={layerColors}
              texts={texts}
              images={images}
              previewMode={true}
              style={{
                left: key === 0 ? '95px' : key === 1 ? '-25px' : '-120px',
                top: key === 0 ? '-15px' : '-15px',
                maxHeight: key === 0 ? '320px' : '310px',
              }}
            />
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
