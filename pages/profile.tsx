// pages/profile.tsx
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import PreviewSection from '../components/PreviewSection';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

const Container = styled.div`
  max-width: 800px;
  margin: 6rem auto 2rem;
  padding: 6rem 2rem 2rem; // 👈 esto asegura espacio para el navbar
  background: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const FieldGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  background-color: #3b82f6;
  color: white;

  &:hover {
    background-color: #2563eb;
  }

  &[data-variant='cancel'] {
    background-color: #e5e7eb;
    color: #1f2937;
  }
`;

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<any>(null);
  const [originalData, setOriginalData] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [design, setDesign] = useState<any>(null);
  const router = useRouter() // dentro del componente

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('¿Estás seguro que querés eliminar tu cuenta? Esta acción no se puede deshacer.')
    if (!confirmed) return
  
    const token = localStorage.getItem('token')
    if (!token) return
  
    try {
      const res = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
  
      if (res.ok) {
        toast.success('Cuenta eliminada con éxito')
        localStorage.removeItem('token')
        router.push('/')
        location.reload()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Error al eliminar la cuenta')
      }
    } catch (err) {
      toast.error('Error de red al intentar eliminar la cuenta')
    }
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setFormData(data);
        setOriginalData(data);
        if (data.design) setDesign(data.design);
      }
    };

    if (isAuthenticated) fetchUserProfile();
  }, [isAuthenticated]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch('/api/user/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast.success('Perfil actualizado');
      setEditing(false);
      setOriginalData(formData);
    } else {
      toast.error('Error al actualizar perfil');
    }
  };

  if (!formData) return null;

  return (
    <>
      <Container>
        <Navbar />
        <Title>Mi Perfil</Title>

        {design && (
          <PreviewSection
            templateName={design.templateName}
            layerColors={JSON.parse(design.layerColors)}
            customText={design.customText}
            fontFamily={design.fontFamily}
            textColor={design.textColor}
            textPosition={JSON.parse(design.textPosition)}
          />
        )}

        <form>
          <FieldGroup>
            <Label>Email</Label>
            <Input value={formData.email} disabled />
          </FieldGroup>

          <FieldGroup>
            <Label>Colegio</Label>
            <Input
              name="nombreColegio"
              value={formData.nombreColegio}
              onChange={handleChange}
              disabled={!editing}
            />
          </FieldGroup>

          <FieldGroup>
            <Label>Curso</Label>
            <Input
              name="nombreCurso"
              value={formData.nombreCurso}
              onChange={handleChange}
              disabled={!editing}
            />
          </FieldGroup>

          <FieldGroup>
            <Label>Cantidad de alumnos</Label>
            <Input
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              disabled={!editing}
            />
          </FieldGroup>

          <FieldGroup>
            <Label>Año de egreso</Label>
            <Input
              type="number"
              name="anioEgreso"
              value={formData.anioEgreso}
              onChange={handleChange}
              disabled={!editing}
            />
          </FieldGroup>

          <ButtonRow>
              {editing ? (
                  <>
                  <Button
                      type="button"
                      data-variant="cancel"
                      onClick={() => {
                      setFormData(originalData);
                      setEditing(false);
                      }}
                  >
                      Cancelar
                  </Button>
                  <Button
                      type="button"
                      onClick={handleUpdate}
                  >
                      Guardar cambios
                  </Button>
                  </>
              ) : (
                  <>
                      <Button onClick={() => setEditing(true)}>Modificar</Button>
                      <Button data-variant="delete" onClick={handleDeleteAccount} style={{ backgroundColor: '#ef4444' }}>
                      Eliminar cuenta
                      </Button>
                  </>
              )}
              </ButtonRow>

        </form>
      </Container>
    </>
  );
};

export default ProfilePage;
