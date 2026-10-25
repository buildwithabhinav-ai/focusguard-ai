import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const PageContainer = ({
  children,
}: Props) => {
  return (
    <div
      className="
        mx-auto
        w-full
        max-w-7xl
        space-y-6

        sm:space-y-8
      "
    >
      {children}
    </div>
  );
};

export default PageContainer;