// pages/profile.tsx
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import PreviewSection from '../components/PreviewSection';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { capitalizeFirstLetter } from '../utils/capitalize';

const Container = styled.div`
  max-width: 900px;
  margin: 6rem auto 2rem;
  padding: 6rem 2rem 2rem; // 👈 esto asegura espacio para el navbar
  border-radius: 12px;
`;

const FormWrapper = styled.div`
  background-color: #1e293b; /* fondo dark */
  padding: 2rem;
  border-radius: 12px;
  margin-top: 2rem;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #f1f5f9;
`;

const Input = styled.input<{ $editing?: boolean }>`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #94a3b8;
  background-color: ${(props) => (props.$editing ? '#0f172a' : '#0f172a')};
  color: #f8fafc;
  transition: all 0.2s ease;
  font-size: 1rem;

  &:disabled {
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button<{ variant?: 'cancel' | 'delete' }>`
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  background-color: ${(props) =>
    props.variant === 'cancel'
      ? '#e5e7eb'
      : props.variant === 'delete'
      ? '#ef4444'
      : '#3b82f6'};

  color: ${(props) =>
    props.variant === 'cancel' ? '#1f2937' : '#ffffff'};

  &:hover {
    background-color: ${(props) =>
      props.variant === 'cancel'
        ? '#f3f4f6'
        : props.variant === 'delete'
        ? '#dc2626'
        : '#2563eb'};
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: white;
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

    if (!formData.nombreColegio || !formData.telefono) {
      toast.error('Completá todos los campos requeridos');
      return;
    }

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
    // Asegura que layerColors siempre sea un array válido
  const parsedLayerColors = Array.isArray(design?.layerColors)
    ? design.layerColors
    : typeof design?.layerColors === 'string'
    ? JSON.parse(design.layerColors)
    : [];


  if (!formData) return null;

  return (
    <>
      <Container>
        <Navbar />
        <Title>Mi Perfil</Title>

        {design && (
          <PreviewSection
            templateName={capitalizeFirstLetter(design.templateName)}
            texts={design.texts || []}
            images={design.images || []}
            layerColors={parsedLayerColors} 
          />
        )}

      <FormWrapper>
        <StyledForm>
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
              $editing={editing}
            />
          </FieldGroup>

          <FieldGroup>
            <Label>Curso</Label>
            <Input
              name="nombreCurso"
              value={formData.nombreCurso}
              onChange={handleChange}
              disabled={!editing}
              $editing={editing}
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
              $editing={editing}
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
              $editing={editing}
            />
          </FieldGroup>

          <FieldGroup>
            <Label>Numero de Telefono</Label>
            <Input
              type="number"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              disabled={!editing}
              $editing={editing}
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
                  <Button type="button" onClick={() => setEditing(true)}>Modificar</Button>
                  <Button type="button" data-variant="delete" onClick={handleDeleteAccount} style={{ backgroundColor: '#ef4444' }}>
                      Eliminar cuenta
                      </Button>
                  </>
              )}
              </ButtonRow>
            </StyledForm>
          </FormWrapper>
      </Container>
    </>
  );
};

export default ProfilePage;
