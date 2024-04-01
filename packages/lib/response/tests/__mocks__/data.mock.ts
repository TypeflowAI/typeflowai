import { Prisma } from "@prisma/client";

import { TDisplay } from "@typeflowai/types/displays";
import { TResponseUpdateInput } from "@typeflowai/types/responses";

import { responseNoteSelect } from "../../../responseNote/service";
import { responseSelection } from "../../service";
import { constantsForTests } from "../constants";

type ResponseMock = Prisma.ResponseGetPayload<{
  include: typeof responseSelection;
}>;
type ResponseNoteMock = Prisma.ResponseNoteGetPayload<{
  include: typeof responseNoteSelect;
}>;
type ResponsePersonMock = Prisma.PersonGetPayload<{
  select: typeof responseSelection.person.select;
}>;

export const mockEnvironmentId = "cklvb8se400003h5x2ssb9kzh";
export const mockPersonId = "cklvb8sfh00013h5xp97sdy3b";
export const mockResponseId = "cklvb8sgn00023h5xe2d0wzkg";
export const mockSingleUseId = "cklvb8shj00033h5x7gp2c5rn";
export const mockWorkflowId = "cklvb8sho00043h5x3ghjsc6n";
export const mockDisplayId = "cklvb8sht00053h5x2d8qwe7m";
export const mockUserId = "d26b4f6e-5e8f-4aee-a8f5-95f3a6f8e7b3";

export const mockMeta = {
  source: constantsForTests.url,
  url: constantsForTests.url,
  userAgent: {
    browser: constantsForTests.browser,
    os: constantsForTests.text,
    device: constantsForTests.text,
  },
};

export const mockResponseNote: ResponseNoteMock = {
  id: "clnndevho0mqrqp0fm2ozul8p",
  createdAt: new Date(),
  updatedAt: new Date(),
  text: constantsForTests.text,
  isEdited: constantsForTests.boolean,
  isResolved: constantsForTests.boolean,
  responseId: mockResponseId,
  userId: mockUserId,
  response: {
    id: mockResponseId,
    workflowId: mockWorkflowId,
  },
  user: {
    id: mockPersonId,
    name: constantsForTests.fullName,
  },
};

export const mockPerson: ResponsePersonMock = {
  id: mockPersonId,
  userId: mockUserId,
  createdAt: new Date(),
  updatedAt: new Date(),
  environmentId: mockEnvironmentId,
  attributes: [
    {
      value: "attribute1",
      attributeClass: {
        name: "attributeClass1",
      },
    },
  ],
};

export const mockTags = [
  {
    tag: {
      id: constantsForTests.uuid,
      name: "tag1",
      createdAt: new Date(),
      updatedAt: new Date(),
      environmentId: mockEnvironmentId,
    },
  },
];

export const mockDisplay: TDisplay = {
  id: mockDisplayId,
  createdAt: new Date(),
  updatedAt: new Date(),
  workflowId: mockWorkflowId,
  personId: mockPersonId,
  responseId: mockResponseId,
};

export const mockResponse: ResponseMock = {
  id: mockResponseId,
  workflowId: mockWorkflowId,
  singleUseId: mockSingleUseId,
  data: {},
  person: null,
  personAttributes: {},
  createdAt: new Date(),
  finished: constantsForTests.boolean,
  meta: mockMeta,
  notes: [mockResponseNote],
  tags: mockTags,
  personId: mockPersonId,
  updatedAt: new Date(),
  ttc: {},
};

export const mockResponseWithMockPerson: ResponseMock = {
  ...mockResponse,
  person: mockPerson,
};

export const mockResponseData: TResponseUpdateInput["data"] = {
  key1: "value",
  key2: ["value1", "value2"],
  key3: 20,
};

export const getMockUpdateResponseInput = (finished: boolean = false): TResponseUpdateInput => ({
  data: mockResponseData,
  finished,
});
