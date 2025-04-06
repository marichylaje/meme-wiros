// components/ui/ColorButton.tsx
import styled from 'styled-components';

const ColorButton = styled.button<{ color: string }>`
  width: 40px;
  height: 40px;
  background-color: ${(props) => props.color};
  border: 2px solid #fff;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

export default ColorButton;
