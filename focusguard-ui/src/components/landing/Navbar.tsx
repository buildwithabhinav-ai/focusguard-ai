import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";

import LanguageSelector from "../common/LanguageSelector";
import { useTranslation } from "../../hooks/useTranslation";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { theme, setTheme } = useTheme();

  const featuresText = useTranslation("Features");
  const solutionsText = useTranslation("Solutions");
  const pricingText = useTranslation("Pricing");
  const aboutText = useTranslation("About");

  const loginText = useTranslation("Login");
  const getStartedText = useTranslation("Get Started");

  const toggleThemeText = useTranslation("Toggle theme");
  const toggleNavigationText = useTranslation(
    "Toggle navigation menu"
  );

  const closeMenu = () => {
    setMobileOpen(false);
  };

  const scrollToSection = (id: string) => {
    closeMenu();

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/90">
      <div className="mx-auto flex min-h-[68px] w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex min-w-0 shrink-0 items-center gap-2"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm">
            F
          </div>

          <span className="truncate text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
            FocusGuard AI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          <button
            type="button"
            onClick={() => scrollToSection("features")}
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
          >
            {featuresText}
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("solutions")}
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
          >
            {solutionsText}
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("pricing")}
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
          >
            {pricingText}
          </button>

          <Link
            to="/about"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
          >
            {aboutText}
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSelector />

          <button
            type="button"
            aria-label={toggleThemeText}
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {theme === "dark" ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

          <Link
            to="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {loginText}
          </Link>

          <Link
            to="/register"
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            {getStartedText}
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSelector />

          <button
            type="button"
            aria-label={toggleThemeText}
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {theme === "dark" ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

          <button
            type="button"
            aria-label={toggleNavigationText}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
          <nav className="mx-auto flex w-full max-w-7xl flex-col gap-1">
            <button
              type="button"
              onClick={() => scrollToSection("features")}
              className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {featuresText}
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("solutions")}
              className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {solutionsText}
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("pricing")}
              className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {pricingText}
            </button>

            <Link
              to="/about"
              onClick={closeMenu}
              className="w-full rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {aboutText}
            </Link>

            <div className="mt-3 grid grid-cols-1 gap-2 border-t border-slate-200 pt-3 dark:border-slate-800 sm:grid-cols-2">
              <Link
                to="/login"
                onClick={closeMenu}
                className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                {loginText}
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
                className="rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                {getStartedText}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;