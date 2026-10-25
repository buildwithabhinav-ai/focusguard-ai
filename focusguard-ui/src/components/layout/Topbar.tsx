import {
  Search,
  Menu,
  Moon,
  Sun,
} from "lucide-react";

import { useTheme } from "next-themes";

import { useAuth } from "../../context/AuthContext";

import NotificationBell from "../common/NotificationBell";

import LanguageSelector from "../common/LanguageSelector";

import {
  useTranslation,
} from "../../hooks/useTranslation";


import { useLocalizedDate } from "../../hooks/useLocalizedDate";

interface TopbarProps {
  onMenuClick: () => void;
}


const Topbar = ({
  onMenuClick,
}: TopbarProps) => {

  const {
    user,
  } = useAuth();


  const {
    theme,
    setTheme,
  } = useTheme();


  // =====================================
  // TRANSLATIONS
  // =====================================

  const dashboardText =
    useTranslation("Dashboard");


  const searchText =
    useTranslation("Search...");


  const lightModeText =
    useTranslation(
      "Switch to light mode"
    );


  const darkModeText =
    useTranslation(
      "Switch to dark mode"
    );


  const userText =
    useTranslation("User");


  // =====================================
  // DATE
  // =====================================

  const today =
    useLocalizedDate();


  // =====================================
  // THEME
  // =====================================

  const isDark =
    theme === "dark";


  const toggleTheme = () => {

    setTheme(
      isDark
        ? "light"
        : "dark"
    );

  };


  // =====================================
  // USER ROLE
  // =====================================

  // "SUB_ADMIN" -> "Sub Admin" (matches the static translation keys)
  const formattedRole =
    user?.role
      ?.toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (character) =>
        character.toUpperCase()
      ) ??
    "";


  const translatedRole =
    useTranslation(
      formattedRole
    );


  return (

    <header
      className="
        shrink-0
        border-b
        border-slate-200
        bg-white
        px-3
        py-3

        dark:border-slate-700
        dark:bg-slate-900

        sm:px-6
      "
    >

      {/* =====================================
          TOP ROW
      ===================================== */}

      <div
        className="
          flex
          min-h-[52px]
          items-center
          justify-between
          gap-2

          sm:gap-3
        "
      >

        {/* =====================================
            LEFT SECTION
        ===================================== */}

        <div
          className="
            flex
            min-w-0
            shrink
            items-center
            gap-1.5

            sm:gap-3
          "
        >

          {/* MOBILE / TABLET MENU */}

          <button
            type="button"

            onClick={
              onMenuClick
            }

            aria-label="Open navigation"

            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-700
              transition

              hover:bg-slate-100
              active:bg-slate-200

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-slate-200
              dark:hover:bg-slate-700
              dark:active:bg-slate-600

              sm:h-10
              sm:w-10

              lg:hidden
            "
          >

            <Menu size={20} />

          </button>


          {/* PAGE HEADING */}

          <div
            className="
              min-w-0
              shrink
            "
          >

            <h1
              className="
                whitespace-nowrap
                text-base
                font-bold
                tracking-tight
                text-slate-900

                dark:text-white

                sm:text-xl
                md:text-2xl
              "
            >

              {dashboardText}

            </h1>


            <p
              className="
                mt-0.5
                hidden
                truncate
                text-xs
                text-slate-500

                dark:text-slate-400

                sm:block
                sm:text-sm
              "
            >

              {today}

            </p>

          </div>

        </div>


        {/* =====================================
            RIGHT SECTION
        ===================================== */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-1.5

            sm:gap-3
            md:gap-4
          "
        >

          {/* SEARCH */}

          <div
            className="
              relative
              hidden
              sm:block
            "
          >

            <Search
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400

                dark:text-slate-500
              "

              size={17}
            />


            <input
              type="search"

              placeholder={
                searchText
              }

              aria-label={
                searchText
              }

              className="
                h-10
                w-36
                rounded-xl
                border
                border-slate-200
                bg-white
                pl-10
                pr-3
                text-sm
                text-slate-900
                outline-none
                transition

                placeholder:text-slate-400

                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-100

                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
                dark:placeholder:text-slate-500
                dark:focus:border-indigo-500
                dark:focus:ring-indigo-900

                md:w-48
                lg:w-64
              "
            />

          </div>


          {/* =====================================
              LANGUAGE SELECTOR
          ===================================== */}

          <div
            className="
              shrink-0
            "
          >

            <LanguageSelector />

          </div>


          {/* =====================================
              DARK / LIGHT MODE
          ===================================== */}

          <button
            type="button"

            onClick={
              toggleTheme
            }

            aria-label={
              isDark
                ? lightModeText
                : darkModeText
            }

            title={
              isDark
                ? lightModeText
                : darkModeText
            }

            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-700
              transition

              hover:bg-slate-100
              active:bg-slate-200

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-slate-200
              dark:hover:bg-slate-700
              dark:active:bg-slate-600

              sm:h-10
              sm:w-10
            "
          >

            {isDark ? (

              <Sun size={18} />

            ) : (

              <Moon size={18} />

            )}

          </button>


          {/* NOTIFICATIONS */}

          <div
            className="
              shrink-0
            "
          >

            <NotificationBell />

          </div>


          {/* =====================================
              USER
          ===================================== */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-2

              sm:gap-3
            "
          >

            {/* AVATAR */}

            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-indigo-600
                text-sm
                font-semibold
                text-white

                sm:h-10
                sm:w-10

                md:h-11
                md:w-11
              "
            >

              {
                user?.full_name
                  ?.charAt(0)
                  .toUpperCase()
                ??
                "U"
              }

            </div>


            {/* USER INFORMATION */}

            <div
              className="
                hidden
                min-w-0

                md:block
              "
            >

              <h3
                className="
                  max-w-[140px]
                  truncate
                  text-sm
                  font-semibold
                  text-slate-900

                  dark:text-white

                  lg:max-w-[190px]
                "
              >

                {
                  user?.full_name
                  ??
                  userText
                }

              </h3>


              <p
                className="
                  mt-0.5
                  truncate
                  text-xs
                  text-slate-500

                  dark:text-slate-400

                  lg:text-sm
                "
              >

                {translatedRole}

              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================
          MOBILE SEARCH
      ===================================== */}

      <div
        className="
          mt-3

          sm:hidden
        "
      >

        <div
          className="
            relative
          "
        >

          <Search
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-slate-400

              dark:text-slate-500
            "

            size={17}
          />


          <input
            type="search"

            placeholder={
              searchText
            }

            aria-label={
              searchText
            }

            className="
              h-10
              w-full
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              pl-10
              pr-3
              text-sm
              text-slate-900
              outline-none
              transition

              placeholder:text-slate-400

              focus:border-indigo-500
              focus:bg-white
              focus:ring-4
              focus:ring-indigo-100

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-white
              dark:placeholder:text-slate-500
              dark:focus:border-indigo-500
              dark:focus:bg-slate-800
              dark:focus:ring-indigo-900
            "
          />

        </div>

      </div>

    </header>

  );

};


export default Topbar;