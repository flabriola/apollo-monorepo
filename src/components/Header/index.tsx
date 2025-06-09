import * as S from "./styles";
import { LogoIcon } from "../../assets/icons";
import { useNavigate } from "react-router-dom";


function Header() {
    const navigate = useNavigate();

  return (
    <S.HeaderContainer>
        <S.LogoContainer onClick={() => navigate("/")}>
            <LogoIcon size={35}/>
        </S.LogoContainer>
    </S.HeaderContainer>
  );
}

export default Header;
