import { useTranslation } from "../../../hooks/useTranslation";

interface Props {
  active: boolean;
}

const UserStatusBadge = ({
  active,
}: Props) => {
  const activeText =
    useTranslation("Active");

  const inactiveText =
    useTranslation("Inactive");

  return active ? (
    <span
      className="
        inline-flex
        whitespace-nowrap
        rounded-full
        bg-green-100
        px-3
        py-1.5
        text-xs
        font-semibold
        text-green-700
        dark:bg-green-950/60
        dark:text-green-300
      "
    >
      {activeText}
    </span>
  ) : (
    <span
      className="
        inline-flex
        whitespace-nowrap
        rounded-full
        bg-red-100
        px-3
        py-1.5
        text-xs
        font-semibold
        text-red-700
        dark:bg-red-950/60
        dark:text-red-300
      "
    >
      {inactiveText}
    </span>
  );
};

export default UserStatusBadge;