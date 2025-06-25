import styled from "styled-components";

export const Wrapper = styled.div<{ baseWidth: number; baseHeight: number }>`
  position: relative;
  width: 100%;
  padding-top: ${({ baseWidth, baseHeight }) => `${(baseHeight / baseWidth) * 100}%`}; // maintains aspect ratio
  overflow: hidden;
`;


export const MenuImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const Rectangle = styled.div<{
    left: number;
    top: number;
    width: number;
    height: number;
    blocked: boolean;
}>`
  position: absolute;
  background-color: white;
  opacity: ${({ blocked }) => (blocked ? 0.9 : 0)};
  transition: opacity 0.3s ease;
  left: ${({ left }) => `${left}px`};
  top: ${({ top }) => `${top}px`};
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
`;

export const Icons = styled.div<{
    left: number;
    top: number;
    width: number;
    height: number;
    blocked: boolean;
}>`
    position: absolute;
    opacity: ${({ blocked }) => (blocked ? 0.9 : 0)};
    transition: opacity 0.3s ease;
    left: ${({ left }) => `${left}px`};
    top: ${({ top }) => `${top}px`};
    width: ${({ width }) => `${width}px`};
    height: ${({ height }) => `${height}px`};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
`;

export const Icon = styled.div`

`;