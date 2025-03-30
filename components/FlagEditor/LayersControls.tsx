import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/router'

const ViewSavedButton = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: #2563eb;
  }
`

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

const ApplyButton = styled.button`
  background-color: #10b981;
  color: #fff;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
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
          <LayerButton
            key={index}
            selected={selectedLayer === index}
            onClick={() => setSelectedLayer(index)}
          >
            Lado {index + 1}
          </LayerButton>
        ))}
        <ApplyButton
          onClick={applyColor}
          disabled={selectedLayer === null}
        >
          Aplicar Color
        </ApplyButton>
  
        <ApplyButton
          onClick={removeColor}
          disabled={selectedLayer === null}
          style={{ backgroundColor: '#ef4444' }}
        >
          Eliminar Color
        </ApplyButton>
        {savedDesign && (
          <ViewSavedButton
            onClick={handleLoadSavedDesign}
          >
            Ver seleccionada
          </ViewSavedButton>
        )}

      </ButtonGroup>
    );
  };

  export default LayersControls