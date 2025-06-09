import { useAppTranslation } from "../../../i18n/hooks";
// String prop
interface TextButtonProps {
    text: string;
    onClick?: () => void;
}

function TextButton({ text, onClick }: TextButtonProps) {
    const { t } = useAppTranslation();

    return (
        <p onClick={onClick}>{t(text)}</p>
    )
}

export default TextButton;