# Examples

Common usage patterns and prompts for AIVA MCP.

## Customer Intelligence

### Find At-Risk Customers

```
Find all customers who are at risk of churning and show me their details
```

The AI will use `get_churn_risk` and `get_customer` to identify and detail at-risk customers.

### Customer Segmentation Analysis

```
Show me a breakdown of customers by RFM segment with counts and average order values
```

Uses `get_rfm_segments` to analyze customer distribution.

### Customer Lookup

```
Find the customer with email john@example.com and show their subscription status
```

Uses `search_customers` followed by `list_subscriptions`.

---

## Subscription Management

### Pause a Subscription

```
Pause the subscription for customer john@example.com because they're traveling
```

The AI will:
1. Search for the customer
2. List their subscriptions
3. Pause the active subscription with the reason

### Subscription Health Report

```
Generate a report of all paused subscriptions and how long they've been paused
```

Uses `list_subscriptions` with status filter.

### Skip Next Delivery

```
Skip the next delivery for subscription sub_12345
```

Uses `subscription_actions` with skip action.

---

## Shopify Integration

### Product Catalog

```
Show me all products in the "Coffee" collection with their current inventory levels
```

Uses `shopify_get_products` with collection filter.

### Order Analysis

```
Get all orders from the last 7 days and summarize by product
```

Uses `shopify_get_orders` with date filter.

### Product Details

```
Get full details for product ID 123456789 including all variants
```

Uses `shopify_get_product` for detailed information.

---

## Building Features

### Customer Portal Data

```
I'm building a customer portal. What data do I need to fetch for the dashboard?
```

The AI will explain and demonstrate:
- `get_customer` for profile
- `list_subscriptions` for active subscriptions
- `shopify_get_orders` for order history

### Churn Prevention

```
Help me build a churn prevention workflow. What triggers should I use?
```

The AI will use `get_churn_risk` and explain:
- Risk score thresholds
- Webhook events to listen for
- Recommended actions per risk level

### Subscription Swap Feature

```
I want to let customers swap products in their subscription. How would this work?
```

Demonstrates `subscription_actions` with swap action.

---

## Code Generation Prompts

### Next.js API Route

```
Create a Next.js API route that fetches customer subscriptions using AIVA
```

### Dashboard Component

```
Build a React component that displays RFM segment distribution as a chart
```

### Webhook Handler

```
Create a webhook handler for subscription.cancelled events that sends a win-back email
```

---

## Troubleshooting Prompts

### Debug Connection

```
Test the connection to AIVA and list available tools
```

### Check Permissions

```
What permissions does my API key have?
```

### Validate Data

```
Fetch customer cust_12345 and verify all required fields are present
```
