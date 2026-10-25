import type { ReactNode } from "react";

import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

interface LandingLayoutProps {
  children: ReactNode;
}

const LandingLayout = ({
  children,
}: LandingLayoutProps) => {
  return (
    <>
      <Navbar />

      <main>
        {children}
      </main>

      <Footer />
    </>
  );
};

export default LandingLayout;