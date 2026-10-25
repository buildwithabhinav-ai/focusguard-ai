import { useState } from "react";
import type { ReactNode } from "react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

interface Props {
  children: ReactNode;
}

const AppLayout = ({
  children,
}: Props) => {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div
      className="
        flex
        h-screen
        w-full
        overflow-hidden
        bg-slate-50
        text-slate-900

        dark:bg-slate-950
        dark:text-slate-100
      "
    >
      {/* =====================================================
          SIDEBAR
          Sidebar stays fixed within the viewport.
      ===================================================== */}

      <Sidebar
        open={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* =====================================================
          MAIN APPLICATION AREA
      ===================================================== */}

      <div
        className="
          flex
          min-h-0
          min-w-0
          flex-1
          flex-col
          overflow-hidden
        "
      >
        {/* =================================================
            TOPBAR
        ================================================= */}

        <header
          className="
            shrink-0
            border-b
            border-slate-200
            bg-white

            dark:border-slate-700
            dark:bg-slate-900
          "
        >
          <Topbar
            onMenuClick={openSidebar}
          />
        </header>

        {/* =================================================
            PAGE CONTENT
            ONLY THIS AREA SCROLLS
        ================================================= */}

        <main
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overflow-x-hidden
            bg-slate-50
            p-4

            dark:bg-slate-950

            sm:p-6
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;