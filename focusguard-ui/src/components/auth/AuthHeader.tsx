import { useTranslation } from "../../hooks/useTranslation";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

const AuthHeader = ({
  title,
  subtitle,
}: AuthHeaderProps) => {
  const titleText = useTranslation(title);
  const subtitleText = useTranslation(subtitle);

  return (
    <div className="mb-10 text-center">

      <h1
        className="
          text-4xl
          font-bold
          tracking-tight
          text-slate-900
          transition-colors
          dark:text-white
        "
      >
        {titleText}
      </h1>

      <p
        className="
          mt-3
          text-slate-500
          transition-colors
          dark:text-slate-400
        "
      >
        {subtitleText}
      </p>

    </div>
  );
};

export default AuthHeader;