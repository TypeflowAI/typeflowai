import { users, workflows } from "@/playwright/utils/mock";
import { expect, test } from "@playwright/test";

import { createWorkflow, finishOnboarding, signUpAndLogin } from "./utils/helper";

test.describe("Workflow Create & Submit Response", async () => {
  test.describe.configure({ mode: "serial" });
  let url: string | null;
  const { name, email, password } = users.workflow[0];

  test("Create Workflow", async ({ page }) => {
    await createWorkflow(page, name, email, password, workflows.createAndSubmit);
    // Save & Publish Workflow
    await page.getByRole("button", { name: "Continue to Settings" }).click();

    await page.locator("#howToSendCardTrigger").click();
    await expect(page.locator("#howToSendCardOption-link")).toBeVisible();
    await page.locator("#howToSendCardOption-link").click();

    await page.getByRole("button", { name: "Publish" }).click();

    // Get URL
    await page.waitForURL(/\/environments\/[^/]+\/workflows\/[^/]+\/summary$/);
    await page.getByLabel("Copy workflow link to clipboard").click();
    url = await page.evaluate("navigator.clipboard.readText()");
  });

  test("Submit Workflow Response", async ({ page }) => {
    await page.goto(url!);
    await page.waitForURL(/\/s\/[A-Za-z0-9]+$/);

    // Welcome Card
    await expect(page.getByText(workflows.createAndSubmit.welcomeCard.headline)).toBeVisible();
    await expect(page.getByText(workflows.createAndSubmit.welcomeCard.description)).toBeVisible();
    await page.locator("#questionCard--1").getByRole("button", { name: "Next" }).click();

    // Open Text Question
    await expect(page.getByText(workflows.createAndSubmit.openTextQuestion.question)).toBeVisible();
    await expect(page.getByText(workflows.createAndSubmit.openTextQuestion.description)).toBeVisible();
    await expect(page.getByPlaceholder(workflows.createAndSubmit.openTextQuestion.placeholder)).toBeVisible();
    await page
      .getByPlaceholder(workflows.createAndSubmit.openTextQuestion.placeholder)
      .fill("This is my Open Text answer");
    await page.locator("#questionCard-0").getByRole("button", { name: "Next" }).click();

    // Single Select Question
    await expect(page.getByText(workflows.createAndSubmit.singleSelectQuestion.question)).toBeVisible();
    await expect(page.getByText(workflows.createAndSubmit.singleSelectQuestion.description)).toBeVisible();
    for (let i = 0; i < workflows.createAndSubmit.singleSelectQuestion.options.length; i++) {
      await expect(
        page
          .locator("#questionCard-1 label")
          .filter({ hasText: workflows.createAndSubmit.singleSelectQuestion.options[i] })
      ).toBeVisible();
    }
    await expect(page.getByText("Other")).toBeVisible();
    await expect(page.locator("#questionCard-1").getByRole("button", { name: "Next" })).toBeVisible();
    await expect(page.locator("#questionCard-1").getByRole("button", { name: "Back" })).toBeVisible();
    await page
      .locator("#questionCard-1 label")
      .filter({ hasText: workflows.createAndSubmit.singleSelectQuestion.options[0] })
      .click();
    await page.locator("#questionCard-1").getByRole("button", { name: "Next" }).click();

    // Multi Select Question
    await expect(page.getByText(workflows.createAndSubmit.multiSelectQuestion.question)).toBeVisible();
    await expect(page.getByText(workflows.createAndSubmit.multiSelectQuestion.description)).toBeVisible();
    for (let i = 0; i < workflows.createAndSubmit.singleSelectQuestion.options.length; i++) {
      await expect(
        page
          .locator("#questionCard-2 label")
          .filter({ hasText: workflows.createAndSubmit.multiSelectQuestion.options[i] })
      ).toBeVisible();
    }
    await expect(page.locator("#questionCard-2").getByRole("button", { name: "Next" })).toBeVisible();
    await expect(page.locator("#questionCard-2").getByRole("button", { name: "Back" })).toBeVisible();
    for (let i = 0; i < workflows.createAndSubmit.multiSelectQuestion.options.length; i++) {
      await page
        .locator("#questionCard-2 label")
        .filter({ hasText: workflows.createAndSubmit.multiSelectQuestion.options[i] })
        .click();
    }
    await page.locator("#questionCard-2").getByRole("button", { name: "Next" }).click();

    // Rating Question
    await expect(page.getByText(workflows.createAndSubmit.ratingQuestion.question)).toBeVisible();
    await expect(page.getByText(workflows.createAndSubmit.ratingQuestion.description)).toBeVisible();
    await expect(
      page.locator("#questionCard-3").getByText(workflows.createAndSubmit.ratingQuestion.lowLabel)
    ).toBeVisible();
    await expect(
      page.locator("#questionCard-3").getByText(workflows.createAndSubmit.ratingQuestion.highLabel)
    ).toBeVisible();
    expect(await page.getByRole("group", { name: "Choices" }).locator("label").count()).toBe(5);
    await expect(page.locator("#questionCard-3").getByRole("button", { name: "Next" })).not.toBeVisible();
    await expect(page.locator("#questionCard-3").getByRole("button", { name: "Back" })).toBeVisible();
    await page.locator("path").nth(3).click();

    // NPS Question
    await expect(page.getByText(workflows.createAndSubmit.npsQuestion.question)).toBeVisible();
    await expect(
      page.locator("#questionCard-4").getByText(workflows.createAndSubmit.npsQuestion.lowLabel)
    ).toBeVisible();
    await expect(
      page.locator("#questionCard-4").getByText(workflows.createAndSubmit.npsQuestion.highLabel)
    ).toBeVisible();
    await expect(page.locator("#questionCard-4").getByRole("button", { name: "Next" })).not.toBeVisible();
    await expect(page.locator("#questionCard-4").getByRole("button", { name: "Back" })).toBeVisible();

    for (let i = 0; i < 11; i++) {
      await expect(page.locator("#questionCard-4").getByText(`${i}`, { exact: true })).toBeVisible();
    }
    await page.locator("#questionCard-4").getByText("8", { exact: true }).click();

    // CTA Question
    await expect(page.getByText(workflows.createAndSubmit.ctaQuestion.question)).toBeVisible();
    await expect(
      page.getByRole("button", { name: workflows.createAndSubmit.ctaQuestion.buttonLabel })
    ).toBeVisible();
    await page.getByRole("button", { name: workflows.createAndSubmit.ctaQuestion.buttonLabel }).click();

    // Consent Question
    await expect(page.getByText(workflows.createAndSubmit.consentQuestion.question)).toBeVisible();
    await expect(page.getByText(workflows.createAndSubmit.consentQuestion.checkboxLabel)).toBeVisible();
    await expect(page.locator("#questionCard-6").getByRole("button", { name: "Next" })).toBeVisible();
    await expect(page.locator("#questionCard-6").getByRole("button", { name: "Back" })).toBeVisible();
    await page.getByText(workflows.createAndSubmit.consentQuestion.checkboxLabel).check();
    await page.locator("#questionCard-6").getByRole("button", { name: "Next" }).click();

    // Picture Select Question
    await expect(page.getByText(workflows.createAndSubmit.pictureSelectQuestion.question)).toBeVisible();
    await expect(page.getByText(workflows.createAndSubmit.pictureSelectQuestion.description)).toBeVisible();
    await expect(page.locator("#questionCard-7").getByRole("button", { name: "Next" })).toBeVisible();
    await expect(page.locator("#questionCard-7").getByRole("button", { name: "Back" })).toBeVisible();
    await expect(page.getByRole("img", { name: "puppy-1-small.jpg" })).toBeVisible();
    await expect(page.getByRole("img", { name: "puppy-2-small.jpg" })).toBeVisible();
    await page.getByRole("img", { name: "puppy-1-small.jpg" }).click();
    await page.locator("#questionCard-7").getByRole("button", { name: "Next" }).click();

    // File Upload Question
    await expect(page.getByText(workflows.createAndSubmit.fileUploadQuestion.question)).toBeVisible();
    await expect(page.locator("#questionCard-8").getByRole("button", { name: "Next" })).toBeVisible();
    await expect(page.locator("#questionCard-8").getByRole("button", { name: "Back" })).toBeVisible();
    await expect(
      page.locator("label").filter({ hasText: "Click or drag to upload files." }).locator("div").nth(0)
    ).toBeVisible();
    await page.locator("input[type=file]").setInputFiles({
      name: "file.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("this is test"),
    });
    await page.getByText("Uploading...").waitFor({ state: "hidden" });
    await page.locator("#questionCard-8").getByRole("button", { name: "Next" }).click();

    // Matrix Question
    await expect(page.getByText(workflows.createAndSubmit.matrix.question)).toBeVisible();
    await expect(page.getByText(workflows.createAndSubmit.matrix.description)).toBeVisible();
    await expect(page.getByRole("cell", { name: workflows.createAndSubmit.matrix.rows[0] })).toBeVisible();
    await expect(page.getByRole("cell", { name: workflows.createAndSubmit.matrix.rows[1] })).toBeVisible();
    await expect(page.getByRole("cell", { name: workflows.createAndSubmit.matrix.rows[2] })).toBeVisible();
    await expect(page.getByRole("cell", { name: workflows.createAndSubmit.matrix.columns[0] })).toBeVisible();
    await expect(page.getByRole("cell", { name: workflows.createAndSubmit.matrix.columns[1] })).toBeVisible();
    await expect(page.getByRole("cell", { name: workflows.createAndSubmit.matrix.columns[2] })).toBeVisible();
    await expect(page.getByRole("cell", { name: workflows.createAndSubmit.matrix.columns[3] })).toBeVisible();
    await expect(page.locator("#questionCard-9").getByRole("button", { name: "Next" })).not.toBeVisible();
    await expect(page.locator("#questionCard-9").getByRole("button", { name: "Back" })).toBeVisible();
    await page.getByRole("row", { name: "Rose 🌹" }).getByRole("cell").nth(1).click();
    await page.locator("#questionCard-9").getByRole("button", { name: "Next" }).click();

    // Address Question
    await expect(page.getByText(workflows.createAndSubmit.address.question)).toBeVisible();
    await expect(page.getByPlaceholder(workflows.createAndSubmit.address.placeholder)).toBeVisible();
    await page.getByPlaceholder(workflows.createAndSubmit.address.placeholder).fill("This is my Address");
    await page.getByRole("button", { name: "Finish" }).click();

    await page.waitForTimeout(500);

    // Thank You Card
    await expect(page.getByText(workflows.createAndSubmit.thankYouCard.headline)).toBeVisible();
    await expect(page.getByText(workflows.createAndSubmit.thankYouCard.description)).toBeVisible();
  });
});

