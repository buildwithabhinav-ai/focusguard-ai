import { useState } from "react";

import toast from "react-hot-toast";

import {
  useCreateOrganizationUser,
} from "../../../hooks/useOrganization";

import { useTranslation } from "../../../hooks/useTranslation";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateUserModal = ({
  open,
  onClose,
}: Props) => {
  const createUser =
    useCreateOrganizationUser();

  const [form, setForm] =
    useState({
      full_name: "",
      email: "",
      password: "",
      age: "",
      occupation: "",
    });

  const titleText =
    useTranslation(
      "Create Organization User"
    );

  const fullNameText =
    useTranslation("Full Name");

  const emailText =
    useTranslation("Email");

  const passwordText =
    useTranslation("Password");

  const ageText =
    useTranslation("Age");

  const occupationText =
    useTranslation("Occupation");

  const cancelText =
    useTranslation("Cancel");

  const creatingText =
    useTranslation("Creating...");

  const createUserText =
    useTranslation("Create User");

  const requiredFieldsText =
    useTranslation(
      "Please fill all required fields."
    );

  const userCreatedText =
    useTranslation(
      "User created successfully."
    );

  const unableToCreateText =
    useTranslation(
      "Unable to create user."
    );

  if (!open) {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (
      !form.full_name ||
      !form.email ||
      !form.password
    ) {
      toast.error(requiredFieldsText);
      return;
    }

    try {
      await createUser.mutateAsync({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        age: Number(form.age),
        occupation: form.occupation,
      });

      toast.success(userCreatedText);

      setForm({
        full_name: "",
        email: "",
        password: "",
        age: "",
        occupation: "",
      });

      onClose();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail ??
          unableToCreateText
      );
    }
  };

  const inputClassName = `
    w-full
    rounded-2xl
    border
    border-slate-300
    bg-white
    p-3
    text-sm
    text-slate-900
    outline-none
    transition
    placeholder:text-slate-400
    dark:border-slate-600
    dark:bg-slate-800
    dark:text-slate-100
    dark:placeholder:text-slate-500

    focus:border-indigo-500
    focus:ring-4
    focus:ring-indigo-100
    dark:focus:ring-indigo-950

    sm:text-base
  `;

  return (
    <div
      className="
        fixed
        inset-0
        z-[60]
        flex
        items-center
        justify-center
        overflow-y-auto
        bg-black/40
        p-3
        backdrop-blur-sm

        sm:p-5
      "
    >
      <div
        className="
          my-auto
          w-full
          max-w-xl
          rounded-2xl
          bg-white
          p-5
          shadow-xl
          dark:bg-slate-900

          sm:rounded-3xl
          sm:p-8
        "
      >
        <h2
          className="
            break-words
            text-xl
            font-bold
            text-slate-900
            dark:text-slate-100

            sm:text-2xl
          "
        >
          {titleText}
        </h2>

        <div className="mt-6 space-y-4 sm:mt-8">
          <input
            name="full_name"
            placeholder={fullNameText}
            value={form.full_name}
            onChange={handleChange}
            className={inputClassName}
          />

          <input
            name="email"
            type="email"
            placeholder={emailText}
            value={form.email}
            onChange={handleChange}
            className={inputClassName}
          />

          <input
            name="password"
            type="password"
            placeholder={passwordText}
            value={form.password}
            onChange={handleChange}
            className={inputClassName}
          />

          <input
            name="age"
            type="number"
            placeholder={ageText}
            value={form.age}
            onChange={handleChange}
            className={inputClassName}
          />

          <input
            name="occupation"
            placeholder={occupationText}
            value={form.occupation}
            onChange={handleChange}
            className={inputClassName}
          />
        </div>

        <div
          className="
            mt-6
            flex
            flex-col-reverse
            gap-3

            sm:mt-8
            sm:flex-row
            sm:justify-end
            sm:gap-4
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              px-5
              py-3
              text-sm
              font-medium
              text-slate-700
              transition
              hover:bg-slate-50
              dark:border-slate-600
              dark:text-slate-200
              dark:hover:bg-slate-800

              sm:w-auto
            "
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              createUser.isPending
            }
            className="
              w-full
              rounded-xl
              bg-indigo-600
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-indigo-700

              disabled:cursor-not-allowed
              disabled:opacity-60

              sm:w-auto
              sm:px-6
            "
          >
            {createUser.isPending
              ? creatingText
              : createUserText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;