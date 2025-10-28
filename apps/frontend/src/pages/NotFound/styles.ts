import styled from 'styled-components';

export const NotFoundContainer = styled.div`
    background-color: var(--color-bg-secondary);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    
    @media screen and (orientation: landscape) and (max-height: 450px) {
        height: 70vh;
    }
`;

export const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 80%;
`;

export const Title = styled.div`
    font-family: var(--font-family-secondary);
    text-align: center;
    font-size: ${window.innerWidth > 480 ? 'var(--font-size-5xl)' : 'var(--font-size-4xl)'};
`;

export const Subtitle = styled.div`
    font-family: var(--font-family-secondary);
    font-size: ${window.innerWidth > 480 ? 'var(--font-size-lg)' : 'var(--font-size-sm)'};
    text-align: center;
`;

export const TextButtonContainer = styled.div`
    position: fixed;
    bottom: 0;
    margin: ${window.innerWidth > 480 ? '2.5rem' : '0.7rem'} auto;
    font-size: ${window.innerWidth > 480 ? 'var(--font-size-lg)' : ''};
`;