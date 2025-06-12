import { LogoName, LogoSlogan } from "../../../assets/icons";
import type { RestaurantRoute } from "../../../shared/restaurant/types";
import { LoadingContainer, LoadingFooter, Text } from "./styles";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TextContainer } from "../../NotFound/styles";
import LoadingBar from "../../../components/LoadingBar";

function Loading({ restaurantRoute }: { restaurantRoute: RestaurantRoute }) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <LoadingContainer>
            <TextContainer>
                <Text>
                    {t("loading.title")} {restaurantRoute.name}...
                </Text>
            </TextContainer>
            <LoadingBar style={{ marginTop: "2rem", position: "fixed", top: "0" }}/>
            <LoadingFooter onClick={() => navigate("/")}>
                <LogoName /> | <LogoSlogan />
            </LoadingFooter>
        </LoadingContainer>
    );
}

export default Loading;