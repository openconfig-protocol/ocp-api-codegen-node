#!/usr/bin/env node
/**
 * OCP API Codegen CLI
 * Open Config Protocol - Node.js SDK Generator
 */

const fs = require('fs');
const path = require('path');
const { OCPCodegen } = require('../lib/codegen');

const VERSION = require('../package.json').version;

function printHelp() {
  console.log(`
ocp-api-codegen v${VERSION}
Open Config Protocol - Node.js SDK Generator

Usage:
  ocp-api-codegen <schema.json> [options]

Arguments:
  schema.json          Path to OCP schema file

Options:
  -o, --output <dir>   Output directory (default: current directory)
  -v, --validate       Validate schema only, don't generate
  --version            Show version
  -h, --help           Show this help

Examples:
  ocp-api-codegen ./api-schema.json
  ocp-api-codegen ./api-schema.json -o ./src/generated
  ocp-api-codegen ./api-schema.json --validate
`);
}

function parseArgs(args) {
  const result = {
    schema: null,
    output: '.',
    validate: false,
    help: false,
    version: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '-h' || arg === '--help') {
      result.help = true;
    } else if (arg === '--version') {
      result.version = true;
    } else if (arg === '-v' || arg === '--validate') {
      result.validate = true;
    } else if (arg === '-o' || arg === '--output') {
      result.output = args[++i];
    } else if (!arg.startsWith('-')) {
      result.schema = arg;
    }
  }

  return result;
}

function validateSchema(schemaPath) {
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const errors = [];

  // Check $ocp marker
  if (!schema.$ocp) {
    errors.push('Missing $ocp marker');
  } else {
    if (!schema.$ocp.type) errors.push('Missing $ocp.type');
    if (!schema.$ocp.version) errors.push('Missing $ocp.version');
    if (schema.$ocp.type && !['rest', 'rpc', 'graphql', 'websocket'].includes(schema.$ocp.type)) {
      errors.push(`Invalid $ocp.type: ${schema.$ocp.type}`);
    }
  }

  // Check meta
  if (!schema.meta) {
    errors.push('Missing meta section');
  } else {
    if (!schema.meta.name) errors.push('Missing meta.name');
    if (!schema.meta.base_url) errors.push('Missing meta.base_url');
  }

  // Check endpoints for REST
  if (schema.$ocp?.type === 'rest') {
    if (!schema.endpoints) {
      errors.push('Missing endpoints section');
    } else {
      for (const [groupName, group] of Object.entries(schema.endpoints)) {
        for (const [endpointName, endpoint] of Object.entries(group)) {
          if (endpoint.method) {
            if (!endpoint.path) {
              errors.push(`${groupName}.${endpointName}: Missing path`);
            }
            if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].includes(endpoint.method)) {
              errors.push(`${groupName}.${endpointName}: Invalid method ${endpoint.method}`);
            }
          }
        }
      }
    }
  }

  return errors;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  if (args.version) {
    console.log(`ocp-api-codegen v${VERSION}`);
    process.exit(0);
  }

  if (!args.schema) {
    console.error('Error: No schema file specified\n');
    printHelp();
    process.exit(1);
  }

  const schemaPath = path.resolve(args.schema);

  if (!fs.existsSync(schemaPath)) {
    console.error(`Error: Schema file not found: ${schemaPath}`);
    process.exit(1);
  }

  // Validate
  console.log(`Validating ${args.schema}...`);
  const errors = validateSchema(schemaPath);

  if (errors.length > 0) {
    console.error('Validation errors:');
    errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  }

  console.log('Schema is valid.');

  if (args.validate) {
    process.exit(0);
  }

  // Generate
  const outputDir = path.resolve(args.output);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const codegen = new OCPCodegen(schemaPath);
  codegen.generate(outputDir);

  console.log(`\nSDK generated in ${outputDir}`);
}

main();
