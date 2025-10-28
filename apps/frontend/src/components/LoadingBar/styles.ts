import styled, { keyframes } from "styled-components";

const scroll = keyframes`
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0); /* Move exactly half the width since we duplicated the icons */
  }
`;

export const LoadingContainer = styled.div`
  width: 100px;
  overflow: hidden;
  border-left: 1px solid var(--color-primary-tertiary);
  border-right: 1px solid var(--color-primary-tertiary);
`;

export const IconsContainer = styled.div`
  display: flex;
  width: max-content;
  animation: ${scroll} 20s linear infinite;
`;
