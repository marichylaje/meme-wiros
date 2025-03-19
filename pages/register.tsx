import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

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
  background-color: #10b981;
  color: white;
  padding: 0.75rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: #059669;
  }
`;

export default function Register() {
    const router = useRouter();
  
    const [formData, setFormData] = useState({
      nombreColegio: '',
      nombreCurso: '',
      email: '',
      password: '',
    });
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        const res = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
  
        const data = await res.json();
        console.log(data);
  
        if (res.ok) {
          alert('Registro exitoso!');
          router.push('/login'); // Redirige al login después de registrar
        } else {
          alert(data.message || 'Error en el registro');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Layout>
      <FormWrapper>
        <h2>Crear Usuario</h2>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="nombreColegio"
            placeholder="Nombre del colegio"
            value={formData.nombreColegio}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="nombreCurso"
            placeholder="Nombre del curso"
            value={formData.nombreCurso}
            onChange={handleChange}
            required
          />
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
          <Button type="submit">Crear cuenta</Button>
        </form>
      </FormWrapper>
    </Layout>
  );
}
