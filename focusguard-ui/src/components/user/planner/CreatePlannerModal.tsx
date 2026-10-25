import PlannerModal from "./PlannerModal";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreatePlannerModal = ({
  open,
  onClose,
}: Props) => {
  return (
    <PlannerModal
      open={open}
      onClose={onClose}
      mode="create"
    />
  );
};

export default CreatePlannerModal;