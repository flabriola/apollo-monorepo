import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;


export const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    animation: ${fadeIn} 0.2s ease-in forwards;
    background-color: var(--color-bg-primary);

    &.fade-out {
        animation: ${fadeOut} 0.2s ease-out forwards;
    }
    
    @media screen and (orientation: landscape) and (max-height: 450px) {
        height: 70vh;
    }
`;

export const LoadingFooter = styled.div`
    position: fixed;
    display: grid;
    grid-template-columns: 1.2fr 0fr 1.8fr;
    justify-content: center;
    align-items: center;
    bottom: 0;
    width: 68%;
    height: 4rem;
    gap: 0.9rem;
    background-color: transparent;
    cursor: pointer;

    @media (max-height: 450px) and (orientation: landscape) {
        width: 40%;
    }

    @media (min-width: 768px) {
        width: 40%;
        margin-bottom: 1.8rem;
    }

    @media (min-width: 1024px) {
        width: 25%;
        margin-bottom: 1rem;
    }
`;

export const Text = styled.div`
    font-family: var(--font-family-secondary);
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-medium);
    color: var(--color-primary);
    text-align: center;

    @media (min-width: 768px) {
        font-size: var(--font-size-2xl);
    }

    @media (min-width: 1024px) {
        font-size: var(--font-size-2xl);
    }
`;

export const TextContainer = styled.div`
    width: 90%;
    text-align: center;
    word-wrap: break-word;
`;