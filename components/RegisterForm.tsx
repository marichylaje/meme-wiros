import { useState } from "react";
import styled from "styled-components";
import toast from "react-hot-toast";
import { useUser } from "../context/UserContext";

const currentYear = new Date().getFullYear();

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #374151;
  border-radius: 8px;
  background-color: #1e293b;
  color: #f9fafb;
  font-size: 1rem;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: 2px solid #3b82f6;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2563eb;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #f87171;
  font-weight: bold;
  align-self: flex-end;
  font-size: 1.1rem;
  cursor: pointer;
`;

type Props = {
  onClose: () => void;
};

const RegisterForm = ({ onClose }: Props) => {
  const [formData, setFormData] = useState({
    nombreColegio: "",
    nombreCurso: "",
    email: "",
    password: "",
    cantidad: "",
    anioEgreso: "",
  });
  const { login } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const { email, cantidad, anioEgreso } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) return "Email inválido";
    if (isNaN(+cantidad) || +cantidad < 5 || +cantidad > 50) return "Cantidad fuera de rango (5–50)";
    if (isNaN(+anioEgreso) || +anioEgreso <= currentYear) return "Año de egreso debe ser mayor al actual";

    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Curso registrado exitosamente");
        const data = await res.json();
        toast.success("Curso registrado exitosamente");
        
        // guardar token y loguear
        if (data.token) login(data.token);
        onClose(); // Cerramos modal si todo ok
      } else {
        const data = await res.json();
        toast.error(data.error || "Error en el registro");
      }
    } catch (err) {
      toast.error("Error al conectar con el servidor");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <CloseButton type="button" onClick={onClose}>×</CloseButton>

      <Input name="nombreColegio" placeholder="Colegio" onChange={handleChange} required />
      <Input name="nombreCurso" placeholder="Curso" onChange={handleChange} required />
      <Input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <Input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
      <Input name="cantidad" type="number" placeholder="Cantidad de alumnos" onChange={handleChange} required />
      <Input name="anioEgreso" type="number" placeholder="Año de egreso" onChange={handleChange} required />

      <Button type="submit">Registrar curso</Button>
    </Form>
  );
};

export default RegisterForm;
