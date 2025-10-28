import { useAppTranslation } from "../../../i18n/hooks";
import { Text } from "./styles";

// String prop
interface TextButtonProps {
    text: string;
    onClick?: () => void;
    style?: React.CSSProperties;
}

function TextButton({ text, onClick, style }: TextButtonProps) {
    const { t } = useAppTranslation();

    return (
        <Text onClick={onClick} style={style}>{t(text)}</Text>
    )
}

export default TextButton;