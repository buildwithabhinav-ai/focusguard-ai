import type {
  ElementType,
} from "react";

import {
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  BrainCircuit,
  FileBarChart,
  Building2,
  Users,
  Settings,
  LogOut,
  X,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  useTranslation,
} from "../../hooks/useTranslation";


interface SidebarProps {

  open: boolean;

  onClose: () => void;

}


interface SidebarItemProps {

  icon: ElementType;

  label: string;

  path: string;

  onClick: () => void;

}


/* =====================================================
   SIDEBAR ITEM
===================================================== */

const SidebarItem = ({
  icon: Icon,
  label,
  path,
  onClick,
}: SidebarItemProps) => {

  const translatedLabel =
    useTranslation(
      label
    );


  return (

    <NavLink

      to={path}

      onClick={onClick}

      className={({ isActive }) =>

        `
          flex
          w-full
          min-w-0
          items-center
          gap-3
          rounded-2xl
          px-4
          py-3
          transition-all
          duration-200

          ${
            isActive

              ? "bg-indigo-600 text-white shadow-md"

              : `
                  text-slate-700
                  hover:bg-slate-100

                  dark:text-slate-300
                  dark:hover:bg-slate-800
                  dark:hover:text-white
                `
          }
        `

      }

    >

      <Icon
        size={20}
        className="shrink-0"
      />


      <span
        className="
          shrink-0
          whitespace-nowrap
          font-medium
        "
      >

        {translatedLabel}

      </span>

    </NavLink>

  );

};


/* =====================================================
   SIDEBAR
===================================================== */

const Sidebar = ({
  open,
  onClose,
}: SidebarProps) => {

  const navigate =
    useNavigate();


  const {
    user,
    logout,
  } = useAuth();


  // ==========================================
  // TRANSLATIONS
  // ==========================================

  const translatedAppName =
    useTranslation(
      "FocusGuard AI"
    );


  const translatedAttention =
    useTranslation(
      "Attention Intelligence"
    );


  const translatedLogout =
    useTranslation(
      "Logout"
    );


  // ==========================================
  // ROLE PREFIX
  // ==========================================

  const rolePrefix =

    user?.role === "SUPER_ADMIN"

      ? "/superadmin"

      : user?.role === "SUB_ADMIN"

        ? "/subadmin"

        : "/user";


  // ==========================================
  // MENU ITEMS
  // ==========================================

  const menuItems = [

    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: `${rolePrefix}/dashboard`,
    },

    {
      icon: CalendarDays,
      label: "Planner",
      path: `${rolePrefix}/planner`,
    },

    {
      icon: BarChart3,
      label: "Analytics",
      path: `${rolePrefix}/analytics`,
    },

    {
      icon: BrainCircuit,
      label: "AI Insights",
      path: `${rolePrefix}/ai`,
    },

    {
      icon: FileBarChart,
      label: "Reports",
      path: `${rolePrefix}/reports`,
    },


    // ------------------------------------------
    // ADMIN ONLY
    // ------------------------------------------

    ...(user?.role !== "USER"

      ? [

          {
            icon: Building2,
            label: "Organization",
            path: `${rolePrefix}/organization`,
          },

          {
            icon: Users,
            label: "Users",
            path: `${rolePrefix}/users`,
          },

        ]

      : []),


    {
      icon: Settings,
      label: "Settings",
      path: `${rolePrefix}/settings`,
    },

  ];


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    logout();

    onClose();

    navigate(
      "/login",
      {
        replace: true,
      }
    );

  };


  // ==========================================
  // NAVIGATION
  // ==========================================

  const handleNavigation = () => {

    onClose();

  };


  return (

    <>

      {/* =====================================================
          MOBILE / TABLET OVERLAY
      ===================================================== */}

      {open && (

        <button

          type="button"

          aria-label="Close sidebar"

          onClick={onClose}

          className="
            fixed
            inset-0
            z-40
            bg-slate-900/40
            backdrop-blur-[2px]

            lg:hidden
          "

        />

      )}


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside

        className={`

          fixed
          inset-y-0
          left-0
          z-50

          flex
          h-screen
          w-[270px]
          min-w-[270px]
          shrink-0
          flex-col

          overflow-hidden

          border-r
          border-slate-200

          bg-white

          shadow-xl

          transition-transform
          duration-300
          ease-in-out


          dark:border-slate-700
          dark:bg-slate-900
          dark:shadow-black/30


          lg:static
          lg:z-auto
          lg:translate-x-0
          lg:shadow-none


          ${
            open

              ? "translate-x-0"

              : "-translate-x-full"
          }

        `}

      >


        {/* =================================================
            LOGO HEADER
        ================================================= */}

        <div

          className="
            flex
            shrink-0
            items-center
            justify-between

            border-b
            border-slate-200

            p-5


            dark:border-slate-700


            sm:p-6
          "

        >

          <div className="min-w-0 flex-1">


            <h1

              className="
                truncate

                text-xl
                font-bold
                tracking-tight

                text-slate-900


                dark:text-white


                sm:text-2xl
              "

            >

              {translatedAppName}

            </h1>


            <p

              className="
                mt-1

                truncate

                text-xs

                text-slate-500


                dark:text-slate-400


                sm:text-sm
              "

            >

              {translatedAttention}

            </p>

          </div>


          {/* CLOSE BUTTON */}

          <button

            type="button"

            onClick={onClose}

            aria-label="Close navigation"

            className="
              ml-3

              flex
              h-9
              w-9
              shrink-0

              items-center
              justify-center

              rounded-xl

              text-slate-500

              transition


              hover:bg-slate-100
              hover:text-slate-900


              dark:text-slate-400
              dark:hover:bg-slate-800
              dark:hover:text-white


              lg:hidden
            "

          >

            <X size={20} />

          </button>

        </div>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav

          className="
            min-h-0
            flex-1

            overflow-y-auto
            overflow-x-hidden

            p-3


            sm:p-4
          "

        >

          <div
            className="
              space-y-1.5

              sm:space-y-2
            "
          >

            {menuItems.map(
              (item) => (

                <SidebarItem

                  key={item.path}

                  icon={item.icon}

                  label={item.label}

                  path={item.path}

                  onClick={handleNavigation}

                />

              )
            )}

          </div>

        </nav>


        {/* =================================================
            LOGOUT
        ================================================= */}

        <div

          className="
            shrink-0

            border-t
            border-slate-200

            bg-white

            p-3


            dark:border-slate-700
            dark:bg-slate-900


            sm:p-4
          "

        >

          <button

            type="button"

            onClick={handleLogout}

            className="
              flex
              w-full

              items-center

              gap-3

              rounded-2xl

              px-4
              py-3

              text-slate-700

              transition


              hover:bg-red-50
              hover:text-red-600


              dark:text-slate-300
              dark:hover:bg-red-950/40
              dark:hover:text-red-400
            "

          >

            <LogOut

              size={20}

              className="shrink-0"

            />


            <span
              className="
                whitespace-nowrap
                font-medium
              "
            >

              {translatedLogout}

            </span>

          </button>

        </div>

      </aside>

    </>

  );

};


export default Sidebar;