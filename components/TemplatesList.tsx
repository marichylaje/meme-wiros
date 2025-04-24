import styled from 'styled-components';

const TemplateButton = styled.button<{ active: boolean }>`
  width: 100%;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 2px solid ${(props) => (props.active ? '#10b981' : '#374151')};
  background-color: ${(props) => (props.active ? '#064e3b' : '#1f2937')};
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;

  &:hover {
    border-color: #10b981;
  }

  img {
    width: 100%;
    height: auto;
    display: block;
  }

  span {
    display: block;
    padding: 0.5rem;
    text-align: center;
    font-weight: 500;
    color: #f9fafb;
    font-size: 0.875rem;
  }
`;

type TemplatesListProps = {
  templates: { name: string; preview: string }[];
  currentTemplate: string;
  onTemplateChange: (name: string) => void;
};

const TemplatesList = ({ templates, currentTemplate, onTemplateChange }: TemplatesListProps) => {
  return (
    <>
      <h2 style={{ marginBottom: '1rem', color: '#f9fafb' }}>Templates</h2>
      {[...templates]
        .sort((a, b) => {
          const getNumber = (str: string) => {
            const match = str.match(/\d+/); // busca el primer número
            return match ? parseInt(match[0], 10) : Infinity; // sin número = va al final
          };

          return getNumber(a.name) - getNumber(b.name);
        })
        .map((template) => (
          <TemplateButton
            key={template.name}
            active={currentTemplate === template.name}
            onClick={() => onTemplateChange(template.name)}
          >
            <img src={template.preview} alt={template.name} />
            <span>{template.name}</span>
          </TemplateButton>
      ))}
    </>
  );
};

export default TemplatesList;
