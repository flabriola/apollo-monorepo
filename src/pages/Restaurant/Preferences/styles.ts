import styled from "styled-components";

export const MainContainer = styled.div`
    font-family: var(--font-family-secondary);
    font-weight: var(--font-weight-medium);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 1rem;
`;

export const Title = styled.div`
    font-size: var(--font-size-3xl);
`;

export const Header = styled.div`
`;

export const PreferenceGroup = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 0.7rem;
    background-color: var(--material-light-background);
    backdrop-filter: var(--material-light-background-blur);
    -webkit-backdrop-filter: var(--material-light-background-webkit-blur);
`;

export const SearchBar = styled.div`
    position: sticky;
    top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.3rem;
    border-radius: 5rem;
    background-color: var(--material-light-background);
    backdrop-filter: var(--material-light-background-blur);
    -webkit-backdrop-filter: var(--material-light-background-webkit-blur);
    width: fit-content;
`;

export const SearchInput = styled.input`
    background-color: transparent;
    border: none;
    font-size: var(--font-size-xl);
    font-family: var(--font-family-secondary);
    text-align: center;
    -webkit-tap-highlight-color: transparent;
    max-width: 10rem;
    
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
    margin-bottom: 7rem;
`;

export const PreferencesList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 1rem;
`;

export const PreferenceItem = styled.div<{ selected: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
    gap: 1.5rem;
    font-size: var(--font-size-xl);
    color: ${props => props.selected ? "var(--color-negative)" : "var(--color-black)"};

    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
    
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
`;