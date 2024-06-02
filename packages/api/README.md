# @typeflowai/api - API Wrapper for TypeflowAI

This is the official API wrapper for TypeflowAI. It is used to interact with the TypeflowAI API. To know more about TypeflowAI, visit [TypeflowAI.com](https://typeflowaI.com).

The direct API documentation can be found in our official docs [here](https://typeflowaI.com/docs/api/client/overview). To interact with the TypeflowAI API, you need to have an environment ID. You can get it from the TypeflowAI dashboard at [dashboard.typeflowaI.com](https://dashboard.typeflowaI.com).

## Installation

```bash
npm install @typeflowai/api
```

## Usage

### Init

```ts
import { TypeflowAIAPI } from "@typeflowai/api";

const api = new TypeflowAIAPI({
  apiHost: `https://dashboard.typeflowai.com`, // If you have self-hosted TypeflowAI, change this to your self hosted instance's URL
  environmentId: "<environment-id>", // Replace this with your TypeflowAI environment ID
});
```

The API client is now ready to be used across your project. It can be used to interact with the following models:

### Display

- Create a Display

  ```ts
  await api.client.display.create({
    workflowId: "<your-workflow-id>", // required
    userId: "<your-user-id>", // optional
    responseId: "<your-response-id>", // optional
  });
  ```

- Update a Display

  ```ts
  await api.client.display.update(
    displayId: "<your-display-id>",
    {
      userId: "<your-user-id>", // optional
      responseId: "<your-response-id>", // optional
    },
  );
  ```

### Response

- Create a Response

  ```ts
  await api.client.response.create({
    workflowId: "<your-workflow-id>", // required
    finished: boolean, // required
    data: {
      questionId: "<answer-to-this-question-in-string>",
      anotherQuestionId: 123, // answer to this question in number
      yetAnotherQuestionId: ["option1", "option2"], // answer to this question in array,
    }, // required

    userId: "<your-user-id>", // optional
    singleUseId: "<your-single-use-id>", // optional
    ttc: {
      questionId: 123, // optional
    }, // optional
    meta: {
      source: "<your-source>", // optional
      url: "<your-url>", // optional
      userAgent: {
        browser: "<your-browser>", // optional
        device: "<your-device>", // optional
        os: "<your-os>", // optional
      },
      country: "<your-country>", // optional
    }, // optional
  });
  ```

- Update a Response

  ```ts
  await api.client.response.update({
    responseId: "<your-response-id>", // required
    finished: boolean, // required
    data: {
      questionId: "<answer-to-this-question-in-string>",
      anotherQuestionId: 123, // answer to this question in number
      yetAnotherQuestionId: ["option1", "option2"], // answer to this question in array,
    }, // required
    ttc: {
      questionId: 123, // optional
    }, // optional
  });
  ```

### Action

- Create an Action

  ```ts
  await api.client.action.create({
    name: "<your-action-name>", // required
    properties: {
      key1: "value1",
      key2: "value2",
      key3AsNumber: 123,
    }, // required

    personId: "<your-person-id>", // optional
    sessionId: "<your-session-id>", // optional
  });
  ```

### People

- Create a Person

  ```ts
  await api.client.people.create({
    userId: "<your-user-id>", // required
  });
  ```

- Update a Person

  ```ts
  await api.client.people.update(personId: "<your-person-id>", // required
  {
    attributes: {
      key1: "value1",
      key2: "value2",
      key3AsNumber: 456,
    }, // required
  }
  ```

### Storage

- Upload a file

  ```ts
  await api.client.storage.uploadFile(
    file: File, // required (of interface File of the browser's File API)
    {
      allowedFileTypes: ["file-type-allowed", "for-example", "image/jpeg"], // optional
      workflowId: "<your-workflow-id>", // optional

    } // optional
  );
  ```