import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TemplatesList from '../components/TemplatesList';
import PreviewSection from '../components/PreviewSection';
import FlagEditor from '../components/FlagEditor';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { getSession, useSession } from 'next-auth/react';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #1f2937;
`;

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1200px;
  margin: auto;
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1;
  color: #f9fafb;
  overflow: hidden;
  margin-top: 50px;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: auto;
`;

const SidebarRight = styled.div`
  width: 300px;
  padding: 1rem;
  background-color: #111827;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const SelectButton = styled.button`
  margin: 2rem auto 1rem;
  padding: 1rem 2rem;
  background-color: #10b981;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #059669;
  }
`;

const HomePage = () => {
  console.log("version 0.2")
  const { data: session, status } = useSession();
  const [templates, setTemplates] = useState<{ name: string; preview: string; sides: number }[]>([]);
  const [currentTemplateName, setCurrentTemplateName] = useState('');
  const [currentSides, setCurrentSides] = useState(0);
  const [layerColors, setLayerColors] = useState<string[]>([]);
  const [customText, setCustomText] = useState('');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [textPosition, setTextPosition] = useState({ x: 0.5, y: 0.5 }); // relativo

  useEffect(() => {
    const fetchTemplates = async () => {
      const res = await fetch('/api/templates');
      const data = await res.json();

      const templatesWithPreviews = data.map((t: any) => ({
        ...t,
        preview: `/templates/${t.name}/example.png`,
      }));

      setTemplates(templatesWithPreviews);

      if (templatesWithPreviews.length > 0) {
        setCurrentTemplateName(templatesWithPreviews[0].name);
        setCurrentSides(templatesWithPreviews[0].sides);
      }
    };

    fetchTemplates();
  }, []);

  const handleTemplateChange = (templateName: string) => {
    const selectedTemplate = templates.find((t) => t.name === templateName);
    if (!selectedTemplate) return;

    setCurrentTemplateName(selectedTemplate.name);
    setCurrentSides(selectedTemplate.sides);
  };

  const handleSubmitDesign = async () => {
    if (!session || !session.user?.id) {
      toast.error("Debes iniciar sesión para guardar el diseño.");
      return;
    }
  
    try {
      const res = await fetch('/api/design/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          colegioId: session.user.id,
          templateName: currentTemplateName,
          layerColors,
          customText,
          textColor,
          textPosition,
          fontFamily,
        }),
      });
  
      if (res.ok) {
        toast.success('Diseño guardado con éxito');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Error al guardar el diseño');
      }
    } catch (err) {
      toast.error('Error de conexión al servidor');
    }
  };
  

  return (
    <PageWrapper>
      <AppWrapper>
        <Navbar />
        <MainContainer>
          <Content>
            <FlagEditor
              templateName={currentTemplateName}
              sides={currentSides}
              layerColors={layerColors}
              setLayerColors={setLayerColors}
              customText={customText}
              setCustomText={setCustomText}
              fontFamily={fontFamily}
              setFontFamily={setFontFamily}
              textColor={textColor}
              setTextColor={setTextColor}
              textPosition={textPosition}
              setTextPosition={setTextPosition}
            />

            <PreviewSection
              templateName={currentTemplateName}
              layerColors={layerColors}
              customText={customText}
              fontFamily={fontFamily}
              textColor={textColor}
              textPosition={textPosition}
            />

            <SelectButton onClick={handleSubmitDesign}>SELECCIONAR DISEÑO</SelectButton>
          </Content>

          <SidebarRight>
            <TemplatesList
              templates={templates}
              currentTemplate={currentTemplateName}
              onTemplateChange={handleTemplateChange}
            />
          </SidebarRight>
        </MainContainer>
      </AppWrapper>
    </PageWrapper>
  );
};

export default HomePage;
