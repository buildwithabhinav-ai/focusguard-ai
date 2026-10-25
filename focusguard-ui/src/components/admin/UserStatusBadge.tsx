import { useTranslation } from "../../hooks/useTranslation";

interface Props {
  active: boolean;
}

const UserStatusBadge = ({ active }: Props) => {
  const activeText = useTranslation("Active");
  const inactiveText = useTranslation("Inactive");

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
        active
          ? `
            bg-green-100
            text-green-700
            dark:bg-green-950/60
            dark:text-green-300
          `
          : `
            bg-red-100
            text-red-700
            dark:bg-red-950/60
            dark:text-red-300
          `
      }`}
    >
      {active ? activeText : inactiveText}
    </span>
  );
};

export default UserStatusBadge;