import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  border-radius: 1rem;
  max-height: 250px;
  max-width: 90%;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding: 1rem;
  background: #0f172a;
  border-bottom: 2px solid #334155;
  width: 100%;
  border: 3px solid black;
`;

const ShieldImage = styled.img`
  height: 150px;
  margin-right: 1rem;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

type GalleryProps = {
  onImageSelect: (src: string) => void;
};

const Gallery = ({ onImageSelect }: GalleryProps) => {
  const shieldCount = 10;
  const shields = Array.from({ length: 10 }, (_, i) => `/shields/shield${i + 1}.png`);

  console.log({shields})

  return (
    <Wrapper>
      {shields.map((src) => (
        <ShieldImage
          key={src}
          src={src}
          alt="shield"
          draggable
          onDoubleClick={() => onImageSelect(src)}
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', src);
          }}
        />
      ))}
    </Wrapper>
  );
};

export default Gallery;
