import styled from 'styled-components';

// change background color to the light material variable 
export const HeaderContainer = styled.div`
  width: 100%;
  height: 4rem;
  background-color: var(--material-light-background);
  backdrop-filter: var(--material-light-background-blur);
  -webkit-backdrop-filter: var(--material-light-background-webkit-blur);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;

  @media screen and (orientation: landscape) and (max-height: 450px) {
    background-color: transparent;
  }
`;

export const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
        opacity: 0.85;
        transition: opacity var(--transition-normal);
    }
        
    -webkit-tap-highlight-color: transparent;

    &:active {
        opacity: 0.8;
        transition: opacity var(--transition-fast);
        background-color: none;
    }
`;



