// src/context/ModalContext.tsx
import { createContext, useContext, useState } from 'react';

type ModalContextType = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
};

const ModalContext = createContext<ModalContextType>({
  isModalOpen: false,
  setIsModalOpen: () => {},
});

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ isModalOpen, setIsModalOpen }}>
      {children}
    </ModalContext.Provider>
  );
};
