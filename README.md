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

Use an LLM to automatically generate OCP schemas from API documentation. Choose the prompt that matches your situation:

### Option 1: From a URL (Web Scraping)

Use this when you have a link to online API documentation. Requires an LLM with web access (Claude with web fetch, ChatGPT with browsing, etc.)

<details>
<summary><strong>Click to expand URL prompt</strong></summary>

~~~
You are an expert API analyst specializing in REST API documentation analysis and schema generation.

<task>
Fetch the API documentation from the provided URL, thoroughly explore ALL pages and sections, then generate a complete OCP (Open Config Protocol) schema.
</task>

<instructions>
1. Fetch the main documentation URL
2. Identify and explore ALL linked pages (endpoints, authentication, pagination, etc.)
3. Extract every endpoint with its method, path, parameters, request body, and response
4. Determine the authentication method used
5. Note any pagination patterns
6. Generate the OCP schema
7. Verify completeness before outputting
</instructions>

<schema_format>
{
  "$ocp": { "type": "rest", "version": "1.0.0" },
  "meta": {
    "name": "api-name-in-kebab-case",
    "base_url": "https://api.example.com",
    "auth": { "type": "bearer|api_key|oauth2_client_credentials", "token_endpoint": "/oauth/token" }
  },
  "endpoints": {
    "resource_group": {
      "endpoint_name": {
        "method": "GET|POST|PUT|PATCH|DELETE",
        "path": "/resources/:id",
        "summary": "Brief description",
        "params": { "id": { "type": "string", "required": true } },
        "query": { "limit": { "type": "integer", "required": false } },
        "body": { "fields": { "name": { "type": "string", "required": true } } },
        "response": { "type": "ResourceName", "array": false },
        "pagination": false
      }
    }
  }
}
</schema_format>

<rules>
- Group endpoints by resource (users, orders, products, etc.)
- Use snake_case for group and endpoint names
- Use :param for path parameters (e.g., /users/:id)
- Types: "string", "integer", "number", "boolean", "array", "object"
- Response type names in PascalCase (User, Order, Product)
- Set "pagination": true for list endpoints that return paginated results
- Omit optional sections (params, query, body) if not applicable
- If auth method is unclear, use "bearer" as default
- If base_url has environment variations, use the production URL
</rules>

<example>
Input: "GET /users - List all users, GET /users/{id} - Get user by ID, POST /users - Create user (requires name, email)"

Output:
{
  "$ocp": { "type": "rest", "version": "1.0.0" },
  "meta": { "name": "example-api", "base_url": "https://api.example.com", "auth": { "type": "bearer" } },
  "endpoints": {
    "users": {
      "list": { "method": "GET", "path": "/users", "response": { "type": "User", "array": true }, "pagination": true },
      "get": { "method": "GET", "path": "/users/:id", "params": { "id": { "type": "string", "required": true } }, "response": { "type": "User" } },
      "create": { "method": "POST", "path": "/users", "body": { "fields": { "name": { "type": "string", "required": true }, "email": { "type": "string", "required": true } } }, "response": { "type": "User" } }
    }
  }
}
</example>

<output_instructions>
- Output ONLY the JSON schema, no explanations or markdown code fences
- Ensure valid JSON (proper commas, quotes, brackets)
- Before outputting, verify: Did I capture ALL endpoints? Is the JSON valid?
</output_instructions>

<url>
[PASTE API DOCUMENTATION URL HERE]
</url>
~~~

</details>

### Option 2: From Text (Paste Documentation)

Use this when you have API documentation as text (copied from a PDF, internal docs, etc.)

<details>
<summary><strong>Click to expand text prompt</strong></summary>

~~~
You are an expert API analyst specializing in REST API documentation analysis and schema generation.

<task>
Analyze the provided API documentation and generate a complete OCP (Open Config Protocol) schema capturing ALL endpoints.
</task>

<instructions>
1. Read through the entire documentation carefully
2. Identify every endpoint (method + path combination)
3. Extract parameters, request bodies, and response types
4. Determine the authentication method
5. Note any pagination patterns
6. Generate the OCP schema
7. Verify completeness before outputting
</instructions>

