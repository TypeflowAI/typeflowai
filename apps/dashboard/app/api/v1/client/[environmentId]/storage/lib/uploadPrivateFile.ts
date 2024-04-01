import { responses } from "@/app/lib/api/response";

import { getUploadSignedUrl } from "@typeflowai/lib/storage/service";

const uploadPrivateFile = async (
  fileName: string,
  environmentId: string,
  fileType: string,
  plan: "free" | "paid"
) => {
  const accessType = "private"; // private files are only accessible by the user who has access to the environment
  // if s3 is not configured, we'll upload to a local folder named uploads

  try {
    const signedUrlResponse = await getUploadSignedUrl(fileName, environmentId, fileType, accessType, plan);

    return responses.successResponse({
      ...signedUrlResponse,
    });
  } catch (err) {
    return responses.internalServerErrorResponse("Internal server error");
  }
};

export default uploadPrivateFile;
