const campaignResponse = {
  createdAt: {
    type: "string",
    format: "date-time",
    example: "2024-09-16T06:41:30.718Z",
  },
  updatedAt: {
    type: "string",
    format: "date-time",
    example: "2024-09-16T06:41:30.718Z",
  },
  id: {
    type: "integer",
    example: 8,
  },
  name: {
    type: "string",
    example: "Summer Sale",
  },
  status: {
    type: "string",
    example: "Planned",
  },
  type: {
    type: "string",
    example: "Email",
  },
  campaignDate: {
    type: "string",
    format: "date-time",
    example: "2024-06-01T00:00:00.000Z",
  },
  endDate: {
    type: "string",
    format: "date-time",
    example: "2024-06-30T00:00:00.000Z",
  },
};

const createCampaignBody = {
  type: "object",
  properties: {
    name: {
      type: "string",
      example: "Summer Sale",
    },
    status: {
      type: "string",
      example: "Planned",
    },
    type: {
      type: "string",
      example: "Email",
    },
    campaignDate: {
      type: "string",
      format: "date-time",
      example: "2024-06-01T00:00:00Z",
    },
    endDate: {
      type: "string",
      format: "date-time",
      example: "2024-06-30T00:00:00Z",
    },
  },
  required: ["name", "status", "type", "campaignDate", "endDate"],
};

const updateCampaignsBody = createCampaignBody;

const unauthorizedResponse = {
  description: "Unauthorized: No token provided",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Unauthorized: No token provided",
          },
        },
      },
    },
  },
};

const campaignNotFound = {
  description: "Resource not found",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "campaign not found",
          },
        },
      },
    },
  },
};

const internalServerError = {
  description: "Internal Server Error",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Internal server error",
          },
          error: {
            type: "string",
            example: "Error message goes here",
          },
        },
      },
    },
  },
};

const security = [
  {
    bearerAuth: [],
  },
];

const campaigns = {
  tags: ["Campaigns"],
  description: "Retrieve all the campaigns",
  operationId: "getCampaigns",
  security: security, // Include security here
  responses: {
    "200": {
      description: "campaigns retrieved successfully!",
      content: {
        "application/json": {
          schema: {
            type: "array",
            Campaigns: {
              type: "object",
              properties: campaignResponse,
            },
          },
        },
      },
    },
    "401": unauthorizedResponse,
    "500": internalServerError,
  },
};

const getCampaign = {
  tags: ['Campaigns'],
  description: 'Retrieve campaigns with optional filtering by query parameters',
  operationId: 'getCampaign',
  security: security, // Include security here
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'Campaign ID',
      required: false,
      type: 'integer',
    },
    // {
    //   name: 'status',
    //   in: 'query',
    //   description: 'Filter Campaigns by status',
    //   required: false,
    //   type: 'string',
    // },
  ],
  responses: {
    '200': {
      description: 'Campaign retrieved successfully!',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: campaignResponse,
          },
        },
      },
    },
    '401': unauthorizedResponse,
    '404': campaignNotFound,
    '500': internalServerError,
  },
};

const createCampaign = {
  tags: ['Campaigns'],
  description: 'Create a new campaign in the system',
  operationId: 'createCampaign',
  security: security, // Include security here
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/createCampaignBody',
        },
      },
    },
    required: true,
  },
  responses: {
    '201': {
      description: 'Campaign created successfully!',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: campaignResponse,
          },
        },
      },
    },
    '401': unauthorizedResponse,
    '500': internalServerError,
  },
};

const updateCampaign = {
  tags: ['Campaigns'],
  description: 'Update a Campaign',
  operationId: 'updateCampaign',
  security: security, // Include security here
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'Campaign ID',
      required: true,
      type: 'string',
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/updateCampaignsBody',
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'Campaign updated successfully!',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: campaignResponse,
          },
        },
      },
    },
    '401': unauthorizedResponse,
    '404': campaignNotFound,
    '500': internalServerError,
  },
};

const deleteCampaign = {
  tags: ['Campaigns'],
  description: 'Delete a Campaign',
  operationId: 'deleteCampaign',
  security: security, // Include security here
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'Campaign ID',
      required: true,
      type: 'string',
    },
  ],
  responses: {
    '200': {
      description: 'Campaign deleted successfully!',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Campaign deleted successfully!',
              },
            },
          },
        },
      },
    },
    '401': unauthorizedResponse,
    '500': internalServerError,
  },
};

export {
  createCampaign,
  createCampaignBody,
  updateCampaign,
  updateCampaignsBody,
  getCampaign,
  campaigns,
  deleteCampaign
}