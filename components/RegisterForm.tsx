// src/components/RegisterForm.tsx
import { useState } from 'react';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #2563eb;
  }
`;

const RegisterForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    nombreColegio: '',
    nombreCurso: '',
    email: '',
    password: '',
    cantidad: '',
    anioEgreso: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Paso 1: crear el usuario en tu DB
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
  
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || 'Error en el registro');
      return;
    }
  
    // Paso 2: login automático con NextAuth
    const signInRes = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });
  
    if (signInRes?.ok) {
      toast.success('¡Registro y login exitoso!');
      onClose();
    } else {
      toast.error('Registrado, pero falló el login.');
    }
  };
  

  return (
    <Form onSubmit={handleSubmit}>
      <Input name="nombreColegio" placeholder="Colegio" onChange={handleChange} required />
      <Input name="nombreCurso" placeholder="Curso" onChange={handleChange} required />
      <Input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <Input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
      <Input name="cantidad" type="number" placeholder="Cantidad de alumnos" onChange={handleChange} required />
      <Input name="anioEgreso" type="number" placeholder="Año de egreso" onChange={handleChange} required />
      <Button type="submit">Crear cuenta</Button>
    </Form>
  );
};

export default RegisterForm;
