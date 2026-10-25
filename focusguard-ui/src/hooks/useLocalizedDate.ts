import { useLanguage } from "../context/LanguageContext";

import {
  TRANSLATED_SCRIPT_PATTERN,
  useTranslation,
} from "./useTranslation";

const LONG_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
};

// App language codes that differ from the browser's (Intl) codes.
const INTL_LANGUAGE_CODES: Record<string, string> = {
  od: "or",
};

/*
 * Formats a date in the selected language, e.g. "Sunday, 25 October 2026".
 *
 * Browsers have no date data for several supported languages (Assamese,
 * Bodo, Dogri, ...) and fall back to English or to "2026 M10 25, Sun".
 * In that case the English date is translated like any other text.
 */
export function useLocalizedDate(
  date: Date | string | undefined = new Date()
) {
  const { language } = useLanguage();

  const value =
    date === undefined ? undefined : new Date(date);

  const isValid =
    value !== undefined && !Number.isNaN(value.getTime());

  const english = isValid
    ? value.toLocaleDateString("en-IN", LONG_DATE_FORMAT)
    : "";

  let native = "";

  if (isValid && language !== "en") {
    try {
      native = value.toLocaleDateString(
        `${INTL_LANGUAGE_CODES[language] ?? language}-IN`,
        LONG_DATE_FORMAT
      );
    } catch {
      native = "";
    }
  }

  const hasNativeFormat =
    TRANSLATED_SCRIPT_PATTERN.test(native);

  const translated = useTranslation(
    language === "en" || hasNativeFormat ? "" : english
  );

  if (language === "en") {
    return english;
  }

  return hasNativeFormat ? native : translated;
}
