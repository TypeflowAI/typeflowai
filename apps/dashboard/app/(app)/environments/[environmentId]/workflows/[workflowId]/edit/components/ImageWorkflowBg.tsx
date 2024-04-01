import { TWorkflow } from "@typeflowai/types/workflows";
import FileInput from "@typeflowai/ui/FileInput";

interface ImageWorkflowBgBgProps {
  localWorkflow?: TWorkflow;
  handleBgChange: (url: string, bgType: string) => void;
}

export default function ImageWorkflowBg({ localWorkflow, handleBgChange }: ImageWorkflowBgBgProps) {
  const isUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch (error) {
      return false;
    }
  };

  const fileUrl = isUrl(localWorkflow?.styling?.background?.bg ?? "")
    ? localWorkflow?.styling?.background?.bg ?? ""
    : "";

  return (
    <div className="mb-2 mt-4 w-full rounded-lg border bg-slate-50 p-4">
      <div className="flex w-full items-center justify-center">
        <FileInput
          id="workflow-bg-file-input"
          allowedFileExtensions={["png", "jpeg", "jpg"]}
          environmentId={localWorkflow?.environmentId}
          onFileUpload={(url: string[]) => {
            if (url.length > 0) {
              handleBgChange(url[0], "image");
            } else {
              handleBgChange("#ffff", "color");
            }
          }}
          fileUrl={fileUrl}
        />
      </div>
    </div>
  );
}
