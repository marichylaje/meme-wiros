import { useState } from 'react'
import styled from 'styled-components'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
`

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
`

const RegisterForm = ({ onClose }: { onClose: () => void }) => {
  const { login } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombreColegio: '',
    nombreCurso: '',
    email: '',
    password: '',
    cantidad: '',
    anioEgreso: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    const data = await res.json()

    if (res.ok) {
      login(data.token) // auto-login
      toast.success('Cuenta creada y sesión iniciada')
      onClose()
      router.push('/')
    } else {
      toast.error(data.error || 'Error al registrar')
    }
  }

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
  )
}

export default RegisterForm
