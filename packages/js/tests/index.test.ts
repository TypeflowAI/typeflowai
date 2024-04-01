/**
 * @jest-environment jsdom
 */
import {
  mockEventTrackResponse,
  mockInitResponse,
  mockRegisterRouteChangeResponse,
  mockResetResponse,
  mockSetCustomAttributeResponse,
  mockSetEmailIdResponse,
  mockSetUserIdResponse,
  mockUpdateEmailResponse,
} from "./__mocks__/apiMock";

import { TPersonAttributes } from "@typeflowai/types/people";

import typeflowai from "../src/index";
import { constants } from "./constants";

const consoleLogMock = jest.spyOn(console, "log").mockImplementation();

test("Test Jest", () => {
  expect(1 + 9).toBe(10);
});

const {
  environmentId,
  apiHost,
  initialUserId,
  initialUserEmail,
  updatedUserEmail,
  customAttributeKey,
  customAttributeValue,
} = constants;

beforeEach(() => {
  fetchMock.resetMocks();
});

/*
test("TypeflowAI should Initialise", async () => {
  mockInitResponse();

  await typeflowai.init({
    environmentId,
    apiHost,
    userId: initialUserId,
  });

  const configFromBrowser = localStorage.getItem("typeflowai-js");
  expect(configFromBrowser).toBeTruthy();

  if (configFromBrowser) {
    const jsonSavedConfig = JSON.parse(configFromBrowser);
    expect(jsonSavedConfig.environmentId).toStrictEqual(environmentId);
    expect(jsonSavedConfig.apiHost).toStrictEqual(apiHost);
  }
});

test("TypeflowAI should set email", async () => {
  mockSetEmailIdResponse();
  await typeflowai.setEmail(initialUserEmail);

  const currentStatePerson = typeflowai.getPerson();

  const currentStatePersonAttributes = currentStatePerson.attributes;
  const numberOfUserAttributes = Object.keys(currentStatePersonAttributes).length;
  expect(numberOfUserAttributes).toStrictEqual(2);

  const userId = currentStatePersonAttributes.userId;
  expect(userId).toStrictEqual(initialUserId);
  const email = currentStatePersonAttributes.email;
  expect(email).toStrictEqual(initialUserEmail);
});

test("TypeflowAI should set custom attribute", async () => {
  mockSetCustomAttributeResponse();
  await typeflowai.setAttribute(customAttributeKey, customAttributeValue);

  const currentStatePerson = typeflowai.getPerson();

  const currentStatePersonAttributes = currentStatePerson.attributes;
  const numberOfUserAttributes = Object.keys(currentStatePersonAttributes).length;
  expect(numberOfUserAttributes).toStrictEqual(3);

  const userId = currentStatePersonAttributes.userId;
  expect(userId).toStrictEqual(initialUserId);
  const email = currentStatePersonAttributes.email;
  expect(email).toStrictEqual(initialUserEmail);
  const customAttribute = currentStatePersonAttributes[customAttributeKey];
  expect(customAttribute).toStrictEqual(customAttributeValue);
});

test("TypeflowAI should update attribute", async () => {
  mockUpdateEmailResponse();
  await typeflowai.setEmail(updatedUserEmail);

  const currentStatePerson = typeflowai.getPerson();

  const currentStatePersonAttributes = currentStatePerson.attributes;

  const numberOfUserAttributes = Object.keys(currentStatePersonAttributes).length;
  expect(numberOfUserAttributes).toStrictEqual(3);

  const userId = currentStatePersonAttributes.userId;
  expect(userId).toStrictEqual(initialUserId);
  const email = currentStatePersonAttributes.email;
  expect(email).toStrictEqual(updatedUserEmail);
  const customAttribute = currentStatePersonAttributes[customAttributeKey];
  expect(customAttribute).toStrictEqual(customAttributeValue);
});

test("TypeflowAI should track event", async () => {
  mockEventTrackResponse();
  const mockButton = document.createElement("button");
  mockButton.addEventListener("click", async () => {
    await typeflowai.track("Button Clicked");
  });
  await mockButton.click();
  expect(consoleLogMock).toHaveBeenCalledWith(
    expect.stringMatching(/TypeflowAI: Event "Button Clicked" tracked/)
  );
});

test("TypeflowAI should register for route change", async () => {
  mockRegisterRouteChangeResponse();
  await typeflowai.registerRouteChange();
  expect(consoleLogMock).toHaveBeenCalledWith(expect.stringMatching(/Checking page url/));
});

test("TypeflowAI should reset", async () => {
  mockResetResponse();
  await typeflowai.reset();
  const currentStatePerson = typeflowai.getPerson();
  const currentStatePersonAttributes = currentStatePerson.attributes;

  expect(Object.keys(currentStatePersonAttributes).length).toBe(0);
});

*/
