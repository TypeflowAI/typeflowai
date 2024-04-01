import { Modal } from "@typeflowai/ui/Modal";

interface UploadAttributesModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
}

export default function UploadAttributesModal({ open, setOpen }: UploadAttributesModalProps) {
  return (
    <>
      <Modal open={open} setOpen={setOpen}>
        Upload CSV
      </Modal>
    </>
  );
}
