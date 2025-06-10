import { HeaderContainer, LogoContainer } from "./styles";
import { LogoIcon } from "../../assets/icons";
import { useNavigate } from "react-router-dom";


function Header() {
    const navigate = useNavigate();

  return (
    <HeaderContainer>
        <LogoContainer onClick={() => navigate("/")}>
            <LogoIcon size={35}/>
        </LogoContainer>
    </HeaderContainer>
  );
}

export default Header;
