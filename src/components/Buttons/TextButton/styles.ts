import styled from "styled-components";



export const Text = styled.p`
    font-family: var(--font-family-secondary);
    font-weight: var(--font-weight-semibold);
    text-align: center;
    transition: color var(--transition-normal);
    color: var(--color-text-primary);
    cursor: pointer;

    &:hover {
        color: var(--color-primary-hover);
    }

    &:active {
        color: var(--color-primary-hover);
        transition: color var(--transition-fast);
    }
`;
