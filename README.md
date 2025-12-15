# AIVA MCP Server

[![npm version](https://badge.fury.io/js/@getaiva%2Fmcp.svg)](https://www.npmjs.com/package/@getaiva/mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Model Context Protocol server for AIVA** - Connect your AI coding tools to AIVA's customer intelligence and Shopify data.

## What is this?

AIVA MCP is a [Model Context Protocol](https://modelcontextprotocol.io/) server that gives AI coding assistants (Claude, Cursor, Windsurf, etc.) direct access to:

- **Customer Intelligence** - RFM segments, health scores, churn predictions
- **Subscription Data** - Active subscriptions, delivery schedules, lifecycle events
- **Affiliate Tracking** - Referral codes, commissions, leaderboards
- **Shopify Store Data** - Products, orders, customers (proxied through AIVA)

## Quick Start

### Installation

```bash
npm install @getaiva/mcp
```

### Configuration

Add to your MCP configuration file:

**Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "aiva": {
      "command": "npx",
      "args": ["@getaiva/mcp"],
      "env": {
        "AIVA_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Cursor** (`.cursor/mcp.json` in your project):
```json
{
  "mcpServers": {
    "aiva": {
      "command": "npx",
      "args": ["@getaiva/mcp"],
      "env": {
        "AIVA_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**VS Code with Continue** (`.continue/config.json`):
```json
{
  "mcpServers": [
    {
      "name": "aiva",
      "command": "npx",
      "args": ["@getaiva/mcp"],
      "env": {
        "AIVA_API_KEY": "your-api-key-here"
      }
    }
  ]
}
```

## Getting Your API Key

1. Log in to your AIVA Merchant Dashboard
2. Go to **Settings** > **API Keys**
3. Create a new API key with the scopes you need
4. Copy the key and add it to your MCP configuration

## Available Tools

Once connected, your AI assistant can use these tools:

### Customer Intelligence

| Tool | Description |
|------|-------------|
| `aiva_get_customer` | Get customer profile by ID or email |
| `aiva_search_customers` | Search customers with filters |
| `aiva_get_rfm_segments` | Get RFM segment breakdown |
| `aiva_get_churn_risk` | Get customers at risk of churning |

### Subscriptions

| Tool | Description |
|------|-------------|
| `aiva_get_subscription` | Get subscription details |
| `aiva_list_subscriptions` | List subscriptions with filters |
| `aiva_get_delivery_schedule` | Get upcoming deliveries |
| `aiva_subscription_actions` | Pause, resume, skip, swap products |

### Affiliates

| Tool | Description |
|------|-------------|
| `aiva_get_affiliate` | Get affiliate details |
| `aiva_list_affiliates` | List affiliates with stats |
| `aiva_get_referrals` | Get referral history |

### Shopify (Proxied)

| Tool | Description |
|------|-------------|
| `shopify_get_products` | Search/list products |
| `shopify_get_product` | Get product by ID |
| `shopify_get_orders` | List orders |
| `shopify_get_customer` | Get Shopify customer |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AIVA_API_KEY` | Yes | Your AIVA API key |
| `AIVA_API_URL` | No | Custom API URL (default: https://api.aiva.io) |
| `SHOPIFY_ACCESS_TOKEN` | No | Direct Shopify access (bypasses proxy) |
| `SHOPIFY_STORE` | No | Your Shopify store domain |

## Example Usage

Once configured, ask your AI assistant things like:

```
"Show me customers at high risk of churning"

"Get the subscription details for customer john@example.com"

"List all products in the 'dog-food' collection"

"What are our top-performing affiliates this month?"

"Find customers in the 'Champions' RFM segment"
```

## Development

### Running Locally

```bash
git clone https://github.com/0800tim/aiva-mcp.git
cd aiva-mcp
npm install
npm run dev
```

### Testing

```bash
npm test
```

### Building

```bash
npm run build
```

## Troubleshooting

### "AIVA_API_KEY not configured"

Make sure your API key is set in the `env` section of your MCP configuration.

### "Connection refused"

Check that:
1. Your API key is valid
2. You have network access to the AIVA API
3. The MCP server started correctly

### Debug Mode

Set `DEBUG=aiva:*` environment variable for verbose logging:

```json
{
  "env": {
    "AIVA_API_KEY": "your-key",
    "DEBUG": "aiva:*"
  }
}
```

## Related Packages

- [`@getaiva/create-app`](https://github.com/0800tim/create-aiva-app) - CLI to scaffold AIVA-powered apps
- [`customer-portal-starter`](https://github.com/0800tim/customer-portal-starter) - Customer portal starter kit

## License

MIT - see [LICENSE](LICENSE) for details.

## Support

- [Documentation](https://docs.aiva.io/mcp)
- [GitHub Issues](https://github.com/0800tim/aiva-mcp/issues)
- [Discord Community](https://discord.gg/aiva)
