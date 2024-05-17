import { getPreviewEmailTemplateHtml } from "@typeflowai/email/components/workflow/PreviewEmailTemplate";
import { WEBAPP_URL } from "@typeflowai/lib/constants";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getStyling } from "@typeflowai/lib/utils/styling";
import { getWorkflow } from "@typeflowai/lib/workflow/service";

export const getEmailTemplateHtml = async (workflowId: string) => {
  const workflow = await getWorkflow(workflowId);
  if (!workflow) {
    throw new Error("Workflow not found");
  }
  const product = await getProductByEnvironmentId(workflow.environmentId);
  if (!product) {
    throw new Error("Product not found");
  }
  const styling = getStyling(product, workflow);
  const workflowUrl = WEBAPP_URL + "/s/" + workflow.id;
  const html = getPreviewEmailTemplateHtml(workflow, workflowUrl, styling);
  const doctype =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
  const htmlCleaned = html.toString().replace(doctype, "");

  return htmlCleaned;
};
