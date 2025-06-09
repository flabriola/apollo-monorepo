import { NotFoundContainer, TextButtonContainer } from "./styles";
import { useAppTranslation } from "../../i18n/hooks";
import TextButton from "../../components/Buttons/TextButton";
import { useNavigate } from "react-router-dom";
function NotFound() {
    const navigate = useNavigate();
    const { t } = useAppTranslation();

    return (
        <NotFoundContainer>
            <h1>{t("notFound.title")}</h1>
            <p>{t("notFound.subtitle")}</p>

            <TextButtonContainer>
                <TextButton text="notFound.button" onClick={() => navigate("/")}/>
            </TextButtonContainer>
            
        </NotFoundContainer>
    )
}

export default NotFound;