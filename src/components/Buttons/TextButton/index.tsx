import { useAppTranslation } from "../../../i18n/hooks";
import { Text } from "./styles";

// String prop
interface TextButtonProps {
    text: string;
    onClick?: () => void;
}

function TextButton({ text, onClick }: TextButtonProps) {
    const { t } = useAppTranslation();

    return (
        <Text onClick={onClick}>{t(text)}</Text>
    )
}

export default TextButton;