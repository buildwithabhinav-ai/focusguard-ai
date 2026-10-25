import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import { SUPPORT_EMAIL, supportMailto } from "../../config/support";

interface FooterColumnProps {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}

const FooterColumn = ({
  title,
  links,
}: FooterColumnProps) => {
  return (
    <div className="min-w-0">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
        {title}
      </h3>

      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <FooterLink
              href={link.href}
              label={link.label}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

interface FooterLinkProps {
  href: string;
  label: string;
}

const FooterLink = ({
  href,
  label,
}: FooterLinkProps) => {
  const translatedLabel = useTranslation(label);

  if (href.startsWith("/")) {
    return (
      <Link
        to={href}
        className="break-words text-sm text-slate-400 transition hover:text-white"
      >
        {translatedLabel}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className="break-words text-sm text-slate-400 transition hover:text-white"
    >
      {translatedLabel}
    </a>
  );
};

const Footer = () => {
  const productText = useTranslation("Product");
  const solutionsText = useTranslation("Solutions");
  const companyText = useTranslation("Company");

  const brandDescriptionText = useTranslation(
    "AI-powered attention intelligence for individuals and organizations."
  );

  const privacyFocusedText = useTranslation(
    "Privacy Focused"
  );

  const builtForProductivityText = useTranslation(
    "Built for Productivity"
  );

  const aboutUsText = useTranslation("About Us");

  const contactText = useTranslation("Contact");
  const needHelpText = useTranslation("Need help?");

  const privacyPolicyText = useTranslation(
    "Privacy Policy"
  );

  const termsOfServiceText = useTranslation(
    "Terms of Service"
  );

  const allSystemsOperationalText = useTranslation(
    "All systems operational"
  );

  const secureReliablePrivacyText = useTranslation(
    "Secure • Reliable • Privacy focused"
  );

  const privacyText = useTranslation("Privacy");
  const termsText = useTranslation("Terms");
  const securityText = useTranslation("Security");

  const copyrightText = useTranslation(
    "© {year} FocusGuard AI. All rights reserved."
  );

  const currentYear = new Date().getFullYear();

  const productLinks = [
    {
      label: "Focus Planner",
      href: "/focus-planner",
    },
    {
      label: "Analytics",
      href: "/reports",
    },
    {
      label: "Notifications",
      href: "/notifications",
    },
  ];

  const solutionLinks = [
    {
      label: "Individuals",
      href: "/register",
    },
    {
      label: "Teams",
      href: "/register",
    },
    {
      label: "Organizations",
      href: "/register",
    },
    {
      label: "Administrators",
      href: "/login",
    },
  ];

  const companyLinks = [
    {
      label: aboutUsText,
      href: "/about",
    },
    {
      label: contactText,
      href: "/contact",
    },
    {
      label: privacyPolicyText,
      href: "/privacy",
    },
    {
      label: termsOfServiceText,
      href: "/terms",
    },
  ];

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-white">
      {/* Main Footer */}
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid min-w-0 grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {/* Brand */}
          <div className="min-w-0 lg:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xl font-bold tracking-tight text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold shadow-lg shadow-indigo-600/20">
                F
              </span>

              <span>FocusGuard AI</span>
            </Link>

            <p className="mt-5 max-w-md break-words text-sm leading-6 text-slate-400 sm:text-base">
              {brandDescriptionText}
            </p>

            <p className="mt-4 text-sm text-slate-400">
              {needHelpText}{" "}
              <a
                href={supportMailto("FocusGuard AI - Support")}
                className="font-semibold text-indigo-400 transition hover:text-indigo-300"
              >
                {SUPPORT_EMAIL}
              </a>
            </p>

            {/* Trust badges */}
            <div className="mt-6 flex min-w-0 flex-wrap gap-2">
              <div className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300">
                {privacyFocusedText}
              </div>

              <div className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300">
                {builtForProductivityText}
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                GH
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                in
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                X
              </a>

              <a
                href={supportMailto("FocusGuard AI - Support")}
                aria-label={`Email ${SUPPORT_EMAIL}`}
                title={SUPPORT_EMAIL}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Product */}
          <FooterColumn
            title={productText}
            links={productLinks}
          />

          {/* Solutions */}
          <FooterColumn
            title={solutionsText}
            links={solutionLinks}
          />

          {/* Company */}
          <FooterColumn
            title={companyText}
            links={companyLinks}
          />
        </div>

        {/* System Status */}
        <div className="mt-12 border-t border-slate-800 pt-8 sm:mt-14">
          <div className="flex min-w-0 flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>

              <span className="break-words text-sm font-medium text-slate-200">
                {allSystemsOperationalText}
              </span>
            </div>

            <span className="break-words text-xs text-slate-500 sm:text-right">
              {secureReliablePrivacyText}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-800">
        <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p className="break-words text-xs leading-5 text-slate-500 sm:text-sm">
            {copyrightText.replace(
              "{year}",
              String(currentYear)
            )}
          </p>

          <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              to="/privacy"
              className="break-words text-xs text-slate-500 transition hover:text-white sm:text-sm"
            >
              {privacyText}
            </Link>

            <Link
              to="/terms"
              className="break-words text-xs text-slate-500 transition hover:text-white sm:text-sm"
            >
              {termsText}
            </Link>

            <Link
              to="/security"
              className="break-words text-xs text-slate-500 transition hover:text-white sm:text-sm"
            >
              {securityText}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;