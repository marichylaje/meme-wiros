// pages/admin.tsx
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'
import CanvasArea from '../components/FlagEditor/CanvasArea'
import domtoimage from 'dom-to-image-more'
import { useRef } from 'react'
import ExportCanvas from '../components/FlagEditor/ExportCanvas'

const Wrapper = styled.div`
  padding: 2rem;
  padding-top: 6rem;
  background: #1f2937;
  min-height: 100vh;
  color: white;
`

const ButtonsBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`

const UserButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
`

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  font-weight: 500;

  &:hover {
    background-color: #2563eb;
  }
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`

const InfoBox = styled.div`
  background: #111827;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #374151;
`

const Label = styled.p`
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #9ca3af;
`

const Value = styled.p`
  font-size: 1rem;
  margin: 0;
`

const Badge = styled.span<{ color: string }>`
  background-color: ${(props) => props.color};
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
`

const SectionTitle = styled.h3`
  margin-top: 2rem;
  font-size: 1.25rem;
  border-bottom: 1px solid #374151;
  padding-bottom: 0.5rem;
`


const AdminPage = () => {
    const { user, isAuthenticated } = useAuth()
    const router = useRouter()

  const [users, setUsers] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const link = document.createElement('a');
    link.download = `bandera_${selectedUser.nombreColegio}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  

  useEffect(() => {
    if (!user?.admin || !isAuthenticated) {
      router.push('/') // 🔒 Redirigir si no es admin
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    fetch('/api/admin/all-users')
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setFiltered(data)
      })
  }, [])

  const showAll = () => setFiltered(users)

  const showCompleted = () =>
    setFiltered(users.filter(u => u.estado === 'HECHO'))
  
  const showPending = () =>
    setFiltered(users.filter(u => u.estado === 'POR_HACER'))

  return (
    <Wrapper>
      <Navbar />
      <h1>Panel de Admin</h1>

      <ButtonsBar>
        <Button onClick={showAll}>Todos los usuarios</Button>
        <Button onClick={showCompleted}>Usuarios finalizados</Button>
        <Button onClick={showPending}>Usuarios por hacer</Button>
      </ButtonsBar>

      <h3>Elegí un colegio:</h3>
      <UserButtons>
        {filtered.map((user) => (
          <Button
            key={user.id}
            onClick={() => setSelectedUser(user)}
          >
            {user.nombreColegio}
          </Button>
        ))}
      </UserButtons>

        {selectedUser && (
            <>
                <SectionTitle>Datos del usuario</SectionTitle>

                <InfoGrid>
                <InfoBox>
                    <Label>Email</Label>
                    <Value>{selectedUser.email}</Value>
                </InfoBox>
                <InfoBox>
                    <Label>Colegio</Label>
                    <Value>{selectedUser.nombreColegio}</Value>
                </InfoBox>
                <InfoBox>
                    <Label>Curso</Label>
                    <Value>{selectedUser.nombreCurso}</Value>
                </InfoBox>
                <InfoBox>
                    <Label>Cantidad de alumnos</Label>
                    <Value>{selectedUser.cantidad}</Value>
                </InfoBox>
                <InfoBox>
                    <Label>Numero de Telefono</Label>
                    <Value>{selectedUser.telefono}</Value>
                </InfoBox>
                <InfoBox>
                    <Label>Año de egreso</Label>
                    <Value>{selectedUser.anioEgreso}</Value>
                </InfoBox>
                <InfoBox>
                    <Label>Estado actual</Label>
                    <Value>
                    <Badge
                        color={
                        selectedUser.estado === 'ENTREGADO' ? '#10B981' :
                        selectedUser.estado === 'HECHO' ? '#3B82F6' :
                        selectedUser.estado === 'EN_PROCESO' ? '#F59E0B' :
                        '#EF4444'
                        }
                    >
                        {selectedUser.estado}
                    </Badge>
                    </Value>
                </InfoBox>
                <InfoBox>
                    <Label>Cambiar estado</Label>
                    <select
                    value={selectedUser.estado}
                    onChange={async (e) => {
                        const newEstado = e.target.value

                        const res = await fetch('/api/admin/update-estado', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: selectedUser.id, estado: newEstado }),
                        })

                        if (res.ok) {
                        setSelectedUser({ ...selectedUser, estado: newEstado })
                        setUsers((prev) =>
                            prev.map((u) =>
                            u.id === selectedUser.id ? { ...u, estado: newEstado } : u
                            )
                        )
                        setFiltered((prev) =>
                            prev.map((u) =>
                            u.id === selectedUser.id ? { ...u, estado: newEstado } : u
                            )
                        )
                        }
                    }}
                    style={{
                        padding: '0.5rem',
                        borderRadius: '6px',
                        marginTop: '0.25rem',
                        width: '100%',
                        background: '#1f2937',
                        color: 'white',
                        border: '1px solid #374151',
                    }}
                    >
                    <option value="POR_HACER">Por hacer</option>
                    <option value="EN_PROCESO">En proceso</option>
                    <option value="HECHO">Hecho</option>
                    <option value="ENTREGADO">Entregado</option>
                    </select>
                </InfoBox>
                <InfoBox>
                    <Label>Pagado</Label>
                    <input
                    type="checkbox"
                    checked={selectedUser.pagado}
                    onChange={async (e) => {
                        const newValue = e.target.checked
                        const res = await fetch('/api/admin/update-pago', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: selectedUser.id, pagado: newValue }),
                        })
                        if (res.ok) {
                        setSelectedUser({ ...selectedUser, pagado: newValue })
                        }
                    }}
                    />{' '}
                    <span>{selectedUser.pagado ? '✅ Pagado' : '❌ No pagado'}</span>
                </InfoBox>
                <InfoBox>
                    <Label>Seña (ARS)</Label>
                    <input
                    type="number"
                    value={selectedUser.senia}
                    onChange={async (e) => {
                        const newSenia = parseFloat(e.target.value || '0')
                        const res = await fetch('/api/admin/update-senia', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: selectedUser.id, senia: newSenia }),
                        })
                        if (res.ok) {
                        setSelectedUser({ ...selectedUser, senia: newSenia })
                        }
                    }}
                    style={{
                        padding: '0.5rem',
                        borderRadius: '6px',
                        marginTop: '0.25rem',
                        width: '90%',
                        background: '#1f2937',
                        color: 'white',
                        border: '1px solid #374151',
                    }}
                    />
                </InfoBox>
                </InfoGrid>
            </>
        )}
        {selectedUser?.design && (
          <div style={{ marginTop: '3rem' }}>
            <h2>Vista del diseño</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button onClick={handleDownload} style={{ backgroundColor: '#10B981' }}>
                Descargar PNG
              </Button>
            </div>

            <CanvasArea
                templateName={selectedUser.design.templateName}
                sides={JSON.parse(selectedUser.design.layerColors).length - 1}
                layerColors={JSON.parse(selectedUser.design.layerColors)}
                texts={(selectedUser.design.texts || '[]')}
                images={(selectedUser.design.images || '[]')}
                previewMode={true}
            />

            <ExportCanvas
              ref={canvasRef}
              templateName={selectedUser.design.templateName}
              sides={JSON.parse(selectedUser.design.layerColors).length - 1}
              layerColors={JSON.parse(selectedUser.design.layerColors)}
              texts={selectedUser.design.texts || []}
              images={selectedUser.design.images || []}
            />
          </div>
        )}


    </Wrapper>
  )
}

export default AdminPage
