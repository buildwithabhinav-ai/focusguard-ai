import { useState } from "react";

import toast from "react-hot-toast";

import {
  useRequestDeactivation,
} from "../../../hooks/useOrganization";

import { useTranslation } from "../../../hooks/useTranslation";

interface Props {
  open: boolean;
  onClose: () => void;
}

const RequestDeactivationModal = ({
  open,
  onClose,
}: Props) => {
  const [reason, setReason] = useState("");

  const requestMutation =
    useRequestDeactivation();

  const reasonRequiredText = useTranslation(
    "Reason is required."
  );

  const requestSentText = useTranslation(
    "Request sent successfully."
  );

  const unableToSendText = useTranslation(
    "Unable to send request."
  );

  const titleText = useTranslation(
    "Organization Deactivation"
  );

  const descriptionText = useTranslation(
    "Tell the Super Admin why your organization should be deactivated."
  );

  const placeholderText = useTranslation(
    "Enter reason..."
  );

  const cancelText = useTranslation("Cancel");

  const sendingText = useTranslation("Sending...");

  const sendRequestText = useTranslation(
    "Send Request"
  );

  if (!open) {
    return null;
  }

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error(reasonRequiredText);
      return;
    }

    try {
      await requestMutation.mutateAsync({
        reason,
      });

      toast.success(requestSentText);

      setReason("");

      onClose();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail ??
          unableToSendText
      );
    }
  };

  return (
    /* =====================================================
       OVERLAY
    ===================================================== */

    <div
      className="
        fixed
        inset-0
        z-[60]
        flex
        items-center
        justify-center
        overflow-y-auto
        bg-slate-900/50
        p-3
        backdrop-blur-sm

        sm:p-5
      "
    >
      {/* =================================================
          MODAL
      ================================================= */}

      <div
        className="
          my-auto
          w-full
          max-w-lg
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
          dark:bg-slate-900

          sm:rounded-3xl
        "
      >
        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="p-5 sm:p-8">
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

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
              dark:text-slate-400

              sm:text-base
            "
          >
            {descriptionText}
          </p>

          {/* Reason */}

          <textarea
            rows={5}
            value={reason}
            onChange={(e) =>
              setReason(e.target.value)
            }
            placeholder={placeholderText}
            className="
              mt-5
              min-h-[130px]
              w-full
              resize-none
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

              sm:mt-6
              sm:p-4
              sm:text-base
            "
          />

          {/* =================================================
              BUTTONS
          ================================================= */}

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
                rounded-2xl
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
                sm:px-6
                sm:text-base
              "
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                requestMutation.isPending
              }
              className="
                w-full
                rounded-2xl
                bg-red-600
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-red-700

                disabled:cursor-not-allowed
                disabled:opacity-60

                sm:w-auto
                sm:px-6
                sm:text-base
              "
            >
              {requestMutation.isPending
                ? sendingText
                : sendRequestText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDeactivationModal;