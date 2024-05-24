import { FileInput } from "@typeflowai/ui/FileInput";

interface UploadImageWorkflowBgProps {
  environmentId: string;
  handleBgChange: (url: string, bgType: string) => void;
  background: string;
}

export const UploadImageWorkflowBg = ({
  environmentId,
  handleBgChange,
  background,
}: UploadImageWorkflowBgProps) => {
  return (
    <div className="mt-2 w-full">
      <div className="flex w-full items-center justify-center">
        <FileInput
          id="workflow-bg-file-input"
          allowedFileExtensions={["png", "jpeg", "jpg"]}
          environmentId={environmentId}
          onFileUpload={(url: string[]) => {
            if (url.length > 0) {
              handleBgChange(url[0], "upload");
            } else {
              handleBgChange("", "upload");
            }
          }}
          fileUrl={background}
          maxSizeInMB={2}
        />
      </div>
    </div>
  );
};
