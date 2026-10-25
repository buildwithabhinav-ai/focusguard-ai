import { useTranslation } from "../../hooks/useTranslation";

interface TranslatedTextProps {
  text: string;
}

/*
 * Translates text that is only known while rendering a list or a
 * chart label (category names, notification messages, ...), where
 * useTranslation cannot be called directly.
 */
const TranslatedText = ({
  text,
}: TranslatedTextProps) => {
  return <>{useTranslation(text)}</>;
};

export default TranslatedText;
