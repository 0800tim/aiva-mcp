# Getting Started with AIVA MCP

This guide will help you set up AIVA MCP with your favorite AI coding tool.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- An AIVA API key (get one from [AIVA Dashboard](https://aiva.dev/dashboard))

## Quick Start

### Option 1: Use with npx (Recommended)

No installation required. Just configure your AI tool to use:

```bash
npx @getaiva/mcp
```

### Option 2: Global Installation

```bash
npm install -g @getaiva/mcp
```

Then use `aiva-mcp` as the command in your configuration.

## Configuration by Tool

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "aiva": {
      "command": "npx",
      "args": ["-y", "@getaiva/mcp"],
      "env": {
        "AIVA_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Cursor

Create `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "aiva": {
      "command": "npx",
      "args": ["-y", "@getaiva/mcp"],
      "env": {
        "AIVA_API_KEY": "${AIVA_API_KEY}"
      }
    }
  }
}
```

### VS Code

Create `.vscode/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "aiva": {
      "command": "npx",
      "args": ["-y", "@getaiva/mcp"],
      "env": {
        "AIVA_API_KEY": "${env:AIVA_API_KEY}"
      }
    }
  }
}
```

### Claude Code

Create `.claude/mcp.json` (project) or `~/.claude/mcp.json` (global):

```json
{
  "mcpServers": {
    "aiva": {
      "command": "npx",
      "args": ["-y", "@getaiva/mcp"],
      "env": {
        "AIVA_API_KEY": "${AIVA_API_KEY}"
      }
    }
  }
}
```

## Verify Installation

After configuring, restart your AI tool and ask:

> "What AIVA tools are available?"

You should see a list of available tools including customer intelligence, subscriptions, and Shopify integration.

## Next Steps

- [Available Tools](./tools.md) - See all available MCP tools
- [API Reference](./api-reference.md) - Detailed API documentation
- [Examples](./examples.md) - Common usage patterns
