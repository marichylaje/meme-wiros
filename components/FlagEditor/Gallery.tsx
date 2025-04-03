// ✅ Gallery.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const ScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding: 1rem;
  background-color: #111827;
  max-height: 250px;
  border-bottom: 2px solid #374151;
  width: 100%;
`;

const ShieldItem = styled.img`
  height: 200px;
  cursor: pointer;
  border-radius: 8px;
  transition: transform 0.2s;
  user-select: none;

  &:hover {
    transform: scale(1.05);
  }
`;

const Gallery = () => {
  const [shields, setShields] = useState<string[]>([]);

  useEffect(() => {
    const loadShields = async () => {
      const imported: string[] = [];
      for (let i = 1; i <= 20; i++) {
        try {
          const path = `/shields/shield${i}.png`;
          const res = await fetch(path, { method: 'HEAD' });
          if (res.ok) imported.push(path);
        } catch (err) {
          break;
        }
      }
      setShields(imported);
    };
    loadShields();
  }, []);

  const handleDoubleClick = (src: string) => {
    // TODO: insertar imagen en el canvas
    alert(`Doble click en imagen: ${src}`);
  };

  return (
    <ScrollContainer>
      {shields.map((src, index) => (
        <ShieldItem
          key={index}
          src={src}
          draggable
          onDoubleClick={() => handleDoubleClick(src)}
          title={`shield${index + 1}`}
        />
      ))}
    </ScrollContainer>
  );
};

export default Gallery;
