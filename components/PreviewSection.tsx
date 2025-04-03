import styled from 'styled-components';

const PreviewContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
`;

const PreviewBox = styled.div`
  position: relative;
  width: 200px;
  aspect-ratio: 2700 / 2100;
  border: 2px solid #374151;
  border-radius: 8px;
  overflow: hidden;
  background-color: #111827;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
`;

// Las mismas capas que el editor, pero para previews
const PreviewLayer = styled.div<{ zIndex: number; color: string; $maskUrl: string }>`
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

const PreviewFrameOverlay = styled.img`
  position: absolute;
  top: 158px;
  left: 50%;
  width: 850px; // o lo que necesites exactamente
  height: 245px;
  transform: translate(-50%, -50%);
  z-index: 20;
  pointer-events: none;
`;

const PreviewFullLayer = styled.div<{ color: string; $maskUrl: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
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


type PreviewSectionProps = {
    templateName: string;
    layerColors: string[];
    customText: string;
    fontFamily: string;
    textColor: string;
    textPosition: { x: number; y: number };
  };
  

const PreviewSection = ({ templateName, layerColors, customText, fontFamily, textColor, textPosition }: PreviewSectionProps) => {
    console.log({customText})
  return (
    <div style={{position: 'relative', marginBottom: '100px'}}>
      <h2 style={{ textAlign: 'center', color: 'black', position: 'relative', paddingTop: '15px', top: '15px', zIndex: 999 }}>Vista previa</h2>
      <PreviewFrameOverlay src="/vista-previa.png" alt="Vista previa marco" />
      <PreviewContainer>
        {[1, 2, 3].map((i) => (
            <PreviewBox key={i}>
                {Array.from({ length: layerColors.length }, (_, index) => (
                    <PreviewLayer
                        key={index}
                        zIndex={index + 1}
                        color={layerColors[index]}
                        $maskUrl={`/templates/${templateName}/img${index + 1}.png`}
                    />
                ))}
                {customText && (
                    <div
                        style={{
                            position: 'absolute',
                            top: `${textPosition.y * 100}%`,
                            left: `${textPosition.x * 100}%`,
                            transform: 'translate(-50%, -50%)',
                            color: textColor,
                            fontFamily,
                            fontSize: '18px',
                            textAlign: 'center',
                            zIndex: 15,
                            pointerEvents: 'none',
                            userSelect: 'none',
                            whiteSpace: 'nowrap',
                        }}
                        >
                            {customText}
                    </div>
                )}

            </PreviewBox>
            
        ))}
      </PreviewContainer>
    </div>
  );
};

export default PreviewSection;
