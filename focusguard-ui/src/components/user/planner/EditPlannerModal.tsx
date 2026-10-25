import PlannerModal from "./PlannerModal";

import type {
  TodayPlannerResponse,
} from "../../../api/planner.api";

interface Props {
  open: boolean;
  onClose: () => void;
  planner: TodayPlannerResponse;
}

const EditPlannerModal = ({
  open,
  onClose,
  planner,
}: Props) => {
  return (
    <PlannerModal
      open={open}
      onClose={onClose}
      planner={planner}
      mode="edit"
    />
  );
};

export default EditPlannerModal;