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

// Original
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

export const Container = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr auto;
    padding-right: 1.2rem;
    align-items: center;

    @media (min-width: 768px) and (max-width: 1024px) {
        width: 70%;
    }
`;

// Image container style
// export const LeftContainer = styled.div`
//     width: 60vw;
//     object-fit: cover;
//     overflow: hidden;
// `;

// export const RestaurantLogo = styled.img`
//     height: 100vh;
//     object-fit: cover;
//     overflow: hidden;
// `;

// export const Container = styled.div`
//     width: 100%;
//     height: 100%;
//     display: grid;
//     grid-template-columns: 1fr auto;
//     padding-right: 1.2rem;
//     align-items: center;

//     @media (min-width: 768px) and (max-width: 1024px) {
//         width: 70%;
//     }
// `;
// Image container style

export const Text = styled.div`
    font-size: var(--font-size-3xl);
    font-family: var(--font-family-primary);
    font-weight: var(--font-weight-normal);

    background-color: transparent;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    @media (min-width: 768px) and (max-width: 1024px) {
        font-size: var(--font-size-4xl);
    }
`;

export const MenuListBackgroundHome = styled.div`
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: var(--color-bg-dark);
    transform: translateX(-100%);
    animation: slideInHome 0.5s forwards;

    @keyframes slideInHome {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(0);
        }
    }

    &.closing {
        animation: slideOutHome 0.5s forwards;
    }

    @keyframes slideOutHome {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(-100%);
        }
    }
`;

export const MenuListContainerHome = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;

    @media (orientation: landscape) and (max-width: 768px) {
        height: 70vh;
    }
`;

export const MenuListHome = styled.div`
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
    cursor: pointer;
    background-color: transparent;
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &:active {
        color: var(--color-text-secondary);
    }
`;


// New Design

export const Restaurant= styled.img`
    width: 90%;
    object-fit: cover;
    overflow: hidden;
    @media (min-width: 768px) {
        width: 75%;
    }
`;

export const MenuTitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
`;

export const ContainerN = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    height: 70%;
    gap: 1.5rem;
    margin-top: 1rem;
    width: 100%;

    @media (min-width: 768px) and (max-width: 1024px) {
        gap: 2rem;   
        height: 78%;
        margin-top: 2rem;
    }

    @media (min-width: 1024px) {
        height: 75%;
        margin-top: 2rem;
    }
    
`;

export const MainContainerN = styled.div`
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    height: 100vh;
`;


export const MenuListHomeN = styled.div`
    display: flex;
    align-items: center;
    gap: 1.3rem;
    flex-direction: column;
    animation: fadeIn 0.6s forwards;

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

    @media (min-width: 768px) {
        gap: 1.9rem;
    }
`;

export const MenuListContainerHomeN = styled.div`
    z-index: 4;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (orientation: landscape) and (max-width: 768px) {
        height: 70vh;
    }

    @media (min-width: 768px) {
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
    }
`;

export const MenuListBackgroundHomeN = styled.div`
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: var(--color-bg-dark);
    transform: translateY(100%);
    animation: slideInHome 0.5s forwards;

    @keyframes slideInHome {
        from {
            transform: translateY(100%);
        }
        to {
            transform: translateY(0);
        }
    }

    &.closing {
        animation: slideOutHome 0.5s forwards;
    }

    @keyframes slideOutHome {
        from {
            transform: translateY(0);
        }
        to {
            transform: translateY(100%);
        }
    }

    @media (min-width: 1024px) {
        width: 40%;
        left: 25%;
        right: 25%;
        margin: 0 auto;
    }
`;