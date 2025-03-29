import { useState } from 'react';
import styled from 'styled-components';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const Submit = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #2563eb;
  }
`;

const Error = styled.div`
  color: #f87171;
  font-size: 0.9rem;
`;

const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      toast.success('Sesión iniciada');
      onSuccess();
    } else {
      setError('Credenciales inválidas');
      toast.error('Error al iniciar sesión');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <Error>{error}</Error>}
      <Submit type="submit">Ingresar</Submit>
    </Form>
  );
};

export default LoginForm;
