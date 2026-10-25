import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import {
  getStorageItem,
  setStorageItem,
} from "../utils/extensionStorage";

import {
  updateUserLanguage,
} from "../api/translation.api";

import {
  useAuth,
} from "./AuthContext";

interface LanguageContextType {
  language: string;

  setLanguage: (
    language: string
  ) => Promise<void>;
}

const LanguageContext =
  createContext<
    LanguageContextType | undefined
  >(
    undefined
  );

interface Props {
  children: ReactNode;
}

export function LanguageProvider({
  children,
}: Props) {
  const {
    user,
  } = useAuth();

  const [
    language,
    setLanguageState,
  ] = useState<string>("en");

  const [
    initialized,
    setInitialized,
  ] = useState(false);

  /* =====================================
     LOAD SAVED LANGUAGE
  ===================================== */

  useEffect(() => {
    const initializeLanguage =
      async () => {
        try {
          const savedLanguage =
            await getStorageItem(
              "language"
            );

          if (savedLanguage) {
            setLanguageState(
              savedLanguage
            );
          }
        } catch (error) {
          console.error(
            "Failed to load saved language:",
            error
          );
        } finally {
          setInitialized(true);
        }
      };

    initializeLanguage();
  }, []);

  /* =====================================
     SYNC WITH LOGGED-IN USER

     Only use the user's preferred language
     when there is no locally saved language.
  ===================================== */

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (!user) {
      return;
    }

    const syncUserLanguage =
      async () => {
        try {
          const savedLanguage =
            await getStorageItem(
              "language"
            );

          /*
           * If the user already has a locally
           * selected language, preserve it.
           */

          if (savedLanguage) {
            setLanguageState(
              savedLanguage
            );

            return;
          }

          /*
           * Otherwise use the user's database
           * preference.
           */

          const userLanguage =
            user.preferred_language ||
            "en";

          setLanguageState(
            userLanguage
          );

          await setStorageItem(
            "language",
            userLanguage
          );
        } catch (error) {
          console.error(
            "Failed to sync user language:",
            error
          );
        }
      };

    syncUserLanguage();
  }, [
    user,
    initialized,
  ]);

  /* =====================================
     CHANGE LANGUAGE
  ===================================== */

  const setLanguage =
    async (
      newLanguage: string
    ) => {
      /*
       * Update UI immediately.
       */

      setLanguageState(
        newLanguage
      );

      /*
       * Save locally immediately.
       */

      await setStorageItem(
        "language",
        newLanguage
      );

      /*
       * Save to database.
       */

      if (user) {
        try {
          await updateUserLanguage(
            newLanguage
          );
        } catch (error) {
          console.error(
            "Failed to update language:",
            error
          );
        }
      }
    };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context =
    useContext(
      LanguageContext
    );

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}