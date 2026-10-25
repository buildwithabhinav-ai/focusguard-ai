import {
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  useApproveRequest,
  useRejectRequest,
} from "../../hooks/useOrganization";

import type {
  DeactivationRequest,
} from "../../api/organization.api";

import {
  useTranslation,
} from "../../hooks/useTranslation";

import TranslatedText from "../../components/common/TranslatedText";
import { formatEnumLabel } from "../../utils/text";

interface Props {
  request: DeactivationRequest;
}

const DeactivationRequestCard = ({
  request,
}: Props) => {
  const approve =
    useApproveRequest();

  const reject =
    useRejectRequest();

  const deactivationRequestText =
    useTranslation(
      "Deactivation request"
    );

  const organizationText =
    useTranslation(
      "Organization"
    );

  const reasonText =
    useTranslation("Reason");

  const requestedByText =
    useTranslation("Requested By");

  const approvingText =
    useTranslation("Approving...");

  const approveText =
    useTranslation("Approve");

  const rejectingText =
    useTranslation("Rejecting...");

  const rejectText =
    useTranslation("Reject");

  const approvalSuccessText =
    useTranslation(
      "Request approved."
    );

  const approvalFailedText =
    useTranslation(
      "Approval failed."
    );

  const rejectionSuccessText =
    useTranslation(
      "Request rejected."
    );

  const rejectionFailedText =
    useTranslation(
      "Reject failed."
    );

  const handleApprove =
    async () => {
      try {
        await approve.mutateAsync(
          request.id
        );

        toast.success(
          approvalSuccessText
        );
      } catch {
        toast.error(
          approvalFailedText
        );
      }
    };

  const handleReject =
    async () => {
      try {
        await reject.mutateAsync(
          request.id
        );

        toast.success(
          rejectionSuccessText
        );
      } catch {
        toast.error(
          rejectionFailedText
        );
      }
    };

  const isPending =
    approve.isPending ||
    reject.isPending;

  return (
    <div
      className="
        min-w-0
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:shadow-lg

        dark:border-slate-700
        dark:bg-slate-900
        dark:shadow-black/20
      "
    >
      <div className="p-5 sm:p-6">
        {/* Header */}

        <div
          className="
            flex
            min-w-0
            flex-col
            gap-4

            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >
          <div
            className="
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
                bg-orange-100

                dark:bg-orange-950/50
              "
            >
              <Clock3
                size={21}
                className="
                  text-orange-600
                  dark:text-orange-400
                "
              />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  break-words
                  text-lg
                  font-bold
                  text-slate-900
                  dark:text-white
                "
              >
                {organizationText} #
                {request.organization_id}
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {deactivationRequestText}
              </p>
            </div>
          </div>

          <span
            className="
              w-fit
              shrink-0
              rounded-full
              bg-yellow-100
              px-3
              py-1.5
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-yellow-700

              dark:bg-yellow-950/50
              dark:text-yellow-300
            "
          >
            <TranslatedText text={formatEnumLabel(request.status)} />
          </span>
        </div>

        {/* Reason */}

        <div
          className="
            mt-6
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-4

            dark:border-slate-700
            dark:bg-slate-800
          "
        >
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-slate-500
              dark:text-slate-400
            "
          >
            {reasonText}
          </p>

          <p
            className="
              mt-2
              break-words
              text-sm
              leading-6
              text-slate-700
              dark:text-slate-200
            "
          >
            {request.reason}
          </p>
        </div>

        {/* Requested By */}

        <div className="mt-4">
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-slate-500
              dark:text-slate-400
            "
          >
            {requestedByText}
          </p>

          <p
            className="
              mt-1
              break-words
              text-sm
              font-medium
              text-slate-700
              dark:text-slate-200
            "
          >
            {request.requested_by}
          </p>
        </div>

        {/* Actions */}

        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-3

            sm:grid-cols-2
          "
        >
          <button
            type="button"
            onClick={handleApprove}
            disabled={isPending}
            className="
              flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-green-600
              px-5
              font-semibold
              text-white
              transition

              hover:bg-green-700

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <CheckCircle2 size={18} />

            {approve.isPending
              ? approvingText
              : approveText}
          </button>

          <button
            type="button"
            onClick={handleReject}
            disabled={isPending}
            className="
              flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-red-600
              px-5
              font-semibold
              text-white
              transition

              hover:bg-red-700

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <XCircle size={18} />

            {reject.isPending
              ? rejectingText
              : rejectText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeactivationRequestCard;