import { useRouter } from "next/navigation";

import { Button } from "../Button";
import { Modal } from "../Modal";

type TSegmentAlreadyUsedModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  environmentId: string;
};

const SegmentAlreadyUsedModal = ({ open, setOpen, environmentId }: TSegmentAlreadyUsedModalProps) => {
  const router = useRouter();

  return (
    <Modal open={open} setOpen={setOpen} title="Forward to Segments View">
      <p>This segment is used in other workflows. To assure consistent data you cannot edit it here.</p>
      <div className="space-x-2 text-right">
        <Button
          variant="warn"
          onClick={() => {
            setOpen(false);
          }}>
          Discard
        </Button>
        <Button
          variant="darkCTA"
          onClick={() => {
            router.push(`/environments/${environmentId}/segments`);
          }}>
          Go to Segments
        </Button>
      </div>
    </Modal>
  );
};

export default SegmentAlreadyUsedModal;
