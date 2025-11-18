const swaggerJsdoc = require('swagger-jsdoc');
const env = require('../config/env');

const schemas = {
  User: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      email: { type: 'string' },
      phone: { type: 'string' },
      role: { type: 'string', enum: ['admin', 'retailer', 'customer'] },
      defaultCityId: { type: 'integer' },
    },
  },
  Address: {
    type: 'object',
    properties: {
      id: { type: 'number' },
      label: { type: 'string' },
      contactName: { type: 'string' },
      phone: { type: 'string' },
      line1: { type: 'string' },
      pincode: { type: 'string' },
      cityId: { type: 'integer' },
    },
  },
  Retailer: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      storeName: { type: 'string' },
      cityId: { type: 'integer' },
      status: { type: 'string' },
    },
  },
  Product: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      slug: { type: 'string' },
      basePrice: { type: 'number' },
      salePrice: { type: 'number' },
      stock: { type: 'number' },
      retailerId: { type: 'string' },
    },
  },
  Order: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      status: { type: 'string' },
      paymentStatus: { type: 'string' },
      total: { type: 'number' },
    },
  },
};

const paths = {
  '/auth/register/customer': {
    post: {
      summary: 'Register a new customer',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['firstName', 'email', 'password'],
              properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                email: { type: 'string', format: 'email' },
                password: { type: 'string', format: 'password' },
                defaultCityId: { type: 'integer' },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Customer registered',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' },
            },
          },
        },
      },
    },
  },
  '/auth/login': {
    post: {
      summary: 'Login with email & password',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string', format: 'password' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Authentication tokens & user profile',
        },
      },
    },
  },
  '/products': {
    get: {
      summary: 'List products filtered by city',
      tags: ['Products'],
      parameters: [
        {
          in: 'header',
          name: 'x-city-id',
          required: true,
          schema: { type: 'integer' },
          description: 'Active city context (Delhi=1, etc.)',
        },
        {
          in: 'query',
          name: 'search',
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          description: 'Array of products',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Product' },
              },
            },
          },
        },
      },
    },
    post: {
      summary: 'Create a product (retailer only)',
      tags: ['Products'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'categoryId', 'basePrice', 'stock'],
              properties: {
                name: { type: 'string' },
                categoryId: { type: 'integer' },
                basePrice: { type: 'number' },
                stock: { type: 'number' },
                description: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Product created',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Product' },
            },
          },
        },
      },
    },
  },
  '/orders': {
    get: {
      summary: 'List orders for the current user',
      tags: ['Orders'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Array of orders',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Order' },
              },
            },
          },
        },
      },
    },
    post: {
      summary: 'Place a new order',
      tags: ['Orders'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['addressId', 'items'],
              properties: {
                addressId: { type: 'integer' },
                items: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['productId', 'quantity'],
                    properties: {
                      productId: { type: 'string' },
                      productVariantId: { type: 'string' },
                      quantity: { type: 'integer' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Order placed',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Order' },
            },
          },
        },
      },
    },
  },
};

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: env.appName,
      version: '2.0.0',
      description: 'Hyperlocal multi-vendor API for the eShop Plus Flutter application.',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Current environment',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas,
    },
    paths,
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;


