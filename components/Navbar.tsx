import styled from 'styled-components';
import { useUser } from '../context/UserContext';
import { useState } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #111827;
  padding: 1rem 2rem;
  color: #f9fafb;
  z-index: 1000;
  width: 95vw;
  position: fixed;
  left: 0;
  top: 0;
`;

const Brand = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #3b82f6;
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const Button = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2563eb;
  }
`;

const Navbar = () => {
  const { isLoggedIn, logout } = useUser();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <Nav>
        <Brand>FlagDesigner</Brand>
        <Menu>
          <a href="/about">Sobre Nosotros</a>

          {isLoggedIn ? (
            <Button onClick={logout}>Salir</Button>
          ) : (
            <>
              <Button onClick={() => setShowLogin(true)}>Ingresar</Button>
              <Button onClick={() => setShowRegister(true)}>Registrarse</Button>
            </>
          )}
        </Menu>
      </Nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </>
  );
};

export default Navbar;
