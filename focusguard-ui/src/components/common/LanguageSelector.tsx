import {
  useEffect,
  useState,
} from "react";

import {
  Languages,
} from "lucide-react";

import {
  useLanguage,
} from "../../context/LanguageContext";

import {
  getSupportedLanguages,
} from "../../api/translation.api";


interface SupportedLanguage {
  id: string;
  name: string;
  native_name: string;
}


export default function LanguageSelector() {

  const {
    language,
    setLanguage,
  } = useLanguage();


  const [
    languages,
    setLanguages,
  ] =
    useState<
      SupportedLanguage[]
    >(
      []
    );


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  useEffect(() => {

    const loadLanguages =
      async () => {

        try {

          const response =
            await getSupportedLanguages();


          setLanguages(
            response.languages
          );

        } catch (error) {

          console.error(
            "Failed to load languages:",
            error
          );

        } finally {

          setLoading(
            false
          );

        }

      };


    loadLanguages();

  }, []);


  /*
   * A previously saved language may have
   * been removed; fall back to English.
   */
  useEffect(() => {

    if (
      languages.length > 0 &&
      !languages.some(
        (item) => item.id === language
      )
    ) {

      setLanguage("en");

    }

  }, [
    languages,
    language,
    setLanguage,
  ]);


  return (

    <div className="relative">

      <div
        className="
          flex
          items-center
          gap-2
          rounded-xl
          border
          border-slate-200
          bg-white
          px-3
          py-2
          shadow-sm
          transition

          dark:border-slate-700
          dark:bg-slate-800
        "
      >

        <Languages
          size={18}
          className="
            shrink-0
            text-indigo-600

            dark:text-indigo-400
          "
        />


        <select

          value={language}

          disabled={loading}

          onChange={async (e) => {

            await setLanguage(
              e.target.value
            );

          }}

          className="
            min-w-0
            flex-1
            cursor-pointer
            appearance-none
            bg-transparent
            text-sm
            font-medium
            text-slate-800
            outline-none

            disabled:cursor-not-allowed
            disabled:opacity-60

            dark:bg-slate-800
            dark:text-white
          "

        >

          {loading ? (

            <option
              value=""
              className="
                bg-white
                text-slate-900

                dark:bg-slate-800
                dark:text-white
              "
            >
              Loading...
            </option>

          ) : (

            languages.map(
              (item) => (

                <option

                  key={item.id}

                  value={item.id}

                  className="
                    bg-white
                    text-slate-900

                    dark:bg-slate-800
                    dark:text-white
                  "

                >

                  {item.native_name}
                  {" — "}
                  {item.name}

                </option>

              )
            )

          )}

        </select>

      </div>

    </div>

  );

}