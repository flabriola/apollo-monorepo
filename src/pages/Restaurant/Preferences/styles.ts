import styled from "styled-components";

export const MainContainer = styled.div<{ isSearching: boolean, searchQuery: string }>`
    font-family: var(--font-family-secondary);
    font-weight: var(--font-weight-medium);
    display: grid;
    grid-template-columns: 0.95fr 1.05fr;
    align-items: ${props => props.isSearching ? "top" : "center"};
    justify-content: right;
    padding-top: 1rem;
    padding-right: 1rem;
    min-height: 90vh;
    max-height: fit-content;
    margin-top: ${props => props.isSearching ? "20rem" : ""};
`;

export const Container = styled.div<{ isSearching: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: left;
    position: fixed;
    top: ${props => props.isSearching ? "17rem" : "17.5rem"};
    padding-left: 1rem;
    gap: 0.7rem;
`;

export const Left = styled.div`
    content: "";
    height: 96%;
    width: 50vw;
`;

export const Title = styled.div`
    font-size: var(--font-size-3xl);
`;

export const Header = styled.div`
`;

export const PreferenceGroup = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: left;
    gap: 10px;
`;

export const SearchBar = styled.div`
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 6rem;
    left: 50%;
    transform: translateX(-50%);
    width: 5rem;
    background-color: var(--material-light-background);
    backdrop-filter: var(--material-light-background-blur);
    -webkit-backdrop-filter: var(--material-light-background-webkit-blur);
    border-radius: 5rem;
    padding: 0.3rem;
`;

export const SearchInput = styled.input`
    background-color: transparent;
    width: 4rem;
    border: none;
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

export const PreferencesContainer = styled.div<{ preferenceGroup: string }>`
    margin-bottom: ${props => props.preferenceGroup === 'allergens' ? "9rem" : "3rem"};
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: left;
    padding-left: 1.5rem;
    margin-top: 1rem;
    border-left: 1px solid lightgray;
`;

export const PreferencesList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    justify-content: left;
`;

export const PreferenceItem = styled.div<{ selected: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
    gap: 1rem;
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