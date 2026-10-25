import {
  useMemo,
  useState,
} from "react";

import {
  CheckCircle2,
  LockKeyhole,
  UserPlus,
  AlertCircle,
} from "lucide-react";

import {
  useMutation,
} from "@tanstack/react-query";

import api from "../../api/axios";

import { SUPPORT_EMAIL, supportMailto } from "../../config/support";

import {
  useTranslation,
} from "../../hooks/useTranslation";


interface AcceptInvitationRequest {

  password: string;

}


interface AcceptInvitationResponse {

  message: string;

  role: string;

  organization_id: number;

  organization_name: string;

}


const acceptInvitation = async (
  token: string,
  data: AcceptInvitationRequest
): Promise<AcceptInvitationResponse> => {

  const response = await api.post(

    `/admin/accept-invitation?token=${encodeURIComponent(token)}`,

    data

  );

  return response.data;

};


const AcceptInvitationPage = () => {

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");


  const token = useMemo(() => {
  const hash = window.location.hash;

  const queryIndex = hash.indexOf("?");

  if (queryIndex === -1) {
    return "";
  }

  const queryString = hash.substring(
    queryIndex + 1
  );

  const params =
    new URLSearchParams(
      queryString
    );

  return params.get("token") || "";
}, []);


  /* ====================================
     Translations
  ==================================== */

  const acceptInvitationText =
    useTranslation(
      "Accept Invitation"
    );

  const welcomeText =
    useTranslation(
      "Welcome to FocusGuard"
    );

  const createPasswordText =
    useTranslation(
      "Create your password to join the organization."
    );

  const passwordText =
    useTranslation("Password");

  const confirmPasswordText =
    useTranslation(
      "Confirm Password"
    );

  const passwordPlaceholder =
    useTranslation(
      "Enter your password"
    );

  const confirmPasswordPlaceholder =
    useTranslation(
      "Confirm your password"
    );

  const acceptText =
    useTranslation(
      "Accept Invitation"
    );

  const acceptingText =
    useTranslation(
      "Accepting Invitation..."
    );

  const loginText =
    useTranslation(
      "Go to Login"
    );

  // Messages are stored in English and translated when shown.
  const translatedErrorMessage =
    useTranslation(errorMessage);

  const translatedSuccessMessage =
    useTranslation(successMessage);

  const invalidInvitationText = useTranslation(
    "Invalid Invitation"
  );

  const invalidInvitationDescriptionText = useTranslation(
    "This invitation link is invalid or incomplete."
  );

  const needNewLinkText = useTranslation(
    "Need a new link or help? Write to"
  );


  const mutation = useMutation({

    mutationFn: () =>

      acceptInvitation(

        token,

        {
          password,
        }

      ),

    onSuccess: (data) => {

      setSuccessMessage(
        `${data.message} You have joined ${data.organization_name}.`
      );

      setErrorMessage("");

      setPassword("");

      setConfirmPassword("");

    },

    onError: (error: unknown) => {

      const apiError = error as {

        response?: {

          data?: {

            detail?: string;

          };

        };

      };


      setErrorMessage(

        apiError?.response?.data?.detail ||

        "Unable to accept invitation."

      );

      setSuccessMessage("");

    },

  });


  const handleSubmit = (
    event: React.FormEvent
  ) => {

    event.preventDefault();

    setSuccessMessage("");

    setErrorMessage("");


    if (!token) {

      setErrorMessage(
        "Invalid invitation link."
      );

      return;

    }


    if (!password) {

      setErrorMessage(
        "Please enter a password."
      );

      return;

    }


    if (password.length < 8) {

      setErrorMessage(
        "Password must be at least 8 characters long."
      );

      return;

    }


    if (!confirmPassword) {

      setErrorMessage(
        "Please confirm your password."
      );

      return;

    }


    if (
      password !==
      confirmPassword
    ) {

      setErrorMessage(
        "Passwords do not match."
      );

      return;

    }


    mutation.mutate();

  };


  if (!token) {

    return (

      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-slate-50
          px-5

          dark:bg-slate-950
        "
      >

        <div
          className="
            w-full
            max-w-md
            rounded-3xl
            border
            border-red-200
            bg-white
            p-6
            text-center
            shadow-sm

            dark:border-red-900/60
            dark:bg-slate-900

            sm:p-8
          "
        >

          <AlertCircle
            size={42}
            className="
              mx-auto
              text-red-500
            "
          />


          <h1
            className="
              mt-4
              text-xl
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            {invalidInvitationText}
          </h1>


          <p
            className="
              mt-2
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            {invalidInvitationDescriptionText}
          </p>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            {needNewLinkText}{" "}
            <a
              href={supportMailto("FocusGuard AI - Invitation link help")}
              className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              {SUPPORT_EMAIL}
            </a>
          </p>

        </div>

      </div>

    );

  }


  return (

    <div
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-slate-50
        px-5
        py-10

        dark:bg-slate-950
      "
    >

      <div
        className="
          w-full
          max-w-md
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm

          dark:border-slate-700
          dark:bg-slate-900

          sm:p-8
        "
      >

        {/* Header */}

        <div className="text-center">

          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-indigo-100

              dark:bg-indigo-950/50
            "
          >

            <UserPlus
              size={27}
              className="
                text-indigo-600
                dark:text-indigo-400
              "
            />

          </div>


          <h1
            className="
              mt-5
              text-2xl
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            {acceptInvitationText}
          </h1>


          <p
            className="
              mt-2
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            {welcomeText}
          </p>


          <p
            className="
              mt-1
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            {createPasswordText}
          </p>

        </div>


        {/* Success */}

        {successMessage && (

          <div
            className="
              mt-6
              rounded-2xl
              border
              border-green-200
              bg-green-50
              p-4
              text-sm
              text-green-700

              dark:border-green-900/60
              dark:bg-green-950/30
              dark:text-green-400
            "
          >

            <div
              className="
                flex
                items-start
                gap-3
              "
            >

              <CheckCircle2
                size={18}
                className="
                  mt-0.5
                  shrink-0
                "
              />

              <span>
                {translatedSuccessMessage}
              </span>

            </div>


            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "/login";
              }}
              className="
                mt-4
                w-full
                rounded-xl
                bg-green-600
                px-4
                py-2.5
                font-semibold
                text-white
                transition
                hover:bg-green-700
              "
            >
              {loginText}
            </button>

          </div>

        )}


        {/* Error */}

        {errorMessage && (

          <div
            className="
              mt-6
              flex
              items-start
              gap-3
              rounded-2xl
              border
              border-red-200
              bg-red-50
              p-4
              text-sm
              text-red-700

              dark:border-red-900/60
              dark:bg-red-950/30
              dark:text-red-400
            "
          >

            <AlertCircle
              size={18}
              className="
                mt-0.5
                shrink-0
              "
            />

            <span>
              {translatedErrorMessage}
            </span>

          </div>

        )}


        {/* Form */}

        {!successMessage && (

          <form
            onSubmit={handleSubmit}
            className="
              mt-6
              space-y-5
            "
          >

            {/* Password */}

            <div>

              <label
                htmlFor="invitation-password"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                  dark:text-slate-300
                "
              >
                {passwordText}
              </label>


              <div className="relative">

                <LockKeyhole
                  size={18}
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />


                <input
                  id="invitation-password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder={
                    passwordPlaceholder
                  }
                  disabled={
                    mutation.isPending
                  }
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    py-3
                    pl-11
                    pr-4
                    text-sm
                    text-slate-900
                    outline-none

                    focus:border-indigo-500
                    focus:ring-2
                    focus:ring-indigo-500/20

                    dark:border-slate-700
                    dark:bg-slate-800
                    dark:text-white
                  "
                />

              </div>

            </div>


            {/* Confirm Password */}

            <div>

              <label
                htmlFor="invitation-confirm-password"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                  dark:text-slate-300
                "
              >
                {confirmPasswordText}
              </label>


              <div className="relative">

                <LockKeyhole
                  size={18}
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />


                <input
                  id="invitation-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder={
                    confirmPasswordPlaceholder
                  }
                  disabled={
                    mutation.isPending
                  }
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    py-3
                    pl-11
                    pr-4
                    text-sm
                    text-slate-900
                    outline-none

                    focus:border-indigo-500
                    focus:ring-2
                    focus:ring-indigo-500/20

                    dark:border-slate-700
                    dark:bg-slate-800
                    dark:text-white
                  "
                />

              </div>

            </div>


            <button
              type="submit"
              disabled={
                mutation.isPending
              }
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
                font-semibold
                text-white
                transition
                hover:bg-indigo-700

                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              <UserPlus size={18} />

              {mutation.isPending
                ? acceptingText
                : acceptText}

            </button>

          </form>

        )}

      </div>

    </div>

  );

};


export default AcceptInvitationPage;