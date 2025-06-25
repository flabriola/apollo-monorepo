import styled from "styled-components";

export const MainContainer = styled.div`
    position: fixed;    
    bottom: 6rem;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    animation: showUp 1.2s cubic-bezier(0.34, 0, 0.17, 1);
    -webkit-tap-highlight-color: transparent;

    @keyframes showUp {
        from {
            transform: translateY(140%);
        }
        to {
            transform: translateY(0);
        }
    }

    &.closing {
        animation: pd1 0.7s cubic-bezier(0.34, 0, 0.17, 1) forwards;
    }

    @keyframes pd1 {
        from {
            transform: translateY(0);
        }
        to {
            transform: translateY(140%);
        }
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
    background-color: var(--material-light-overlay);
    backdrop-filter: var(--material-light-overlay-blur);
    -webkit-backdrop-filter: var(--material-light-overlay-webkit-blur);
    z-index: 0;

    animation: pd2 0.7s ease-in-out;

    @keyframes pd2 {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    &.closing {
        animation: pd3 0.7s ease-in-out forwards;
    }

    @keyframes pd3 {
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
    width: 70%;
    border-radius: 8px;
    gap: 1.3rem;
    display: flex;
    justify-content: center;
    -webkit-tap-highlight-color: transparent;
`;

export const Text = styled.div`
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-normal);
    font-family: var(--font-family-secondary);\

    -webkit-tap-highlight-color: transparent;

    @keyframes pd4 {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }

    &.closing {
        animation: pd4 0.3s ease-in-out forwards;
    }
`;