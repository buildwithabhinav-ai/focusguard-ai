import { LifeBuoy, Mail } from "lucide-react";

import { useTranslation } from "../../hooks/useTranslation";

import { SUPPORT_EMAIL, supportMailto } from "../../config/support";

// "Need help?" card shown on every Settings page.
const SupportCard = () => {
  const title = useTranslation("Need help?");

  const description = useTranslation(
    "Questions, problems with your account or something not working? Our support team is happy to help."
  );

  const button = useTranslation("Contact support");

  return (
    <div
      className="
        mt-6
        flex
        flex-col
        gap-5
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm

        dark:border-slate-700
        dark:bg-slate-900

        sm:flex-row
        sm:items-center
        sm:justify-between
        sm:p-6
      "
    >
      <div className="flex min-w-0 items-start gap-4">
        <div
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-indigo-100
            text-indigo-600

            dark:bg-indigo-950/50
            dark:text-indigo-400
          "
        >
          <LifeBuoy size={24} />
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>

          <a
            href={supportMailto("FocusGuard AI - Support")}
            className="mt-2 inline-block break-all text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>

      <a
        href={supportMailto("FocusGuard AI - Support")}
        className="
          inline-flex
          shrink-0
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-indigo-600
          px-5
          py-3
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-indigo-700
        "
      >
        <Mail size={16} />

        {button}
      </a>
    </div>
  );
};

export default SupportCard;