<schema_format>
{
  "$ocp": { "type": "rest", "version": "1.0.0" },
  "meta": {
    "name": "api-name-in-kebab-case",
    "base_url": "https://api.example.com",
    "auth": { "type": "bearer|api_key|oauth2_client_credentials", "token_endpoint": "/oauth/token" }
  },
  "endpoints": {
    "resource_group": {
      "endpoint_name": {
        "method": "GET|POST|PUT|PATCH|DELETE",
        "path": "/resources/:id",
        "summary": "Brief description",
        "params": { "id": { "type": "string", "required": true } },
        "query": { "limit": { "type": "integer", "required": false } },
        "body": { "fields": { "name": { "type": "string", "required": true } } },
        "response": { "type": "ResourceName", "array": false },
        "pagination": false
      }
    }
  }
}
</schema_format>

<rules>
- Group endpoints by resource (users, orders, products, etc.)
- Use snake_case for group and endpoint names
- Use :param for path parameters (e.g., /users/:id)
- Types: "string", "integer", "number", "boolean", "array", "object"
- Response type names in PascalCase (User, Order, Product)
- Set "pagination": true for list endpoints that return paginated results
- Omit optional sections (params, query, body) if not applicable
- If auth method is unclear, use "bearer" as default
- If base_url has environment variations, use the production URL
</rules>

<example>
Input: "GET /users - List all users, GET /users/{id} - Get user by ID, POST /users - Create user (requires name, email)"

Output:
{
  "$ocp": { "type": "rest", "version": "1.0.0" },
  "meta": { "name": "example-api", "base_url": "https://api.example.com", "auth": { "type": "bearer" } },
  "endpoints": {
    "users": {
      "list": { "method": "GET", "path": "/users", "response": { "type": "User", "array": true }, "pagination": true },
      "get": { "method": "GET", "path": "/users/:id", "params": { "id": { "type": "string", "required": true } }, "response": { "type": "User" } },
      "create": { "method": "POST", "path": "/users", "body": { "fields": { "name": { "type": "string", "required": true }, "email": { "type": "string", "required": true } } }, "response": { "type": "User" } }
    }
  }
}
</example>

<output_instructions>
- Output ONLY the JSON schema, no explanations or markdown code fences
- Ensure valid JSON (proper commas, quotes, brackets)
- Before outputting, verify: Did I capture ALL endpoints? Is the JSON valid?
</output_instructions>

<documentation>
[PASTE YOUR API DOCUMENTATION HERE]
</documentation>
~~~

</details>

### Option 3: From OpenAPI/Swagger Spec

Use this when the API already has an OpenAPI (Swagger) specification file.

<details>
<summary><strong>Click to expand OpenAPI conversion prompt</strong></summary>

~~~
You are an expert API analyst specializing in OpenAPI/Swagger specification conversion.

<task>
Convert the provided OpenAPI/Swagger specification into an OCP (Open Config Protocol) schema.
</task>

<instructions>
1. Parse the OpenAPI spec (JSON or YAML)
2. Extract the base URL from servers[0].url
3. Identify the authentication scheme from securityDefinitions/components.securitySchemes
4. Convert each path+method combination into an OCP endpoint
5. Group endpoints by their first path segment or tag
6. Map OpenAPI types to OCP types
7. Generate the OCP schema
</instructions>

<type_mapping>
OpenAPI → OCP:
- string → "string"
- integer/int32/int64 → "integer"
- number/float/double → "number"
- boolean → "boolean"
- array → "array"
- object → "object"
</type_mapping>

<schema_format>
{
  "$ocp": { "type": "rest", "version": "1.0.0" },
  "meta": {
    "name": "api-name-in-kebab-case",
    "base_url": "https://api.example.com",
    "auth": { "type": "bearer|api_key|oauth2_client_credentials", "token_endpoint": "/oauth/token" }
  },
  "endpoints": {
    "resource_group": {
      "endpoint_name": {
        "method": "GET|POST|PUT|PATCH|DELETE",
        "path": "/resources/:id",
        "summary": "Brief description",
        "params": { "id": { "type": "string", "required": true } },
        "query": { "limit": { "type": "integer", "required": false } },
        "body": { "fields": { "name": { "type": "string", "required": true } } },
        "response": { "type": "ResourceName", "array": false },
        "pagination": false
      }
    }
  }
}
</schema_format>

<rules>
- Convert path parameters from {param} to :param format
- Group by OpenAPI tags, or by first path segment if no tags
- Use snake_case for group and endpoint names
- Derive endpoint names from operationId or path (e.g., GET /users → list, GET /users/{id} → get)
- Set pagination: true for endpoints returning arrays with limit/offset/cursor parameters
- Map securitySchemes: OAuth2 → oauth2_client_credentials, Bearer → bearer, ApiKey → api_key
- Omit optional sections if not present in OpenAPI spec
</rules>

