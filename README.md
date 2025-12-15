# OCP API Codegen (Node.js)

[![npm version](https://img.shields.io/npm/v/@openconfig-protocol/codegen.svg)](https://www.npmjs.com/package/@openconfig-protocol/codegen)
[![npm downloads](https://img.shields.io/npm/dm/@openconfig-protocol/codegen.svg)](https://www.npmjs.com/package/@openconfig-protocol/codegen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Node.js SDK generator for REST APIs using the Open Config Protocol (OCP) schema format.

## Overview

OCP API Codegen reads a declarative JSON schema that describes your REST API and generates a fully-typed Node.js/TypeScript client SDK. The generated SDK includes:

- **TypeScript type definitions** (`index.d.ts`) - Full type safety for all endpoints, parameters, and responses
- **Runtime client** (`index.js`) - Zero-dependency HTTP client with built-in authentication handling

## Installation

```bash
npm install -g @openconfig-protocol/codegen
```

Or use directly with npx:

```bash
npx @openconfig-protocol/codegen ./api-schema.json -o ./src/generated
```

## Usage

### Basic Usage

```bash
# Generate SDK from schema
ocp-codegen ./api-schema.json

# Generate SDK to specific directory
ocp-codegen ./api-schema.json -o ./src/generated

# Validate schema only (no generation)
ocp-codegen ./api-schema.json --validate
```

### CLI Options

| Option | Description |
|--------|-------------|
| `-o, --output <dir>` | Output directory (default: current directory) |
| `-v, --validate` | Validate schema only, don't generate |
| `--version` | Show version |
| `-h, --help` | Show help |

## AI-Assisted Schema Generation

You can use an LLM (Claude, GPT, etc.) to generate OCP schemas from your API documentation. Copy the prompt below and provide your API docs:

<details>
<summary><strong>Click to expand the LLM prompt</strong></summary>

```
You are an API schema generator. Your task is to analyze API documentation and generate a valid OCP (Open Config Protocol) schema in JSON format.

## OCP Schema Structure

Generate a JSON object with this structure:

{
  "$ocp": {
    "type": "rest",
    "version": "1.0.0"
  },
  "meta": {
    "name": "api-name-here",
    "base_url": "https://api.example.com",
    "auth": {
      "type": "bearer" | "api_key" | "oauth2_client_credentials",
      // For oauth2_client_credentials, also include:
      "token_endpoint": "/oauth/token"
    }
  },
  "endpoints": {
    "group_name": {
      "endpoint_name": {
        "method": "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
        "path": "/path/:param",
        "summary": "Brief description",
        "params": {
          "param": { "type": "string", "required": true, "description": "..." }
        },
        "query": {
          "filter": { "type": "string", "required": false }
        },
        "body": {
          "fields": {
            "field_name": { "type": "string", "required": true }
          }
        },
        "response": {
          "type": "ResponseTypeName",
          "array": true | false
        },
        "pagination": true | false
      }
    }
  }
}

## Rules

1. Group related endpoints logically (e.g., "users", "orders", "products")
2. Use snake_case for endpoint names and group names
3. Use :param syntax for path parameters (e.g., "/users/:id")
4. Supported types: "string", "integer", "number", "boolean", "array", "object"
5. Mark parameters as required: true only if they are mandatory
6. Create descriptive response type names in PascalCase (e.g., "User", "Order", "ProductList")
7. Set pagination: true for list endpoints that support pagination
8. Include the auth type that matches the API's authentication method

## Your Task

Analyze the following API documentation and generate a complete OCP schema. Include ALL endpoints you find. Be thorough and accurate.

---

[PASTE YOUR API DOCUMENTATION HERE]
```

</details>

### Example Workflow

1. Copy the prompt above
2. Paste your API documentation after the `---`
3. Send to your preferred LLM
4. Save the generated JSON as `api-schema.json`
5. Run: `ocp-codegen api-schema.json -o ./src/sdk`

## OCP Schema Format

OCP schemas are JSON files that describe your API in a structured, machine-readable format.

### Minimal Example

```json
{
  "$ocp": {
    "type": "rest",
    "version": "1.0.0"
  },
  "meta": {
    "name": "my-api",
    "base_url": "https://api.example.com",
    "auth": {
      "type": "bearer"
    }
  },
  "endpoints": {
    "users": {
      "list": {
        "method": "GET",
        "path": "/users",
        "response": {
          "type": "User",
          "array": true
        }
      },
      "get": {
        "method": "GET",
        "path": "/users/:id",
        "params": {
          "id": { "type": "string", "required": true }
        },
        "response": {
          "type": "User"
        }
      },
      "create": {
        "method": "POST",
        "path": "/users",
        "body": {
          "fields": {
            "name": { "type": "string", "required": true },
            "email": { "type": "string", "required": true }
          }
        },
        "response": {
          "type": "User"
        }
      }
    }
  }
}
```

### Authentication Types

OCP supports multiple authentication strategies:

| Type | Config Fields | Description |
|------|---------------|-------------|
| `bearer` | `token` | Static bearer token |
| `api_key` | `apiKey` | API key authentication |
| `oauth2_client_credentials` | `clientId`, `clientSecret` | OAuth2 with automatic token refresh |

### Dynamic Base URLs

Use placeholders in `base_url` for multi-tenant or environment-specific APIs:

```json
{
  "meta": {
    "base_url": "https://{subdomain}.api.example.com/v1"
  }
}
```

The placeholder becomes a required config field:

```javascript
const client = createMyApiClient({
  subdomain: 'acme',
  token: 'your-token'
});
```

## Generated SDK Usage

```javascript
const { createMyApiClient } = require('./generated');

// Initialize client
const client = createMyApiClient({
  token: 'your-bearer-token',
  timeout: 30000 // optional, defaults to 30s
});

// Use typed methods
const users = await client.users.list();
const user = await client.users.get({ id: '123' });
const newUser = await client.users.create({
  name: 'John Doe',
  email: 'john@example.com'
});
```

## Schema Validation

The codegen validates your schema before generation:

- Checks for required `$ocp` marker with `type` and `version`
- Validates `meta` section has `name` and `base_url`
- Ensures all endpoints have valid HTTP methods and paths
- Reports all validation errors with clear messages

## Project Structure

```
ocp-api-codegen-node/
├── bin/
│   └── ocp-api-codegen.js    # CLI entry point
├── lib/
│   └── codegen.js            # Core generation logic
├── schemas/
│   ├── ocp-base.schema.json  # Base OCP JSON schema
│   └── ocp-rest.schema.json  # REST extension schema
└── package.json
```

## Requirements

- Node.js >= 14.0.0

## License

MIT License - see [LICENSE](LICENSE) for details.
