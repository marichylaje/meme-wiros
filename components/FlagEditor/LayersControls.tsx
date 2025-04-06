import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/router'
import Button from '../ui/Button';

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const LayerButton = styled.button<{ selected: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: 2px solid ${(props) => (props.selected ? '#3b82f6' : '#ccc')};
  background-color: ${(props) => (props.selected ? '#bfdbfe' : '#f3f4f6')};
  cursor: pointer;
  font-weight: 500;
`;

const LayersControls = ({
    sides,
    selectedLayer,
    setSelectedLayer,
    applyColor,
    removeColor,
    handleLoadSavedDesign,
  }: any) => {
    const { isAuthenticated } = useAuth()
const [savedDesign, setSavedDesign] = useState<any>(null)

useEffect(() => {
  const fetchSavedDesign = async () => {
    const token = localStorage.getItem('token')
    if (!token || !isAuthenticated) return

    try {
      const res = await fetch('/api/design/get', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        setSavedDesign(data)
      }
    } catch (err) {
      console.error('Error al traer diseño guardado', err)
    }
  }

  fetchSavedDesign()
}, [isAuthenticated])

    return (
      <ButtonGroup>
        {Array.from({ length: sides }, (_, index) => (
          <Button
          key={index}
          onClick={() => setSelectedLayer(index)}
          style={{
            border: `2px solid ${selectedLayer === index ? '#3b82f6' : '#ccc'}`,
            backgroundColor: selectedLayer === index ? '#1f2937' : '#3b82f6',
          }}
        >
          Lado {index + 1}
        </Button>
        
        ))}
        <Button
          onClick={applyColor}
          disabled={selectedLayer === null}
          style={{background: '#10B981'}}
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
          <Button
            onClick={handleLoadSavedDesign}
          >
            Ver seleccionada
          </Button>
        )}

      </ButtonGroup>
    );
  };

  export default LayersControls