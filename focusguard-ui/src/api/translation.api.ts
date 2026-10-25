import api from "./axios";

/* ====================================
   Supported Languages
==================================== */

export interface SupportedLanguage {
  id: string;
  name: string;
  native_name: string;
}

export interface SupportedLanguagesResponse {
  languages: SupportedLanguage[];
}

export const getSupportedLanguages =
  async (): Promise<
    SupportedLanguagesResponse
  > => {
    const response =
      await api.get(
        "/translation/languages"
      );

    return response.data;
  };

/* ====================================
   Static Translation
==================================== */

export interface StaticTranslationResponse {
  message_key: string;
  language: string;
  translated_text: string;
}

export const getStaticTranslation =
  async (
    messageKey: string,
    language: string
  ): Promise<
    StaticTranslationResponse
  > => {
    const response =
      await api.get(
        `/translation/message/${messageKey}`,
        {
          params: {
            language,
          },
        }
      );

    return response.data;
  };

/* ====================================
   Dynamic Translation
==================================== */

export interface DynamicTranslationResponse {
  original_text: string;
  language: string;
  translated_text: string;
}

export const translateDynamicText =
  async (
    message: string,
    language: string
  ): Promise<
    DynamicTranslationResponse
  > => {
    const response =
      await api.post(
        "/translation/dynamic",
        {
          message,
        },
        {
          params: {
            language,
          },
        }
      );

    return response.data;
  };

/* ====================================
   Batch Translation
==================================== */

export interface BatchTranslationItem {
  text: string;
  key?: string;
}

export interface BatchTranslationResponse {
  language: string;
  translations: Record<string, string>;
  failed: string[];
}

export const translateBatch =
  async (
    items: BatchTranslationItem[],
    language: string
  ): Promise<
    BatchTranslationResponse
  > => {
    const response =
      await api.post(
        "/translation/batch",
        {
          items,
        },
        {
          params: {
            language,
          },
        }
      );

    return response.data;
  };

/* ====================================
   Update User Language Preference
==================================== */

export interface UpdateLanguageResponse {
  message: string;
  language: string;
}

export const updateUserLanguage =
  async (
    language: string
  ): Promise<
    UpdateLanguageResponse
  > => {
    const response =
      await api.put(
        "/translation/language",
        {
          language,
        }
      );

    return response.data;
  };