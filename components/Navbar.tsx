import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #1f2937;
  color: white;
`;

const Title = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button<{ variant: 'login' | 'register' | 'profile' }>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  ${(props) => {
    switch (props.variant) {
      case 'login':
        return `
          background-color: #3b82f6;
          &:hover { background-color: #2563eb; }
        `;
      case 'register':
        return `
          background-color: #10b981;
          &:hover { background-color: #059669; }
        `;
      case 'profile':
        return `
          background-color: #8b5cf6;
          &:hover { background-color: #7c3aed; }
        `;
      default:
        return '';
    }
  }}
`;

const Navbar = () => {
    const router = useRouter();
    const { isLoggedIn, logout } = useUser();
    console.log({isLoggedIn})
  
    return (
      <Nav>
        <Title onClick={() => router.push('/')}>Meme Wiros</Title>
        <ButtonGroup>
          {!isLoggedIn ? (
            <>
              <Button variant="login" onClick={() => router.push('/login')}>
                Iniciar sesión
              </Button>
              <Button variant="register" onClick={() => router.push('/register')}>
                Crear usuario
              </Button>
            </>
          ) : (
            <>
              <Button variant="profile" onClick={() => router.push('/perfil')}>
                Perfil
              </Button>
              <Button variant="login" onClick={logout}>
                Cerrar sesión
              </Button>
            </>
          )}
        </ButtonGroup>
      </Nav>
    );
  };
  
  export default Navbar;