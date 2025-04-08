import React, { useEffect } from 'react';
import styled from 'styled-components';
import RegisterForm from './RegisterForm';
import { useModal } from '../context/ModalContext';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
`;

const ModalContent = styled.div`
  background-color: #1f2937;
  padding: 2rem;
  border-radius: 12px;
  width: 450px;
  max-width: 90vw;
  color: white;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  color: white;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
`;

const RegisterModal = ({ onClose }: { onClose: () => void }) => {
  const { setIsModalOpen } = useModal();
  useEffect(() => {
    setIsModalOpen(true);
    return () => setIsModalOpen(false);
  }, []);
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2 style={{ marginBottom: '1rem' }}>Crear cuenta</h2>
        <RegisterForm onClose={onClose} />
      </ModalContent>
    </ModalOverlay>
  );
};

export default RegisterModal;
