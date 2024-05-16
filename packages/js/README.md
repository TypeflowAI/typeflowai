# TypeflowAI Browser JS Library

[![npm package](https://img.shields.io/npm/v/@typeflowai/js?style=flat-square)](https://www.npmjs.com/package/@typeflowai/js)
[![MIT License](https://img.shields.io/badge/License-MIT-red.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Please see [TypeflowAI Docs](https://typeflowai.com/docs).
Specifically, [Quickstart/Implementation details](https://typeflowai.com/docs/getting-started/quickstart-in-app-workflow).

## What is TypeflowAI

TypeflowAI is your go-to solution for in-product micro-workflows that will supercharge your product experience! 🚀 For more information please check out [typeflowai.com](https://typeflowai.com).

## How to use this library

1. Install the TypeflowAI package inside your project using npm:

```bash
npm install -s @typeflowai/js
```

1. Import TypeflowAI and initialize the widget in your main component (e.g., App.tsx or App.js):

For `Website` workflows:

```javascript
import typeflowai from "@typeflowai/js/website";

if (typeof window !== "undefined") {
  typeflowai.init({
    environmentId: "your-environment-id",
    apiHost: "https://app.typeflowai.com",
  });
}
```

For `App` workflows:

```javascript
import typeflowai from "@typeflowai/js/app";

if (typeof window !== "undefined") {
  typeflowai.init({
    environmentId: "your-environment-id",
    apiHost: "https://app.typeflowai.com",
    userId: "REPLACE_WITH_DYNAMIC_ID",
  });
}
```

Replace your-environment-id with your actual environment ID. You can find your environment ID in the **Setup Checklist** in the TypeflowAI settings. If you are using `App` workflows please make sure to pass a unique user identifier to the TypeflowAI SDK.

For more detailed guides for different frameworks, check out our [Framework Guides](https://typeflowai.com/docs/getting-started/framework-guides).
