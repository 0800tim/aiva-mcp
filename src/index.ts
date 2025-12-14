import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import createDebug from 'debug';

const debug = createDebug('aiva:mcp');

// Environment configuration
const AIVA_API_KEY = process.env.AIVA_API_KEY;
const AIVA_API_URL = process.env.AIVA_API_URL || 'https://api.aiva.io';
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const SHOPIFY_STORE = process.env.SHOPIFY_STORE;

// Validate required configuration
if (!AIVA_API_KEY) {
  console.error('Error: AIVA_API_KEY environment variable is required');
  process.exit(1);
}

// API client for AIVA
async function aivaFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${AIVA_API_URL}${endpoint}`;
  debug('Fetching:', url);

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${AIVA_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AIVA API error: ${response.status} ${error}`);
  }

  return response.json();
}

// Tool definitions
const TOOLS = [
  // Customer Intelligence
  {
    name: 'aiva_get_customer',
    description: 'Get customer profile by ID or email. Returns customer details, RFM segment, health score, and subscription status.',
    inputSchema: {
      type: 'object',
      properties: {
        customerId: { type: 'string', description: 'Customer ID' },
        email: { type: 'string', description: 'Customer email (alternative to ID)' },
      },
    },
  },
  {
    name: 'aiva_search_customers',
    description: 'Search customers with filters. Supports filtering by segment, subscription status, tags, and more.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query (name, email, etc.)' },
        segment: { type: 'string', description: 'RFM segment filter' },
        subscriptionStatus: { type: 'string', enum: ['active', 'paused', 'cancelled', 'none'] },
        limit: { type: 'number', default: 20 },
        offset: { type: 'number', default: 0 },
      },
    },
  },
  {
    name: 'aiva_get_rfm_segments',
    description: 'Get RFM (Recency, Frequency, Monetary) segment breakdown with customer counts and trends.',
    inputSchema: {
      type: 'object',
      properties: {
        dateRange: { type: 'string', enum: ['7d', '30d', '90d', '1y'], default: '30d' },
      },
    },
  },
  {
    name: 'aiva_get_churn_risk',
    description: 'Get customers at risk of churning, sorted by risk score.',
    inputSchema: {
      type: 'object',
      properties: {
        riskLevel: { type: 'string', enum: ['high', 'medium', 'low', 'all'], default: 'high' },
        limit: { type: 'number', default: 50 },
      },
    },
  },

  // Subscriptions
  {
    name: 'aiva_get_subscription',
    description: 'Get subscription details by ID or customer.',
    inputSchema: {
      type: 'object',
      properties: {
        subscriptionId: { type: 'string', description: 'Subscription ID' },
        customerId: { type: 'string', description: 'Get subscription by customer ID' },
      },
    },
  },
  {
    name: 'aiva_list_subscriptions',
    description: 'List subscriptions with filters.',
    inputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['active', 'paused', 'cancelled', 'all'], default: 'active' },
        productId: { type: 'string', description: 'Filter by product' },
        limit: { type: 'number', default: 50 },
        offset: { type: 'number', default: 0 },
      },
    },
  },
  {
    name: 'aiva_get_delivery_schedule',
    description: 'Get upcoming deliveries for a customer or all subscriptions.',
    inputSchema: {
      type: 'object',
      properties: {
        customerId: { type: 'string', description: 'Filter by customer' },
        days: { type: 'number', default: 30, description: 'Days ahead to look' },
      },
    },
  },
  {
    name: 'aiva_subscription_actions',
    description: 'Perform actions on subscriptions: pause, resume, skip, swap products.',
    inputSchema: {
      type: 'object',
      properties: {
        subscriptionId: { type: 'string', description: 'Subscription ID' },
        action: { type: 'string', enum: ['pause', 'resume', 'skip', 'swap'] },
        newProductId: { type: 'string', description: 'For swap action: new product ID' },
        skipDate: { type: 'string', description: 'For skip action: date to skip (ISO format)' },
      },
      required: ['subscriptionId', 'action'],
    },
  },

  // Affiliates
  {
    name: 'aiva_get_affiliate',
    description: 'Get affiliate details and stats.',
    inputSchema: {
      type: 'object',
      properties: {
        affiliateId: { type: 'string', description: 'Affiliate ID' },
        code: { type: 'string', description: 'Referral code (alternative to ID)' },
      },
    },
  },
  {
    name: 'aiva_list_affiliates',
    description: 'List affiliates with stats, sortable by performance.',
    inputSchema: {
      type: 'object',
      properties: {
        sortBy: { type: 'string', enum: ['referrals', 'revenue', 'conversion'], default: 'referrals' },
        status: { type: 'string', enum: ['active', 'inactive', 'all'], default: 'active' },
        limit: { type: 'number', default: 50 },
      },
    },
  },
  {
    name: 'aiva_get_referrals',
    description: 'Get referral history for an affiliate.',
    inputSchema: {
      type: 'object',
      properties: {
        affiliateId: { type: 'string', description: 'Affiliate ID' },
        dateRange: { type: 'string', enum: ['7d', '30d', '90d', '1y'], default: '30d' },
      },
      required: ['affiliateId'],
    },
  },

  // Shopify (Proxied)
  {
    name: 'shopify_get_products',
    description: 'Search and list products from the connected Shopify store.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        collection: { type: 'string', description: 'Filter by collection handle' },
        productType: { type: 'string', description: 'Filter by product type' },
        limit: { type: 'number', default: 20 },
      },
    },
  },
  {
    name: 'shopify_get_product',
    description: 'Get product details by ID or handle.',
    inputSchema: {
      type: 'object',
      properties: {
        productId: { type: 'string', description: 'Product ID' },
        handle: { type: 'string', description: 'Product handle (alternative to ID)' },
      },
    },
  },
  {
    name: 'shopify_get_orders',
    description: 'List orders with filters.',
    inputSchema: {
      type: 'object',
      properties: {
        customerId: { type: 'string', description: 'Filter by customer' },
        status: { type: 'string', enum: ['open', 'closed', 'cancelled', 'any'], default: 'any' },
        limit: { type: 'number', default: 20 },
      },
    },
  },
  {
    name: 'shopify_get_customer',
    description: 'Get Shopify customer details.',
    inputSchema: {
      type: 'object',
      properties: {
        customerId: { type: 'string', description: 'Shopify customer ID' },
        email: { type: 'string', description: 'Customer email (alternative to ID)' },
      },
    },
  },
];

