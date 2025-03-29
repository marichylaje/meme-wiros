import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';

const FormWrapper = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 100%;
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: #2563eb;
  }
`;

const ErrorMsg = styled.p`
  color: #dc2626;
  font-weight: bold;
  text-align: center;
`;

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.ok) {
      router.push('/');
    } else {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <Layout>
      <FormWrapper>
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <Button type="submit">Iniciar sesión</Button>
        </form>
      </FormWrapper>
    </Layout>
  );
}