test.describe("Multi Language Workflow Create", async () => {
  test.describe.configure({ mode: "serial" });
  const { name, email, password } = users.workflow[3];
  test("Create Workflow", async ({ page }) => {
    await signUpAndLogin(page, name, email, password);
    await finishOnboarding(page);

    //add a new language
    await page.getByRole("link", { name: "Settings" }).click();
    await page.getByRole("link", { name: "Workflow Languages" }).click();
    await page.getByRole("button", { name: "Edit Languages" }).click();
    await page.getByRole("button", { name: "Add Language" }).click();
    await page.getByRole("button", { name: "Select" }).click();
    await page.getByPlaceholder("Search items").click();
    await page.getByPlaceholder("Search items").fill("Eng");
    await page.getByText("English").click();
    await page.getByRole("button", { name: "Save Changes" }).click();
    await page.getByRole("button", { name: "Edit Languages" }).click();
    await page.getByRole("button", { name: "Add Language" }).click();
    await page.getByRole("button", { name: "Select" }).click();
    await page.getByRole("textbox", { name: "Search items" }).click();
    await page.getByRole("textbox", { name: "Search items" }).fill("German");
    await page.getByText("German").nth(1).click();
    await page.getByRole("button", { name: "Save Changes" }).click();
    await page.waitForTimeout(2000);
    await page.getByRole("link", { name: "Workflows" }).click();
    await page.getByRole("button", { name: "Start from scratch Create a" }).click();
    await page.locator("#multi-lang-toggle").click();
    await page.getByRole("combobox").click();
    await page.getByLabel("English (en)").click();
    await page.getByRole("button", { name: "Set English as default" }).click();
    await page.getByLabel("German").click();
    await page.locator("#welcome-toggle").click();
    await page.getByText("Welcome CardShownOn").click();

    // Add questions in default language
    await page.getByText("Add Question").click();
    await page.getByRole("button", { name: "Single-Select" }).click();
    await page
      .locator("div")
      .filter({ hasText: /^Add QuestionAdd a new question to your workflow$/ })
      .nth(1)
      .click();
    await page.getByRole("button", { name: "Multi-Select" }).click();
    await page
      .locator("div")
      .filter({ hasText: /^Add QuestionAdd a new question to your workflow$/ })
      .nth(1)
      .click();
    await page.getByRole("button", { name: "Picture Selection" }).click();
    await page
      .locator("div")
      .filter({ hasText: /^Add QuestionAdd a new question to your workflow$/ })
      .nth(1)
      .click();
    await page.getByRole("button", { name: "Rating" }).click();
    await page
      .locator("div")
      .filter({ hasText: /^Add QuestionAdd a new question to your workflow$/ })
      .nth(1)
      .click();
    await page.getByRole("button", { name: "Net Promoter Score (NPS)" }).click();
    await page
      .locator("div")
      .filter({ hasText: /^Add QuestionAdd a new question to your workflow$/ })
      .nth(1)
      .click();
    await page.getByRole("button", { name: "Date" }).click();
    await page
      .locator("div")
      .filter({ hasText: /^Add QuestionAdd a new question to your workflow$/ })
      .nth(1)
      .click();
    await page.getByRole("button", { name: "File Upload" }).click();
    await page
      .locator("div")
      .filter({ hasText: /^Add QuestionAdd a new question to your workflow$/ })
      .nth(1)
      .click();

    await page.getByRole("button", { name: "Matrix" }).scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Matrix" }).click();
    await page
      .locator("div")
      .filter({ hasText: /^Add QuestionAdd a new question to your workflow$/ })
      .nth(1)
      .click();
    await page.getByRole("button", { name: "Address" }).click();

    // Enable translation in german
    await page.getByText("Welcome CardShownOn").click();
    await page.getByRole("button", { name: "English" }).nth(1).click();
    await page.getByRole("button", { name: "German" }).click();

    // Fill welcome card in german
    await page.locator(".editor-input").click();
    await page.locator(".editor-input").fill(workflows.germanCreate.welcomeCard.description);
    await page.getByLabel("Headline").click();
    await page.getByLabel("Headline").fill(workflows.germanCreate.welcomeCard.headline);

    // Fill Open text question in german
    await page.getByRole("button", { name: "Free text Required" }).click();
    await page.getByPlaceholder("Your question here. Recall").click();
    await page
      .getByPlaceholder("Your question here. Recall")
      .fill(workflows.germanCreate.openTextQuestion.question);
    await page.getByPlaceholder("Your question here. Recall").press("Tab");
    await page
      .getByPlaceholder("Your description here. Recall")
      .fill(workflows.germanCreate.openTextQuestion.description);
    await page.getByLabel("Placeholder").click();
    await page.getByLabel("Placeholder").fill(workflows.germanCreate.openTextQuestion.placeholder);

    // Fill Single select question in german
    await page.getByRole("button", { name: "Single-Select Required" }).click();
    await page.getByPlaceholder("Your question here. Recall").click();
    await page
      .getByPlaceholder("Your question here. Recall")
      .fill(workflows.germanCreate.singleSelectQuestion.question);
    await page.getByPlaceholder("Your description here. Recall").click();
    await page
      .getByPlaceholder("Your description here. Recall")
      .fill(workflows.germanCreate.singleSelectQuestion.description);
    await page.getByPlaceholder("Option 1").click();
    await page.getByPlaceholder("Option 1").fill(workflows.germanCreate.singleSelectQuestion.options[0]);
    await page.getByPlaceholder("Option 2").click();
    await page.getByPlaceholder("Option 2").fill(workflows.germanCreate.singleSelectQuestion.options[1]);

    // Fill Multi select question in german
    await page.getByRole("button", { name: "Multi-Select Required" }).click();
    await page.getByPlaceholder("Your question here. Recall").click();
    await page
      .getByPlaceholder("Your question here. Recall")
      .fill(workflows.germanCreate.multiSelectQuestion.question);
    await page.getByPlaceholder("Option 1").click();
    await page.getByPlaceholder("Option 1").fill(workflows.germanCreate.multiSelectQuestion.options[0]);
    await page.getByPlaceholder("Option 2").click();
    await page.getByPlaceholder("Option 2").fill(workflows.germanCreate.multiSelectQuestion.options[1]);
    await page.getByPlaceholder("Option 3").click();
    await page.getByPlaceholder("Option 3").fill(workflows.germanCreate.multiSelectQuestion.options[2]);

    // Fill Picture select question in german
    await page.getByRole("button", { name: "Picture Selection Required" }).click();
    await page.getByPlaceholder("Your question here. Recall").click();
    await page
      .getByPlaceholder("Your question here. Recall")
      .fill(workflows.germanCreate.pictureSelectQuestion.question);
    await page.getByPlaceholder("Your description here. Recall").click();
    await page
      .getByPlaceholder("Your description here. Recall")
      .fill(workflows.germanCreate.pictureSelectQuestion.description);

    // Fill Rating question in german
    await page.getByRole("button", { name: "Rating Required" }).click();
    await page.getByPlaceholder("Your question here. Recall").click();
    await page
      .getByPlaceholder("Your question here. Recall")
      .fill(workflows.germanCreate.ratingQuestion.question);
    await page.getByPlaceholder("Your description here. Recall").click();
    await page
      .getByPlaceholder("Your description here. Recall")
      .fill(workflows.germanCreate.ratingQuestion.description);
    await page.getByPlaceholder("Not good").click();
    await page.getByPlaceholder("Not good").fill(workflows.germanCreate.ratingQuestion.lowLabel);
    await page.getByPlaceholder("Very satisfied").click();
    await page.getByPlaceholder("Very satisfied").fill(workflows.germanCreate.ratingQuestion.highLabel);

    // Fill NPS question in german
    await page.getByRole("button", { name: "Net Promoter Score (NPS) Required" }).click();
    await page.getByPlaceholder("Your question here. Recall").click();
    await page
      .getByPlaceholder("Your question here. Recall")
      .fill(workflows.germanCreate.npsQuestion.question);
    await page.getByLabel("Lower Label").click();
    await page.getByLabel("Lower Label").fill(workflows.germanCreate.npsQuestion.lowLabel);
    await page.getByLabel("Upper Label").click();
    await page.getByLabel("Upper Label").fill(workflows.germanCreate.npsQuestion.highLabel);

    // Fill Date question in german
    await page.getByRole("button", { name: "Date Required" }).click();
    await page.getByPlaceholder("Your question here. Recall").click();
    await page
      .getByPlaceholder("Your question here. Recall")
      .fill(workflows.germanCreate.dateQuestion.question);

    // Fill File upload question in german
    await page.getByRole("button", { name: "File Upload Required" }).click();
    await page.getByPlaceholder("Your question here. Recall").click();
    await page
      .getByPlaceholder("Your question here. Recall")
      .fill(workflows.germanCreate.fileUploadQuestion.question);

    // Fill Matrix question in german
    await page.getByRole("button", { name: "9 Matrix" }).click();
    await page.getByPlaceholder("Your question here. Recall").click();
    await page.getByPlaceholder("Your question here. Recall").fill(workflows.germanCreate.matrix.question);
    await page.getByPlaceholder("Your description here. Recall").click();
    await page
      .getByPlaceholder("Your description here. Recall")
      .fill(workflows.germanCreate.matrix.description);
    await page.locator("#row-0").click();
    await page.locator("#row-0").fill(workflows.germanCreate.matrix.rows[0]);
    await page.locator("#row-1").click();
    await page.locator("#row-1").fill(workflows.germanCreate.matrix.rows[1]);
    await page.locator("#row-2").click();
    await page.locator("#row-2").fill(workflows.germanCreate.matrix.rows[2]);
    await page.locator("#column-0").click();
    await page.locator("#column-0").fill(workflows.germanCreate.matrix.columns[0]);
    await page.locator("#column-1").click();
    await page.locator("#column-1").fill(workflows.germanCreate.matrix.columns[1]);
    await page.locator("#column-2").click();
    await page.locator("#column-2").fill(workflows.germanCreate.matrix.columns[2]);
    await page.locator("#column-3").click();
    await page.locator("#column-3").fill(workflows.germanCreate.matrix.columns[3]);

    // Fill Address question in german
    await page.getByRole("button", { name: "Address Required" }).click();
    await page.getByPlaceholder("Your question here. Recall").click();
    await page
      .getByPlaceholder("Your question here. Recall")
      .fill(workflows.germanCreate.addressQuestion.question);

    // Fill Thank you card in german
    await page
      .locator("div")
      .filter({ hasText: /^Thank You CardShown$/ })
      .first()
      .click();
    await page.getByPlaceholder("Your question here. Recall").click();
    await page
      .getByPlaceholder("Your question here. Recall")
      .fill(workflows.germanCreate.thankYouCard.headline);
    await page.getByPlaceholder("Your description here. Recall").click();
    await page
      .getByPlaceholder("Your description here. Recall")
      .fill(workflows.germanCreate.thankYouCard.description);
    await page.getByRole("button", { name: "Continue to Settings" }).click();
    await page.locator("#howToSendCardTrigger").click();
    await page.locator("#howToSendCardOption-link").click();
    await page.getByRole("button", { name: "Publish" }).click();

    await page.waitForURL(/\/environments\/[^/]+\/workflows\/[^/]+\/summary$/);
    await page.getByLabel("Select Language").click();
    await page.getByText("German").click();
    await page.getByLabel("Copy workflow link to clipboard").click();
    const germanWorkflowUrl = await page.evaluate("navigator.clipboard.readText()");
    expect(germanWorkflowUrl).toContain("lang=de");
  });
});