<output_instructions>
- Output ONLY the JSON schema, no explanations or markdown code fences
- Ensure valid JSON (proper commas, quotes, brackets)
- Before outputting, verify: Did I convert ALL paths? Is the JSON valid?
</output_instructions>

<openapi_spec>
[PASTE YOUR OPENAPI/SWAGGER SPEC HERE]
</openapi_spec>
~~~

</details>

### Workflow

1. Choose the appropriate prompt above
2. Replace the placeholder with your URL, documentation, or OpenAPI spec
3. Send to your preferred LLM (Claude, GPT-4, etc.)
4. Copy the JSON output and save as `api-schema.json`
5. Validate: `ocp-codegen api-schema.json --validate`
6. Generate: `ocp-codegen api-schema.json -o ./src/sdk`

> **Tip:** If the output includes markdown code fences or explanations, ask the LLM: "Output only the raw JSON, nothing else."

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

## Generated SDK Output

When you run the codegen, it produces two files. Here's what they look like for a Petstore API:

<details>
<summary><strong>index.d.ts (TypeScript Types)</strong></summary>

```typescript
// Auto-generated by OCP Codegen

export interface PetstoreApiConfig {
  token: string;
  timeout?: number;
}

export interface PetstoreApiPetsListParams {
  status?: string;
  limit?: number;
  cursor?: string;
}

export interface PetstoreApiPetsGetParams {
  petId: string;
}

export interface PetstoreApiPetsCreateParams {
  name: string;
  species: string;
  breed?: string;
  age?: number;
  status?: string;
}

export interface Pet {
  [key: string]: unknown;
}

export interface PetstoreApiPaginatedResponse<T> {
  data: T[];
  pagination?: {
    after_cursor: string | null;
  };
}

export interface PetstoreApiClient {
  pets: {
    list(params: PetstoreApiPetsListParams): Promise<PetstoreApiPaginatedResponse<Pet>>;
    get(params: PetstoreApiPetsGetParams): Promise<Pet>;
    create(params: PetstoreApiPetsCreateParams): Promise<Pet>;
    update(params: PetstoreApiPetsUpdateParams): Promise<Pet>;
    delete(params: PetstoreApiPetsDeleteParams): Promise<void>;
  };
  orders: {
    list(params: PetstoreApiOrdersListParams): Promise<PetstoreApiPaginatedResponse<Order>>;
    get(params: PetstoreApiOrdersGetParams): Promise<Order>;
    create(params: PetstoreApiOrdersCreateParams): Promise<Order>;
    cancel(params: PetstoreApiOrdersCancelParams): Promise<void>;
  };
  users: {
    me(): Promise<User>;
    updateMe(params: PetstoreApiUsersUpdateMeParams): Promise<User>;
  };
}

export declare function createPetstoreApiClient(config: PetstoreApiConfig): PetstoreApiClient;
```

</details>

The generated `index.js` contains a zero-dependency HTTP client with:
- Automatic authentication header injection
- OAuth2 token refresh (for `oauth2_client_credentials`)
- Request timeout handling
- JSON parsing and error handling

> **See full example:** Check out [`examples/petstore.ocp.json`](examples/petstore.ocp.json) and the generated output in [`examples/generated/`](examples/generated/).

## Generated SDK Usage

```javascript
const { createPetstoreApiClient } = require('./generated');

// Initialize client
const client = createPetstoreApiClient({
  token: 'your-bearer-token',
  timeout: 30000 // optional, defaults to 30s
});

// Use typed methods
const pets = await client.pets.list({ status: 'available' });
const pet = await client.pets.get({ petId: '123' });
const newPet = await client.pets.create({
  name: 'Buddy',
  species: 'dog',
  breed: 'Golden Retriever'
});

// Paginated responses
const { data, pagination } = await client.pets.list({ limit: 10 });
if (pagination?.after_cursor) {
  const nextPage = await client.pets.list({ cursor: pagination.after_cursor });
}
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
├── examples/
│   ├── petstore.ocp.json     # Example OCP schema
│   └── generated/            # Example generated SDK
└── package.json
```

## Requirements

- Node.js >= 14.0.0

## License

MIT License - see [LICENSE](LICENSE) for details.
