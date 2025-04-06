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

const PreviewLayer = styled.div<{ zIndex: number; color: string; $maskUrl: string }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: ${(props) => props.zIndex};
  background-color: ${(props) => props.color};
  opacity: 0.2;

  mask-image: url(${(props) => props.$maskUrl});
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;

  -webkit-mask-image: url(${(props) => props.$maskUrl});
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
`;

const FlagText = styled.div<{
  x: number;
  y: number;
  color: string;
  fontFamily: string;
}>`
  position: absolute;
  top: ${(props) => props.y * 100}%;
  left: ${(props) => props.x * 100}%;
  transform: translate(-50%, -50%);
  color: ${(props) => props.color};
  font-family: ${(props) => props.fontFamily};
  font-size: 18px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 20;
  opacity: 0.2;
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
                left: key === 0 ? '115px' : key === 1 ? '25px' : '-85px',
                top: '35px',
                maxHeight: '230px',
              }}
            />
            {/* 5️⃣ Capa superior invisible (marco wiro) */}
            <LayerImage
              src={`/wiros/wiro${letter}Invisible.png`}
              alt={`overlay${letter}`}
              zIndex={999999999}
            />
          </PreviewBox>
        ))}
      </PreviewContainer>
    </div>
  );
};

export default PreviewSection;
