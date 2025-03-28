import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TemplatesList from '../components/TemplatesList';
import PreviewSection from '../components/PreviewSection';
import styled from 'styled-components';
import FlagEditor from '../components/FlagEditor';

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

const HomePage = () => {
  const [templates, setTemplates] = useState<{ name: string; preview: string; sides: number }[]>([]);
  const [currentTemplateName, setCurrentTemplateName] = useState('');
  const [currentSides, setCurrentSides] = useState(0);
  const [layerColors, setLayerColors] = useState<string[]>([]);
  const [customText, setCustomText] = useState('');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [textPosition, setTextPosition] = useState({ x: 150, y: 150 });

  useEffect(() => {
    const fetchTemplates = async () => {
      const res = await fetch('/api/templates');
      const data = await res.json();

      const templatesWithPreviews = data.map((t: any) => ({
        ...t,
        preview: `/templates/${t.name}/borders.png`,
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
