import { Prisma } from "@prisma/client";

import { selectDisplay } from "../../service";

export const mockEnvironmentId = "clqkr5961000108jyfnjmbjhi";
export const mockSingleUseId = "qj57j3opsw8b5sxgea20fgcq";
export const mockWorkflowId = "clqkr8dlv000308jybb08evgr";
export const mockUserId = "qwywazmugeezyfr3zcg9jk8a";
export const mockDisplayId = "clqkr5smu000208jy50v6g5k4";
export const mockId = "ars2tjk8hsi8oqk1uac00mo8";
export const mockPersonId = "clqnj99r9000008lebgf8734j";
export const mockResponseId = "clqnfg59i000208i426pb4wcv";

function createMockDisplay(overrides = {}) {
  return {
    id: mockDisplayId,
    createdAt: new Date(),
    updatedAt: new Date(),
    workflowId: mockWorkflowId,
    responseId: null,
    personId: null,
    status: null,
    ...overrides,
  };
}

export const mockDisplay = createMockDisplay();

export const mockDisplayWithPersonId = createMockDisplay({ personId: mockPersonId });

export const mockDisplayWithResponseId = createMockDisplay({
  personId: mockPersonId,
  responseId: mockResponseId,
});

export const mockDisplayInput = {
  environmentId: mockEnvironmentId,
  workflowId: mockWorkflowId,
};
export const mockDisplayInputWithUserId = {
  ...mockDisplayInput,
  userId: mockUserId,
};
export const mockDisplayInputWithResponseId = {
  ...mockDisplayInputWithUserId,
  responseId: mockResponseId,
};

export const mockDisplayLegacyInput = {
  responseId: mockResponseId,
  workflowId: mockWorkflowId,
};
export const mockDisplayLegacyInputWithPersonId = {
  ...mockDisplayLegacyInput,
  personId: mockPersonId,
};

export const mockDisplayUpdate = {
  environmentId: mockEnvironmentId,
  userId: mockUserId,
  responseId: mockResponseId,
};

export const mockDisplayLegacyUpdateInput = {
  personId: mockPersonId,
  responseId: mockResponseId,
};

export const mockDisplayLegacyWithRespondedStatus: Prisma.DisplayGetPayload<{
  select: typeof selectDisplay;
}> = {
  ...mockDisplayWithPersonId,
  status: "responded",
};
