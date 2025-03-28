import React, { useState } from 'react';
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

const CanvasArea = ({
  templateName,
  sides,
  layerColors,
  customText,
  fontFamily,
  textColor,
  textPosition,
  setTextPosition,
  setLastSelectedTarget
}: any) => {
    const fullimgColor = layerColors[sides]; // index extra
    console.log({fullimgColor})
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
        {customText && (
            <TextOverlay
                text={customText}
                position={textPosition}
                setPosition={setTextPosition}
                color={textColor}
                fontFamily={fontFamily}
                setLastSelectedTarget={setLastSelectedTarget}
                />

        )}
    </AspectRatioBox>
  );
};

export default CanvasArea;
