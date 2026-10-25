import { useState } from "react";

import {
  Mail,
  UserPlus,
  Building2,
  CheckCircle2,
  AlertCircle,
  Send,
} from "lucide-react";

import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import {
  getOrganizations,
} from "../../api/organization.api";

import {
  inviteSubAdmin,
} from "../../api/admin.api";

import {
  useTranslation,
} from "../../hooks/useTranslation";

const InviteSubAdminCard = () => {
  const [
    fullName,
    setFullName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    organizationId,
    setOrganizationId,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  // Shown when the invitation exists but the e-mail could not be delivered.
  const [
    warningMessage,
    setWarningMessage,
  ] = useState("");

  const [
    manualLink,
    setManualLink,
  ] = useState("");

  const [
    linkCopied,
    setLinkCopied,
  ] = useState(false);

  const inviteSubAdminText =
    useTranslation(
      "Invite Sub Admin"
    );

  const inviteDescriptionText =
    useTranslation(
      "Send an invitation to a Sub Admin to join your organization."
    );

  const fullNameText =
    useTranslation("Full Name");

  const fullNamePlaceholder =
    useTranslation(
      "Enter Sub Admin full name"
    );

  const emailText =
    useTranslation("Email");

  const emailPlaceholder =
    useTranslation(
      "Enter Sub Admin email"
    );

  const organizationText =
    useTranslation("Organization");

  const selectOrganizationText =
    useTranslation(
      "Select an organization"
    );

  const loadingOrganizationsText =
    useTranslation(
      "Loading organizations..."
    );

  const sendInvitationText =
    useTranslation(
      "Send Invitation"
    );

  const sendingInvitationText =
    useTranslation(
      "Sending Invitation..."
    );

  const invitationSentText =
    useTranslation(
      "Invitation sent successfully."
    );

  const invitationErrorText =
    useTranslation(
      "Unable to send invitation."
    );

  const copyLinkText =
    useTranslation("Copy link");

  const linkCopiedText =
    useTranslation("Copied");

  const manualLinkLabelText =
    useTranslation(
      "Invitation link (valid for 24 hours)"
    );

  const nameRequiredText =
    useTranslation(
      "Please enter the Sub Admin's full name."
    );

  const emailRequiredText =
    useTranslation(
      "Please enter the Sub Admin's email."
    );

  const organizationRequiredText =
    useTranslation(
      "Please select an organization."
    );

  const {
    data: organizations = [],
    isLoading: organizationsLoading,
  } = useQuery({
    queryKey: [
      "organizations",
    ],
    queryFn: getOrganizations,
  });

  const mutation =
    useMutation({
      mutationFn:
        inviteSubAdmin,

      onSuccess: (data) => {
        setErrorMessage("");
        setLinkCopied(false);

        if (
          data.email_sent === false
        ) {
          // Invitation was created, only the e-mail failed.
          setSuccessMessage("");

          setWarningMessage(
            [
              data.message,
              data.email_error,
            ]
              .filter(Boolean)
              .join(" ")
          );

          setManualLink(
            data.invitation_link ||
              ""
          );
        } else {
          setWarningMessage("");
          setManualLink("");

          setSuccessMessage(
            data.message ||
              invitationSentText
          );
        }

        setFullName("");
        setEmail("");
        setOrganizationId("");
      },

      onError: (
        error: unknown
      ) => {
        const apiError =
          error as {
            response?: {
              data?: {
                detail?: string;
              };
            };
          };

        setErrorMessage(
          apiError?.response
            ?.data?.detail ||
            invitationErrorText
        );

        setSuccessMessage("");
        setWarningMessage("");
        setManualLink("");
      },
    });

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");
    setWarningMessage("");
    setManualLink("");

    const trimmedName =
      fullName.trim();

    const trimmedEmail =
      email.trim();

    if (!trimmedName) {
      setErrorMessage(
        nameRequiredText
      );

      return;
    }

    if (!trimmedEmail) {
      setErrorMessage(
        emailRequiredText
      );

      return;
    }

    if (!organizationId) {
      setErrorMessage(
        organizationRequiredText
      );

      return;
    }

    mutation.mutate({
      full_name:
        trimmedName,

      email:
        trimmedEmail,

      organization_id:
        Number(
          organizationId
        ),
    });
  };

  return (
    <div
      className="
        min-w-0
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm

        dark:border-slate-700
        dark:bg-slate-900
        dark:shadow-none

        sm:p-6
      "
    >
      {/* Header */}

      <div
        className="
          mb-6
          flex
          min-w-0
          items-start
          gap-3
        "
      >
        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-indigo-100

            dark:bg-indigo-950/50
          "
        >
          <UserPlus
            size={21}
            className="
              text-indigo-600
              dark:text-indigo-400
            "
          />
        </div>

        <div className="min-w-0">
          <h2
            className="
              break-words
              text-xl
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            {inviteSubAdminText}
          </h2>

          <p
            className="
              mt-1
              text-sm
              leading-6
              text-slate-500
              dark:text-slate-400
            "
          >
            {inviteDescriptionText}
          </p>
        </div>
      </div>

      {/* Success */}

      {successMessage && (
        <div
          className="
            mb-5
            flex
            items-start
            gap-3
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
          <CheckCircle2
            size={18}
            className="
              mt-0.5
              shrink-0
            "
          />

          <span className="break-words">
            {successMessage}
          </span>
        </div>
      )}

      {/* Invitation created but e-mail not delivered */}

      {warningMessage && (
        <div
          className="
            mb-5
            rounded-2xl
            border
            border-amber-200
            bg-amber-50
            p-4
            text-sm
            text-amber-800

            dark:border-amber-900/60
            dark:bg-amber-950/30
            dark:text-amber-300
          "
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              size={18}
              className="
                mt-0.5
                shrink-0
              "
            />

            <span className="break-words">
              {warningMessage}
            </span>
          </div>

          {manualLink && (
            <div className="mt-4">
              <label
                htmlFor="manual-invitation-link"
                className="
                  mb-1
                  block
                  text-xs
                  font-medium
                "
              >
                {manualLinkLabelText}
              </label>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="manual-invitation-link"
                  readOnly
                  value={manualLink}
                  onFocus={(e) =>
                    e.currentTarget.select()
                  }
                  className="
                    min-w-0
                    flex-1
                    rounded-xl
                    border
                    border-amber-300
                    bg-white
                    px-3
                    py-2
                    text-xs
                    text-slate-800

                    dark:border-amber-800
                    dark:bg-slate-900
                    dark:text-slate-100
                  "
                />

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(
                        manualLink
                      );
                      setLinkCopied(true);
                    } catch {
                      setLinkCopied(false);
                    }
                  }}
                  className="
                    shrink-0
                    rounded-xl
                    bg-amber-600
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-amber-700
                  "
                >
                  {linkCopied
                    ? linkCopiedText
                    : copyLinkText}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error */}

      {errorMessage && (
        <div
          className="
            mb-5
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

          <span className="break-words">
            {errorMessage}
          </span>
        </div>
      )}

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="grid gap-5"
      >
        {/* Full Name */}

        <div>
          <label
            htmlFor="sub-admin-full-name"
            className="
              mb-2
              block
              text-sm
              font-medium
              text-slate-700
              dark:text-slate-300
            "
          >
            {fullNameText}
          </label>

          <div className="relative">
            <UserPlus
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
              id="sub-admin-full-name"
              type="text"
              value={fullName}
              onChange={(event) =>
                setFullName(
                  event.target.value
                )
              }
              placeholder={
                fullNamePlaceholder
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
                transition

                placeholder:text-slate-400

                focus:border-indigo-500
                focus:ring-2
                focus:ring-indigo-500/20

                disabled:cursor-not-allowed
                disabled:opacity-60

                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
                dark:placeholder:text-slate-500
              "
            />
          </div>
        </div>

        {/* Email */}

        <div>
          <label
            htmlFor="sub-admin-email"
            className="
              mb-2
              block
              text-sm
              font-medium
              text-slate-700
              dark:text-slate-300
            "
          >
            {emailText}
          </label>

          <div className="relative">
            <Mail
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
              id="sub-admin-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder={
                emailPlaceholder
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
                transition

                placeholder:text-slate-400

                focus:border-indigo-500
                focus:ring-2
                focus:ring-indigo-500/20

                disabled:cursor-not-allowed
                disabled:opacity-60

                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
                dark:placeholder:text-slate-500
              "
            />
          </div>
        </div>

        {/* Organization */}

        <div>
          <label
            htmlFor="sub-admin-organization"
            className="
              mb-2
              block
              text-sm
              font-medium
              text-slate-700
              dark:text-slate-300
            "
          >
            {organizationText}
          </label>

          <div className="relative">
            <Building2
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

            <select
              id="sub-admin-organization"
              value={organizationId}
              onChange={(event) =>
                setOrganizationId(
                  event.target.value
                )
              }
              disabled={
                organizationsLoading ||
                mutation.isPending
              }
              className="
                w-full
                appearance-none
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
                transition

                focus:border-indigo-500
                focus:ring-2
                focus:ring-indigo-500/20

                disabled:cursor-not-allowed
                disabled:opacity-60

                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
              "
            >
              <option value="">
                {organizationsLoading
                  ? loadingOrganizationsText
                  : selectOrganizationText}
              </option>

              {organizations
                .filter(
                  (organization) =>
                    organization.is_active
                )
                .map(
                  (organization) => (
                    <option
                      key={
                        organization.id
                      }
                      value={
                        organization.id
                      }
                    >
                      {
                        organization.organization_name
                      }
                    </option>
                  )
                )}
            </select>
          </div>
        </div>

        {/* Submit */}

        <div className="pt-1">
          <button
            type="submit"
            disabled={
              mutation.isPending ||
              organizationsLoading
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

              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500
              focus:ring-offset-2

              disabled:cursor-not-allowed
              disabled:opacity-60

              dark:focus:ring-offset-slate-900

              sm:w-auto
            "
          >
            <Send size={18} />

            {mutation.isPending
              ? sendingInvitationText
              : sendInvitationText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InviteSubAdminCard;