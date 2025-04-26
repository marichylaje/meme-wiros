// pages/login.tsx
import { useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { capitalizeFirstLetter } from '../utils/capitalize'

const Wrapper = styled.div`
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
`

const Button = styled.button`
  width: 100%;
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: #2563eb;
  }
`

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [capitalizeFirstLetter(name)]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
  
      const data = await res.json()
  
      if (!res.ok) {
        toast.error(data.error || 'Error al iniciar sesión')
        return
      }
  
      login(data.token)
  
      const decoded = JSON.parse(atob(data.token.split('.')[1])) // 👈 extraer payload
      toast.success('Sesión iniciada')
  
      // 🔁 Redirigir según sea admin o no
      if (decoded.admin) {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } catch (err) {
      toast.error('Error de red')
    }
  }
  

  return (
    <Wrapper>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <Input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <Input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
        <Button type="submit">Ingresar</Button>
      </form>
    </Wrapper>
  )
}
