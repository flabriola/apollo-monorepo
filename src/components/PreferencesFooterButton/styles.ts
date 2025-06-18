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
`;

export const Container = styled.div`
    background-color: var(--material-light-background);
    backdrop-filter: var(--material-light-background-blur);
    -webkit-backdrop-filter: var(--material-light-background-webkit-blur);
    height: 80px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 1px solid red;
    gap: 0.3rem;
`;

export const Title = styled.div`
    font-family: var(--font-family-primary);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
`;

export const Subtitle = styled.div`
    font-family: var(--font-family-tertiary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-light);
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
`;