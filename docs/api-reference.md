# API Reference

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AIVA_API_KEY` | Yes | Your AIVA API key from the dashboard |
| `AIVA_API_URL` | No | Custom API URL (default: https://api.aiva.dev) |
| `DEBUG` | No | Set to `true` for verbose logging |

## MCP Protocol

AIVA MCP implements the Model Context Protocol (MCP) specification. It communicates via stdio with JSON-RPC 2.0 messages.

### Initialization

When the MCP server starts, it:
1. Validates the AIVA_API_KEY
2. Connects to the AIVA API
3. Registers available tools
4. Begins listening for requests

### Request Format

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_customer",
    "arguments": {
      "customer_id": "cust_12345"
    }
  }
}
```

### Response Format

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{ \"id\": \"cust_12345\", \"email\": \"customer@example.com\", ... }"
      }
    ]
  }
}
```

## Error Handling

### Error Codes

| Code | Description |
|------|-------------|
| -32600 | Invalid request |
| -32601 | Method not found |
| -32602 | Invalid params |
| -32603 | Internal error |
| 401 | Unauthorized (invalid API key) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Resource not found |
| 429 | Rate limited |

### Error Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": 401,
    "message": "Invalid API key"
  }
}
```

## Rate Limits

- 100 requests per minute per API key
- 1000 requests per hour per API key
- Burst: up to 10 concurrent requests

Rate limit headers are included in responses:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Data Types

### Customer

```typescript
interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  totalOrders: number;
  totalSpent: number;
  currency: string;
  tags: string[];
  metadata: Record<string, any>;
}
```

### Subscription

```typescript
interface Subscription {
  id: string;
  customerId: string;
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  productId: string;
  productName: string;
  variantId?: string;
  quantity: number;
  price: number;
  currency: string;
  interval: 'day' | 'week' | 'month' | 'year';
  intervalCount: number;
  nextChargeDate: string;
  createdAt: string;
  updatedAt: string;
}
```

### Order

```typescript
interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  status: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: number;
  currency: string;
  lineItems: LineItem[];
  createdAt: string;
  updatedAt: string;
}
```

## Webhooks

AIVA can send webhooks to your application for real-time events. Configure webhooks in the AIVA dashboard.

### Events

- `customer.created`
- `customer.updated`
- `subscription.created`
- `subscription.paused`
- `subscription.resumed`
- `subscription.cancelled`
- `order.created`
- `order.fulfilled`
- `churn_risk.high`

### Webhook Payload

```json
{
  "event": "subscription.created",
  "timestamp": "2025-12-15T10:30:00Z",
  "data": {
    "subscription": { ... }
  }
}
```
