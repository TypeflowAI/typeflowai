interface WorkflowNavBarNameProps {
  workflowName: string;
  productName: string;
}

export default function WorkflowNavBarName({ workflowName, productName }: WorkflowNavBarNameProps) {
  return (
    <div className="hidden items-center space-x-2 whitespace-nowrap md:flex">
      {/*       <Button
        variant="secondary"
        StartIcon={ArrowLeftIcon}
        onClick={() => {
          router.back();
        }}>
        Back
      </Button> */}
      <p className="pl-4 font-semibold">{productName} / </p>
      <span>{workflowName}</span>
    </div>
  );
}
