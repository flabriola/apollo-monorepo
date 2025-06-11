import { NotFoundContainer, TextButtonContainer, Title, Subtitle, TextContainer } from "./styles";
import { useAppTranslation } from "../../i18n/hooks";
import TextButton from "../../components/Buttons/TextButton";
import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();
    const { t } = useAppTranslation();

    return (
        <NotFoundContainer>
            <TextContainer>
                <Title>{t("notFound.title")}</Title>
                <Subtitle>{t("notFound.subtitle")}</Subtitle>
            </TextContainer>

            <TextButtonContainer>
                <TextButton text="notFound.button" onClick={() => navigate("/")}/>
            </TextButtonContainer>
            
        </NotFoundContainer>
    )
}

export default NotFound;