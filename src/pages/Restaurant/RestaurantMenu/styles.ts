import styled from "styled-components";

export const MainContainer = styled.div`
    width: 100%;
    // TODO ??
    // background-color: var(--color-bg-secondary);
    min-height: 100vh;
`;

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: top;
    padding-bottom: 9rem;
`;

export const HeaderContainer = styled.div`
    position: sticky;
    top: 0;
    z-index: 100;
    width: 100%;
`;

export const HeaderContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.8rem 2.2rem;
`;

export const HeaderTitle = styled.div`
    font-size: var(--font-size-2xl);
    font-family: var(--font-family-secondary);
    font-weight: var(--font-weight-normal);
    width: 5rem;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;    
    cursor: pointer;

    &:active {
        opacity: 0.5;
    }
`;

export const MenuContainer = styled.div`
    width: 92%;
    height: 100%;
    display: flex;
    margin: 0 0;
`;

export const MenuListBackground = styled.div`
    position: fixed;
    z-index: 3;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: var(--color-bg-dark);
    transform: translateX(-100%);
    animation: slideIn 0.5s forwards;

    @keyframes slideIn {
        from {
            transform: translateY(-100%);
        }
        to {
            transform: translateY(0);
        }
    }

    &.closing {
        animation: slideOut 0.5s forwards;
    }

    @keyframes slideOut {
        from {
            transform: translateY(0);
        }
        to {
            transform: translateY(-100%);
        }
    }
        
    @media (min-width: 1024px) {
        width: 40%;
        left: 30%;
        right: 30%;
    }
`;

export const MenuListContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (orientation: landscape) and (max-width: 768px) {
        height: 70vh;
    }

    @media (min-width: 1024px) {
        width: 40%;
        left: 30%;
        right: 30%;
    }
`;

export const MenuList = styled.div`
    display: flex;
    gap: 1.3rem;
    flex-direction: column;
    animation: slideDown 0.6s ease-out;
    align-items: center;
    
    @keyframes slideDown {
        0% {
            opacity: 0;
            transform: translateY(-10px);
        }
        25% {
            opacity: 0;
            transform: translateY(-10px);
        }
        50% {
            opacity: 0.5;
            transform: translateY(-5px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    &.closing {
        animation: slideUp 0.4s forwards;
    }

    @keyframes slideUp {
        0% {
            opacity: 1;
            transform: translateY(0);
        }
        40% {
            opacity: 0.25;
            transform: translateY(-5px);
        }
        60% {
            opacity: 0;
            transform: translateY(-10px);
        }
        100% {
            opacity: 0;
            transform: translateY(-10px);
        }
    }

    @media (min-width: 768px) {
        gap: 2rem;
    }
`;

export const Menu = styled.div`
    font-size: var(--font-size-xl);
    font-family: var(--font-family-secondary);
    font-weight: var(--font-weight-normal);
    cursor: pointer;
`;