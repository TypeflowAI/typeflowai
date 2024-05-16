import { finishOnboarding, signUpAndLogin } from "@/playwright/utils/helper";
import { users } from "@/playwright/utils/mock";
import { expect, test } from "@playwright/test";

const { name, email, password } = users.workflow[2];

test.describe("API Tests", () => {
  let workflowId: string;
  let environmentId: string;
  let apiKey: string;
  test("Copy API Key for API Calls", async ({ page }) => {
    await signUpAndLogin(page, name, email, password);
    await finishOnboarding(page);

    await page.waitForURL(/\/environments\/[^/]+\/workflows/);
    environmentId =
      /\/environments\/([^/]+)\/workflows/.exec(page.url())?.[1] ??
      (() => {
        throw new Error("Unable to parse environmentId from URL");
      })();

    await page.goto(`/environments/${environmentId}/settings/api-keys`);

    await page.getByRole("button", { name: "Add Production API Key" }).isVisible();
    await page.getByRole("button", { name: "Add Production API Key" }).click();
    await page.getByPlaceholder("e.g. GitHub, PostHog, Slack").fill("E2E Test API Key");
    await page.getByRole("button", { name: "Add API Key" }).click();
    await page.locator("main").filter({ hasText: "Account" }).getByRole("img").nth(1).click();

    apiKey = await page.evaluate("navigator.clipboard.readText()");
  });

  test("Create Workflow from API", async ({ request }) => {
    const response = await request.post(`/api/v1/management/workflows`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      data: {
        environmentId: environmentId,
        type: "link",
        name: "My new Workflow from API",
      },
    });

    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    expect(responseBody.data.name).toEqual("My new Workflow from API");
    expect(responseBody.data.environmentId).toEqual(environmentId);
  });

  test("List Workflows from API", async ({ request }) => {
    const response = await request.get(`/api/v1/management/workflows`, {
      headers: {
        "x-api-key": apiKey,
      },
    });
    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();

    const workflowCount = responseBody.data.length;
    expect(workflowCount).toEqual(1);

    workflowId = responseBody.data[0].id;
  });

  test("Get Workflow by ID from API", async ({ request }) => {
    const responseWorkflow = await request.get(`/api/v1/management/workflows/${workflowId}`, {
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
      },
    });
    expect(responseWorkflow.ok()).toBeTruthy();
    const responseBodyWorkflow = await responseWorkflow.json();

    expect(responseBodyWorkflow.data.id).toEqual(workflowId);
  });

  test("Updated Workflow by ID from API", async ({ request }) => {
    const response = await request.put(`/api/v1/management/workflows/${workflowId}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      data: {
        name: "My updated Workflow from API",
      },
    });

    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    expect(responseBody.data.name).toEqual("My updated Workflow from API");
  });

  test("Delete Workflow by ID from API", async ({ request }) => {
    const response = await request.delete(`/api/v1/management/workflows/${workflowId}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    });
    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    expect(responseBody.data.name).toEqual("My updated Workflow from API");

    const responseWorkflow = await request.get(`/api/v1/management/workflows/${workflowId}`, {
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
      },
    });
    expect(responseWorkflow.ok()).toBeFalsy();
  });
});
