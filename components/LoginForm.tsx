import { useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
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
  border: none;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #2563eb;
  }
`

const Error = styled.div`
  color: #f87171;
  font-size: 0.9rem;
`

const LoginForm = () => {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (res.ok) {
      login(data.token)
      toast.success('Sesión iniciada')
      router.push('/')
    } else {
      setError(data.error || 'Error al iniciar sesión')
      toast.error(data.error || 'Error')
    }
  }

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
      <Button type="submit">Iniciar sesión</Button>
    </Form>
  )
}

export default LoginForm
