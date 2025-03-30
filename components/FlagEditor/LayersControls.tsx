import React from 'react';
import styled from 'styled-components';

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
  }: any) => {
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
      </ButtonGroup>
    );
  };

  export default LayersControls