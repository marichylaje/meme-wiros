import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const ModalContent = styled.div`
  background: #1f2937;
  padding: 2rem;
  border-radius: 12px;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: white;
`;

const ModalTexto = ({
  onClose,
  onSave,
  initialText = '',
}: {
  onClose: () => void;
  onSave: (text: string) => void;
  initialText?: string;
}) => {
  const [text, setText] = useState('');

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleSave = () => {
    if (!text.trim()) return;
    onSave(text);
    onClose();
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Editar texto</h2>

        <input
          type="text"
          placeholder="Texto..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button onClick={handleSave} style={{ color: 'black', backgroundColor: '#10b981' }}> //3b82f6
          Aceptar
        </button>
        <button onClick={onClose} style={{ color: 'black', backgroundColor: '#ef4444' }}>
          Cancelar
        </button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ModalTexto;
