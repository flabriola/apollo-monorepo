import styled from "styled-components";

export const MainContainer = styled.div`
    position: fixed;    
    bottom: 7.5rem;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    animation: dd1 0.8s cubic-bezier(0.34, 0, 0.17, 1);
    -webkit-tap-highlight-color: transparent;

    @keyframes dd1 {
        from {
            transform: translateY(180%);
        }
        to {
            transform: translateY(0);
        }
    }

    &.closing {
        animation: dd2 1s cubic-bezier(0.34, 0, 0.17, 1) forwards;
    }

    @keyframes dd2 {
        from {
            transform: translateY(0);
        }
        to {
            transform: translateY(200%);
        }
    }

    @media (min-width: 768px) {
        bottom: 12rem;
    }
`;

export const BackgroundBlur = styled.div`
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.01);
    backdrop-filter: var(--material-light-overlay-blur);
    -webkit-backdrop-filter: var(--material-light-overlay-webkit-blur);

    animation: dd3 0.7s ease-in-out;

    @keyframes dd3 {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    &.closing {
        animation: dd4 0.7s ease-in-out forwards;
    }

    @keyframes dd4 {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;

export const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;
    background-color: var(--material-light-background);
    backdrop-filter: var(--material-light-background-blur);
    -webkit-backdrop-filter: var(--material-light-background-webkit-blur);
    padding: 1.3rem;
    width: 75%;
    border-radius: 8px;
    gap: 0.6rem;
    display: flex;
    justify-content: center;
    -webkit-tap-highlight-color: transparent;
    
    @media (min-width: 768px) and (max-width: 1024px) {
        width: 50%;
    }

    @media (min-width: 1024px) {
        width: 20%;
    }
`;

export const Text = styled.div`
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-normal);
    font-family: var(--font-family-secondary);
    display: flex;
    flex-direction: rows;
    gap: 0.5rem;

    -webkit-tap-highlight-color: transparent;

    @keyframes dd5 {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }

    &.closing {
        animation: dd5 0.3s ease-in-out forwards;
    }
`;

export const Close = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    z-index: 10000;
    height: 100vh;
    width: 100vw;
    background-color: red;
    -webkit-tap-highlight-color: transparent;
    opacity: 0;
    
`;