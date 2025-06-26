import styled from "styled-components";

// TODO: Change for tablet and destop
export const MainContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
    z-index: 2;

    
    @media (min-width: 768px) {
        margin-bottom: 4.2rem;
        width: 26rem;
        left: 50%;
        transform: translateX(-50%);
    }
`;

// export const Container = styled.div<{ animate: boolean }>`
//     position: relative;
//     background-color: var(--material-light-background);
//     backdrop-filter: var(--material-light-background-blur);
//     -webkit-backdrop-filter: var(--material-light-background-webkit-blur);
//     padding: 1.3rem 0;
//     width: 100%;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     flex-direction: column;
//     gap: 0.3rem;
//     overflow: hidden;

//     @media (min-width: 768px) {
//         /* TODO decide border radius for app */
//         border-radius: 12px;
//         padding: 1.3rem 0;
//     }

//     &::before {
//         content: "";
//         position: absolute;
//         left: -200%;
//         width: 150%;
//         height: 100%;
//         background: linear-gradient(
//         120deg,
//         rgba(242, 242, 242, 0) 0%,
//         rgba(242, 242, 242, 0.5) 50%,
//         rgba(242, 242, 242, 0) 100%
//         );
//         transform: skewX(-20deg);
//         opacity: 0;
//         pointer-events: none;
//         animation: ${({ animate }) => animate ? 'glossySweep 1.2s ease-in-out' : 'none'};
//     }

//     @media (hover: hover) {
//         &:hover::before {
//         animation: glossySweep 1.2s ease-in-out;
//         opacity: 1;
//         }
//     }

//     @keyframes glossySweep {
//         0% {
//         left: -75%;
//         opacity: 0;
//         }
//         30% {
//         opacity: 1;
//         }
//         100% {
//         left: 100%;
//         opacity: 0;
//         }
//     }

//     @keyframes fadeSlideUp {
//     0% {
//         opacity: 0;
//         transform: translateY(6px);
//     }
//     100% {
//         opacity: 1;
//         transform: translateY(0);
//     }
//     }

//     @keyframes pulseFade {
//     0% {
//         opacity: 0;
//         transform: scale(0.99);
//     }
//     20% {
//         opacity: 0.2;
//         transform: scale(1.01);
//     }
//     60% {
//         opacity: 0.4;
//         transform: scale(1.005);
//     }
//     100% {
//         opacity: 1;
//         transform: scale(1);
//     }
//     }
// `;

// Floating (Would require changing ither things like pereference search and disclaimer height)
export const Container = styled.div<{ animate: boolean }>`
    position: relative;
    background-color: var(--material-light-background);
    backdrop-filter: var(--material-light-background-blur);
    -webkit-backdrop-filter: var(--material-light-background-webkit-blur);
    padding: 1.3rem 0;
    width: 85%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 0.3rem;
    overflow: hidden;
    border-radius: 12px;
    margin: 1.3rem;

    @media (min-width: 768px) {
        /* TODO decide border radius for app */
        border-radius: 12px;
        padding: 1.3rem 0;
    }

    &::before {
        content: "";
        position: absolute;
        left: -200%;
        width: 150%;
        height: 100%;
        background: linear-gradient(
        120deg,
        rgba(242, 242, 242, 0) 0%,
        rgba(242, 242, 242, 0.5) 50%,
        rgba(242, 242, 242, 0) 100%
        );
        transform: skewX(-20deg);
        opacity: 0;
        pointer-events: none;
        animation: ${({ animate }) => animate ? 'glossySweep 1.2s ease-in-out' : 'none'};
    }

    @media (hover: hover) {
        &:hover::before {
        animation: glossySweep 1.2s ease-in-out;
        opacity: 1;
        }
    }

    @keyframes glossySweep {
        0% {
        left: -75%;
        opacity: 0;
        }
        30% {
        opacity: 1;
        }
        100% {
        left: 100%;
        opacity: 0;
        }
    }

    @keyframes fadeSlideUp {
    0% {
        opacity: 0;
        transform: translateY(6px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
    }

    @keyframes pulseFade {
    0% {
        opacity: 0;
        transform: scale(0.99);
    }
    20% {
        opacity: 0.2;
        transform: scale(1.01);
    }
    60% {
        opacity: 0.4;
        transform: scale(1.005);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
    }
`;

export const Title = styled.div`
    font-family: var(--font-family-primary);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-medium);
    z-index: 1;
    animation: pulseFade 300ms ease-in-out;
`;

export const Subtitle = styled.div`
    z-index: 1;
    font-family: var(--font-family-tertiary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-ultralight);
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
    animation: pulseFade 300ms ease-in-out;
`;