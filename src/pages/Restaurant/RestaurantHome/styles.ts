import styled from "styled-components";

export const MainContainer = styled.div`
    display: flex;
    height: 100vh;
    background-color: var(--color-bg-primary);
    align-items: center;
    justify-content: center;
    
    @media (orientation: landscape) and (max-width: 768px) {
        height: 70vh;
    }
`;

export const Container = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr auto;
    padding-right: 2.5rem;
    align-items: center;

    @media (min-width: 768px) and (max-width: 1024px) {
        width: 70%;
    }
`;

export const RightContainer = styled.div`
    display: flex;
    gap: 0.7rem;
    justify-content: left;
    flex: auto;
    align-items: center;

        
    @media (min-width: 768px) {
        justify-content: right;
    }
`;

export const LeftContainer = styled.div`
    display: flex;
    justify-content: center;
    flex: auto;
    align-items: center;
`;

export const RestaurantLogo = styled.img`
    max-width: 50%;
    max-height: 4rem;

    @media (min-width: 768px) {
        max-width: 100%;
        max-height: 4rem;
    }
`;

export const Text = styled.div`
    font-size: var(--font-size-3xl);
    font-family: var(--font-family-primary);
    font-weight: var(--font-weight-normal);

    @media (min-width: 768px) and (max-width: 1024px) {
        font-size: var(--font-size-4xl);
    }
`;

export const MenuListBackground = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: var(--color-bg-dark);
    transform: translateX(-100%);
    animation: slideIn 0.5s forwards;

    @keyframes slideIn {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(0);
        }
    }

    &.closing {
        animation: slideOut 0.5s forwards;
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(-100%);
        }
    }
`;

export const MenuListContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;

    @media (orientation: landscape) and (max-width: 768px) {
        height: 70vh;
    }
`;

export const MenuList = styled.div`
    margin-left: 2.2rem;
    display: flex;
    gap: 1.3rem;
    flex-direction: column;
    animation: fadeIn 0.4s forwards;

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    &.closing {
        animation: fadeOut 0.3s forwards;
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;

export const Menu = styled.div`
    font-size: var(--font-size-xl);
    font-family: var(--font-family-secondary);
    font-weight: var(--font-weight-normal);
`;