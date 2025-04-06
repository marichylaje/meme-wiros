import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/router';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #111827;
  padding: 1rem 2rem;
  color: #f9fafb;
  z-index: 1000;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
`;


const Brand = styled.button`
  font-size: 1.5rem;
  font-weight: bold;
  color: #3b82f6;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const Nav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1130px;
  margin: auto;
`;


const Menu = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const isProfilePage = router.pathname === '/profile';

  console.log("NAV BAR")

  return (
    <>
      <NavContainer>
        <Nav>
          <Brand onClick={() => router.push('/')}>FlagDesigner</Brand>
          <Menu>
            <a href="/about">Sobre Nosotros</a>

            {isAuthenticated ? (
              <>
                {!isProfilePage && (
                  <Button onClick={() => router.push('/profile')}>Mi Perfil</Button>
                )}
                {isProfilePage && (
                  <Button onClick={() => router.push('/')}>Diseñar bandera</Button>
                )}
                <Button onClick={logout}>Salir</Button>
              </>
            ) : (
              <>
                <Button onClick={() => setShowLogin(true)}>Ingresar</Button>
                <Button onClick={() => setShowRegister(true)}>Registrarse</Button>
              </>
            )}
          </Menu>
        </Nav>
      </NavContainer>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </>
  );
};

export default Navbar;
