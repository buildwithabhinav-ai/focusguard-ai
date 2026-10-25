import { useState } from "react";

import {
  Users,
  Plus,
} from "lucide-react";

import CreateUserModal from "./CreateUserModal";

import { useTranslation } from "../../../hooks/useTranslation";

const UsersHeader = () => {
  const [open, setOpen] =
    useState(false);

  const titleText =
    useTranslation("Organization Users");

  const descriptionText =
    useTranslation(
      "Manage users in your organization"
    );

  const createUserText =
    useTranslation("Create User");

  return (
    <>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
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
              dark:bg-indigo-950/60

              sm:h-14
              sm:w-14
            "
          >
            <Users
              size={25}
              className="
                text-indigo-600
                dark:text-indigo-400
                sm:h-7
                sm:w-7
              "
            />
          </div>

          <div className="min-w-0">
            <h1
              className="
                break-words
                text-2xl
                font-bold
                text-slate-900
                dark:text-slate-100

                sm:text-3xl
              "
            >
              {titleText}
            </h1>

            <p
              className="
                mt-1
                break-words
                text-sm
                text-slate-500
                dark:text-slate-400

                sm:text-base
              "
            >
              {descriptionText}
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="
            inline-flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-indigo-600
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-indigo-700

            sm:w-auto
            sm:text-base
          "
        >
          <Plus size={18} />

          {createUserText}
        </button>
      </div>

      <CreateUserModal
        open={open}
        onClose={() =>
          setOpen(false)
        }
      />
    </>
  );
};

export default UsersHeader;