// Tool handlers
async function handleTool(name: string, args: Record<string, unknown>) {
  debug('Handling tool:', name, args);

  switch (name) {
    // Customer Intelligence
    case 'aiva_get_customer': {
      const { customerId, email } = args as { customerId?: string; email?: string };
      const query = customerId ? `id=${customerId}` : `email=${email}`;
      return aivaFetch(`/v1/customers?${query}`);
    }

    case 'aiva_search_customers': {
      const params = new URLSearchParams();
      if (args.query) params.set('q', args.query as string);
      if (args.segment) params.set('segment', args.segment as string);
      if (args.subscriptionStatus) params.set('subscription_status', args.subscriptionStatus as string);
      params.set('limit', String(args.limit || 20));
      params.set('offset', String(args.offset || 0));
      return aivaFetch(`/v1/customers/search?${params}`);
    }

    case 'aiva_get_rfm_segments': {
      const dateRange = (args.dateRange as string) || '30d';
      return aivaFetch(`/v1/analytics/rfm?range=${dateRange}`);
    }

    case 'aiva_get_churn_risk': {
      const params = new URLSearchParams();
      params.set('risk', (args.riskLevel as string) || 'high');
      params.set('limit', String(args.limit || 50));
      return aivaFetch(`/v1/analytics/churn?${params}`);
    }

    // Subscriptions
    case 'aiva_get_subscription': {
      const { subscriptionId, customerId } = args as { subscriptionId?: string; customerId?: string };
      if (subscriptionId) {
        return aivaFetch(`/v1/subscriptions/${subscriptionId}`);
      }
      return aivaFetch(`/v1/subscriptions?customer_id=${customerId}`);
    }

    case 'aiva_list_subscriptions': {
      const params = new URLSearchParams();
      params.set('status', (args.status as string) || 'active');
      if (args.productId) params.set('product_id', args.productId as string);
      params.set('limit', String(args.limit || 50));
      params.set('offset', String(args.offset || 0));
      return aivaFetch(`/v1/subscriptions?${params}`);
    }

    case 'aiva_get_delivery_schedule': {
      const params = new URLSearchParams();
      if (args.customerId) params.set('customer_id', args.customerId as string);
      params.set('days', String(args.days || 30));
      return aivaFetch(`/v1/subscriptions/schedule?${params}`);
    }

    case 'aiva_subscription_actions': {
      const { subscriptionId, action, newProductId, skipDate } = args as {
        subscriptionId: string;
        action: string;
        newProductId?: string;
        skipDate?: string;
      };
      return aivaFetch(`/v1/subscriptions/${subscriptionId}/${action}`, {
        method: 'POST',
        body: JSON.stringify({ newProductId, skipDate }),
      });
    }

    // Affiliates
    case 'aiva_get_affiliate': {
      const { affiliateId, code } = args as { affiliateId?: string; code?: string };
      if (affiliateId) {
        return aivaFetch(`/v1/affiliates/${affiliateId}`);
      }
      return aivaFetch(`/v1/affiliates?code=${code}`);
    }

    case 'aiva_list_affiliates': {
      const params = new URLSearchParams();
      params.set('sort', (args.sortBy as string) || 'referrals');
      params.set('status', (args.status as string) || 'active');
      params.set('limit', String(args.limit || 50));
      return aivaFetch(`/v1/affiliates?${params}`);
    }

    case 'aiva_get_referrals': {
      const { affiliateId, dateRange } = args as { affiliateId: string; dateRange?: string };
      return aivaFetch(`/v1/affiliates/${affiliateId}/referrals?range=${dateRange || '30d'}`);
    }

    // Shopify (Proxied through AIVA)
    case 'shopify_get_products': {
      const params = new URLSearchParams();
      if (args.query) params.set('q', args.query as string);
      if (args.collection) params.set('collection', args.collection as string);
      if (args.productType) params.set('product_type', args.productType as string);
      params.set('limit', String(args.limit || 20));
      return aivaFetch(`/v1/shopify/products?${params}`);
    }

    case 'shopify_get_product': {
      const { productId, handle } = args as { productId?: string; handle?: string };
      if (productId) {
        return aivaFetch(`/v1/shopify/products/${productId}`);
      }
      return aivaFetch(`/v1/shopify/products?handle=${handle}`);
    }

    case 'shopify_get_orders': {
      const params = new URLSearchParams();
      if (args.customerId) params.set('customer_id', args.customerId as string);
      params.set('status', (args.status as string) || 'any');
      params.set('limit', String(args.limit || 20));
      return aivaFetch(`/v1/shopify/orders?${params}`);
    }

    case 'shopify_get_customer': {
      const { customerId, email } = args as { customerId?: string; email?: string };
      if (customerId) {
        return aivaFetch(`/v1/shopify/customers/${customerId}`);
      }
      return aivaFetch(`/v1/shopify/customers?email=${email}`);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// Create and start the MCP server
export async function createServer() {
  const server = new Server(
    {
      name: 'aiva-mcp',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      const result = await handleTool(name, args || {});
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${message}`,
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

// Main entry point
export async function main() {
  debug('Starting AIVA MCP server...');

  const server = await createServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);

  debug('AIVA MCP server running');
}
