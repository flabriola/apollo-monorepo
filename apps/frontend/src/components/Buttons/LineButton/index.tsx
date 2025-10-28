import React, { useState } from 'react';
import { ButtonContainer, Line } from './styles';

interface LineButtonProps {
    onClick?: () => void;
    isOpen?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export const LineButton: React.FC<LineButtonProps> = ({ 
  onClick, 
  isOpen: controlledIsOpen, 
  className,
  style
}) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isOpen = controlledIsOpen ?? uncontrolledIsOpen;

  const handleClick = () => {
    if (controlledIsOpen === undefined) {
      setUncontrolledIsOpen(!uncontrolledIsOpen);
    }
    onClick?.();
  };

  return (
    <ButtonContainer 
      onClick={handleClick} 
      isOpen={isOpen}
      className={className}
      style={style}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <Line isOpen={isOpen} />
      <Line isOpen={isOpen} />
    </ButtonContainer>
  );
};

export default LineButton;