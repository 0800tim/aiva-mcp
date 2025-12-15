# Available Tools

AIVA MCP provides a comprehensive set of tools for subscription commerce development.

## Customer Intelligence

### get_customer

Retrieve detailed customer information including profile, purchase history, and engagement metrics.

**Parameters:**
- `customer_id` (required): The customer's unique identifier

**Example:**
```
Get customer details for customer ID "cust_12345"
```

**Returns:**
- Customer profile (name, email, phone)
- Account status
- Total orders and lifetime value
- Subscription status
- Last activity date

---

### search_customers

Search customers by various criteria.

**Parameters:**
- `query` (optional): Search term (name, email)
- `status` (optional): Filter by status (active, churned, at_risk)
- `segment` (optional): Filter by RFM segment
- `limit` (optional): Maximum results (default: 50)

**Example:**
```
Search for customers with email containing "gmail.com" who are at risk of churning
```

---

### get_rfm_segments

Retrieve RFM (Recency, Frequency, Monetary) segmentation data.

**Parameters:**
- `segment` (optional): Specific segment to retrieve

**Segments:**
- `champions` - Best customers, high value, frequent purchases
- `loyal` - Regular customers with consistent purchases
- `potential` - New customers showing promise
- `at_risk` - Previously good customers showing decline
- `hibernating` - Inactive customers
- `lost` - Long-term inactive customers

**Example:**
```
Get all customers in the "at_risk" segment
```

---

### get_churn_risk

Get churn prediction and risk factors for customers.

**Parameters:**
- `customer_id` (optional): Specific customer
- `threshold` (optional): Risk score threshold (0-100)

**Returns:**
- Risk score (0-100)
- Risk factors
- Recommended retention actions
- Predicted churn date

---

## Subscription Management

### get_subscription

Retrieve subscription details.

**Parameters:**
- `subscription_id` (required): Subscription identifier

**Returns:**
- Subscription status
- Product details
- Billing cycle
- Next charge date
- Payment method

---

### list_subscriptions

List subscriptions with filtering.

**Parameters:**
- `customer_id` (optional): Filter by customer
- `status` (optional): Filter by status (active, paused, cancelled)
- `product_id` (optional): Filter by product

---

### subscription_actions

Perform actions on subscriptions.

**Actions:**
- `pause` - Temporarily pause subscription
- `resume` - Resume paused subscription
- `skip` - Skip next delivery
- `cancel` - Cancel subscription
- `swap` - Swap product variant

**Parameters:**
- `subscription_id` (required): Subscription to modify
- `action` (required): Action to perform
- `reason` (optional): Reason for action (for pause/cancel)

**Example:**
```
Pause subscription "sub_12345" for reason "traveling"
```

---

## Shopify Integration (Proxied)

These tools proxy requests to Shopify through AIVA, using the merchant's connected Shopify store.

### shopify_get_products

Retrieve products from the connected Shopify store.

**Parameters:**
- `limit` (optional): Maximum products (default: 50)
- `collection_id` (optional): Filter by collection
- `product_type` (optional): Filter by type

---

### shopify_get_product

Get detailed product information.

**Parameters:**
- `product_id` (required): Shopify product ID

**Returns:**
- Product details
- Variants with pricing
- Inventory levels
- Images
- Metafields

---

### shopify_get_orders

Retrieve orders from Shopify.

**Parameters:**
- `status` (optional): Order status filter
- `created_at_min` (optional): Minimum creation date
- `limit` (optional): Maximum orders

---

### shopify_get_customer

Get Shopify customer data.

**Parameters:**
- `customer_id` (required): Shopify customer ID

---

## Affiliate Management

### get_affiliate

Retrieve affiliate details.

**Parameters:**
- `affiliate_id` (required): Affiliate identifier

---

### list_affiliates

List affiliates with filtering.

**Parameters:**
- `status` (optional): Filter by status
- `tier` (optional): Filter by tier level

---

### get_referrals

Get referral data for an affiliate.

**Parameters:**
- `affiliate_id` (required): Affiliate identifier
- `date_from` (optional): Start date
- `date_to` (optional): End date

**Returns:**
- Referral count
- Conversion rate
- Commission earned
- Top referred products
