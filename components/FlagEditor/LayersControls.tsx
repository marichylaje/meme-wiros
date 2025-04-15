import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

type LayersControlsProps = {
  sides: number;
  selectedLayer: number | null;
  setSelectedLayer: (i: number | null) => void;
  applyColor: () => void;
  removeColor: () => void;
  handleLoadSavedDesign: () => void;
  layerColors: string[]; // 👈 nuevo
  selectedImageId: string | null;
  applyColorToImage: () => void;
};

const LayersControls = ({
  sides,
  selectedLayer,
  setSelectedLayer,
  applyColor,
  removeColor,
  handleLoadSavedDesign,
  selectedImageId,
  applyColorToImage,
  layerColors,
}: LayersControlsProps) => {
  const { isAuthenticated } = useAuth();
  const [savedDesign, setSavedDesign] = useState<any>(null);

  useEffect(() => {
    const fetchSavedDesign = async () => {
      const token = localStorage.getItem('token');
      if (!token || !isAuthenticated) return;

      try {
        const res = await fetch('/api/design/get', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setSavedDesign(data);
        }
      } catch (err) {
        console.error('Error al traer diseño guardado', err);
      }
    };

    fetchSavedDesign();
  }, [isAuthenticated]);

  const canApplyColor = selectedLayer !== null || !!selectedImageId;

  return (
    <ButtonGroup>
      {Array.from({ length: sides }, (_, index) => {
        const color = layerColors[index] || '#3b82f6'; // fallback azul

        return (
          <Button
            key={index}
            onClick={() => setSelectedLayer(index)}
            style={{
              border: `2px solid ${selectedLayer === index ? '#3b82f6' : '#ccc'}`,
              backgroundColor: color,
              color: '#fff',
              textShadow: '2px 2px 1px #000', // 👈 bordecito negro
            }}
          >
            Lado {index + 1}
          </Button>
        );
      })}

      <Button
        onClick={() => {
          if (selectedLayer !== null) applyColor();
          else if (selectedImageId) applyColorToImage();
        }}
        disabled={!canApplyColor}
        style={{ background: '#10B981' }}
      >
        Aplicar Color
      </Button>

      <Button
        onClick={removeColor}
        disabled={selectedLayer === null}
        style={{ backgroundColor: '#ef4444' }}
      >
        Eliminar Color
      </Button>

      {savedDesign && (
        <Button onClick={handleLoadSavedDesign}>
          Cargar diseño guardado
        </Button>
      )}
    </ButtonGroup>
  );
};

export default LayersControls;
