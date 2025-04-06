// components/ui/Button.tsx
import styled from 'styled-components';

const Button = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: .75rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #94a3b8;
    cursor: not-allowed;
  }
`;

export default Button;
