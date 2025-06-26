import styled from "styled-components";

export const ButtonContainer = styled.button<{ isOpen: boolean }>`
    width: 30px;
    height: 30px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 6px;
    position: relative;

    &:focus {
        outline: none;
        background-color: none;
    }

    -webkit-tap-highlight-color: transparent;
`;

export const Line = styled.div<{ isOpen: boolean }>`
    width: 14px;
    height: 1.2px;
    background-color: #000;
    transition: all 0.3s ease-in-out;
    transform-origin: center;
    border-radius: 10px;

    &:first-child {
        transform: ${({ isOpen }) => isOpen ? 'translateY(4px) rotate(45deg)' : 'none'};
    }

    &:last-child {
        transform: ${({ isOpen }) => isOpen ? 'translateY(-3px) rotate(-45deg)' : 'none'};
    }
`;