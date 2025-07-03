import styled from "styled-components";

export const MainContainer = styled.div`
    font-family: var(--font-family-secondary);
    font-weight: var(--font-weight-medium);
    display: flex;
    align-items: end;
    position: fixed;
    bottom: 9.5rem;
    left: 0;
    width: 100%;
    height: 100%;

    @media (min-width: 768px) and (max-width: 1023px) {
        width: 50%;
        margin: 0 25%;
        bottom: 15rem;
    }

    @media (min-width: 1024px) {
        width: 30%;
        left: 50%;
        transform: translateX(-50%);
        bottom: 15rem;
    }
`;

export const HeaderTitle = styled.div`
    font-size: var(--font-size-2xl);
    font-family: var(--font-family-secondary);
    font-weight: var(--font-weight-normal);
    width: 5rem;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;    
    cursor: pointer;
    padding-left: 1rem;
    opacity: 0.6;

    &:active {
        opacity: 0.5;
    }
`;

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: left;
    width: 50%;
    gap: 0.7rem;
`;

export const Title = styled.div`
    font-size: var(--font-size-3xl);
    padding-left: 1rem;
`;

export const PreferenceGroup = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: left;
    gap: 10px;
    padding-left: 1rem;
`;

export const SearchBar = styled.div`
    display: flex;
    align-items: center;
    text-align: center;
    position: fixed;
    bottom: 6.7rem;
    left: 50%;
    transform: translateX(-50%);

    @media (min-width: 768px) and (max-width: 1023px) {
        bottom: 11.7rem;
    }

    @media (min-width: 1024px) {
        bottom: -4rem;
    }
`;

export const SearchInput = styled.input`
    background-color: transparent;
    text-align: center;
    border: none;
    padding: 0.3rem;
    font-size: var(--font-size-xl);
    font-family: var(--font-family-secondary);
    -webkit-tap-highlight-color: transparent;
    

    &:focus {
        outline: none;
    }
`;


export const Text = styled.div<{ selected: boolean }>`
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
    font-size: var(--font-size-xl);
    color: ${props => props.selected ? "var(--color-text-primary)" : "var(--color-text-secondary)"};
`;

export const PreferencesContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: left;
    margin-top: 1rem;
    border-left: 1px dashed lightgray;
    width: 50%;
    max-height: 69%;
    overflow-y: scroll;
    scrollbar-width: none;
    &::-webkit-scrollbar {
    display: none;
    }

    @media (orientation: landscape) {
        max-height: 47%;
    }

    @media (min-width: 768px) and (max-width: 1023px) {
        max-height: 60%;
    }

    @media (min-width: 1024px) {
        max-height: 50%;
    }
`;

export const PreferencesList = styled.div`
    padding-left: 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    justify-content: left;
`;

export const PreferenceItem = styled.div<{ selected: boolean; disabled?: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
    gap: 1rem;
    font-size: var(--font-size-lg);
    color: ${props => {
        if (props.selected) return "var(--color-negative)";
        if (props.disabled) return "var(--color-text-secondary)";
        return "var(--color-black)";
    }};

    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    opacity: ${props => props.disabled ? 0.5 : 1};
    
    animation: slideDown 0.3s ease-out;
    
    @keyframes slideDown {
        0% {
            opacity: 0;
            transform: translateY(-10px);
        }
        50% {
            opacity: 0.25;
            transform: translateY(-5px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (min-width: 768px) {
        font-size: var(--font-size-xl);
    }
`;

