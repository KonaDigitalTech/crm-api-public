const leadResponse = {
  id: {
    type: 'integer',
    example: 52,
  },
  createdAt: {
    type: 'string',
    format: 'date-time',
    example: '2024-09-14T07:05:07.118Z',
  },
  updatedAt: {
    type: 'string',
    format: 'date-time',
    example: '2024-09-14T07:05:07.118Z',
  },
  leadStage: {
    type: 'string',
    example: 'lead',
  },
  opportunityStatus: {
    type: 'string',
    example: '',
  },
  opportunityStage: {
    type: 'string',
    example: '',
  },
  demoAttendedStage: {
    type: 'string',
    example: '',
  },
  visitedStage: {
    type: 'string',
    example: '',
  },
  coldLeadReason: {
    type: 'string',
    example: '',
  },
  name: {
    type: 'string',
    example: 'Charan',
  },
  leadSource: {
    type: 'string',
    example: '',
  },
  techStack: {
    type: 'string',
    example: '',
  },
  countryCode: {
    type: 'string',
    example: '91',
  },
  phone: {
    type: 'string',
    example: '9032345245',
  },
  email: {
    type: 'string',
    example: 'trainingdli2@gmail.com',
  },
  classMode: {
    type: 'string',
    example: '',
  },
  feeQuoted: {
    type: 'integer',
    example: 25000,
  },
  batchTiming: {
    type: 'array',
    items: {
      type: 'string',
      example: '7AM-8AM',
    },
    example: ['7AM-8AM'],
  },
  leadStatus: {
    type: 'string',
    example: '',
  },
  description: {
    type: 'string',
    example: '',
  },
  nextFollowUp: {
    type: 'string',
    format: 'date-time',
    example: null,
  },
  userId: {
    type: 'integer',
    example: 1,
  },
  feeQuotedDetails: {
    type: 'string',
    example: null,
  },
};


const createLeadBody = {
  type: 'object',
  properties: {
    leadStage: {
      type: 'string',
      example: 'lead',
    },
    opportunityStatus: {
      type: 'string',
      example: '',
    },
    opportunityStage: {
      type: 'string',
      example: '',
    },
    demoAttendedStage: {
      type: 'string',
      example: '',
    },
    visitedStage: {
      type: 'string',
      example: '',
    },
    coldLeadReason: {
      type: 'string',
      example: '',
    },
    name: {
      type: 'string',
      example: 'Charan',
    },
    leadSource: {
      type: 'string',
      example: '',
    },
    techStack: {
      type: 'string',
      example: '',
    },
    countryCode: {
      type: 'string',
      example: '91',
    },
    phone: {
      type: 'string',
      example: '9032345245',
    },
    courseIds: {
      type: 'array',
      items: {
        type: 'integer',
        example: 1,
      },
      example: [1, 2],
    },
    email: {
      type: 'string',
      example: 'trainingdli2@gmail.com',
    },
    classMode: {
      type: 'string',
      example: '',
    },
    feeQuoted: {
      type: 'string',
      example: '25000',
    },
    batchTiming: {
      type: 'array',
      items: {
        type: 'string',
        example: '7AM-8AM',
      },
      example: ['7AM-8AM'],
    },
    leadStatus: {
      type: 'string',
      example: '',
    },
    description: {
      type: 'string',
      example: '',
    },
    nextFollowUp: {
      type: 'string',
      format: 'date-time',
      example: null,
    },
    userId: {
      type: 'integer',
      example: 1,
    },
  },
};

const leadStatisticsBody = {
  todaysLeadsCount: {
    type: 'integer',
    example: 0,
  },
  leadsCountByLeadStatus: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        leadStatus: {
          type: 'string',
          example: 'Not Contacted',
        },
        count: {
          type: 'string',
          example: '36',
        },
      },
    },
  },
  leadsCountByCourseId: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        courseId: {
          type: 'integer',
          example: 45,
        },
        count: {
          type: 'string',
          example: '5',
        },
      },
    },
    example: [],
  },
  hourlyLeadsCount: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        hour: {
          type: 'integer',
          example: 0,
        },
        count: {
          type: 'integer',
          example: 0,
        },
      },
    },
  },
}

const updateLeadBody = createLeadBody;

const unauthorizedResponse = {
  description: 'Unauthorized: No token provided',
  content: {
      'application/json': {
          schema: {
              type: 'object',
              properties: {
                  message: {
                      type: 'string',
                      example: 'Unauthorized: No token provided',
                  },
              },
          },
      },
  },
};

const leadNotFound = {
  description: 'Resource not found',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Lead not found',
          },
        },
      },
    },
  },
};

const internalServerError = {
  description: 'Internal Server Error',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Internal server error',
          },
          error: {
            type: 'string',
            example: 'Error message goes here',
          },
        }
      },
    },
  },
};

const security = [
  {
    bearerAuth: [],
  },
];

const leads = {
  tags: ['Leads'],
  description: 'Retrieve all the leads',
  operationId: 'getLeads',
  security: security, // Include security here
  responses: {
    '200': {
      description: 'Leads retrieved successfully!',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: leadResponse,
            },
          },
        },
      },
    },
    '401': unauthorizedResponse,
    '500': internalServerError,
  },
};

const getLead = {
  tags: ['Leads'],
  description: 'Retrieve one lead',
  operationId: 'getLead',
  security: security, // Include security here
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'Lead ID',
      required: true,
      type: 'string',
    },
  ],
  responses: {
    '200': {
      description: 'Lead retrieved successfully!',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: leadResponse,
          },
        },
      },
    },
    '401': unauthorizedResponse,
    '404': leadNotFound,
    '500': internalServerError,
  },
};

const getLeads = {
  tags: ['Leads'],
  description: 'Retrieve leads with optional filtering by query parameters',
  operationId: 'getLeads',
  security: security, // Include security here
  parameters: [
    {
      name: 'userId',
      in: 'query',
      description: 'Filter leads by user ID',
      required: false,
      type: 'integer',
    },
    {
      name: 'fromDate',
      in: 'query',
      description: 'Filter leads created from this date (ISO string format)',
      required: false,
      type: 'string',
      format: 'date-time',
    },
    {
      name: 'toDate',
      in: 'query',
      description: 'Filter leads created until this date (ISO string format)',
      required: false,
      type: 'string',
      format: 'date-time',
    },
    {
      name: 'techStack',
      in: 'query',
      description: 'Filter leads by tech stack',
      required: false,
      type: 'string',
    },
    {
      name: 'leadSource',
      in: 'query',
      description: 'Filter leads by lead source',
      required: false,
      type: 'string',
    },
    {
      name: 'courseId',
      in: 'query',
      description: 'Filter leads by course ID',
      required: false,
      type: 'integer',
    },
  ],
  responses: {
    '200': {
      description: 'Leads retrieved successfully!',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: leadResponse,
            },
          },
        },
      },
    },
    '401': unauthorizedResponse,
    '500': internalServerError,
  },
};

const createLead = {
  tags: ['Leads'],
  description: 'Create a new lead in the system',
  operationId: 'createLead',
  security: security, // Include security here
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/createLeadBody',
        },
      },
    },
    required: true,
  },
  responses: {
    '201': {
      description: 'Lead created successfully!',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: leadResponse,
          },
        },
      },
    },
    '401': unauthorizedResponse,
    '500': internalServerError,
  },
};

const updateLead = {
  tags: ['Leads'],
  description: 'Update a lead',
  operationId: 'updateLead',
  security: security, // Include security here
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'Lead ID',
      required: true,
      type: 'string',
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/updateLeadBody',
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'Lead updated successfully!',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: leadResponse,
          },
        },
      },
    },
    '401': unauthorizedResponse,
    '404': leadNotFound,
    '500': internalServerError,
  },
};

const deleteLead = {
  tags: ['Leads'],
  description: 'Delete a lead',
  operationId: 'deleteLead',
  security: security, // Include security here
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'Lead ID',
      required: true,
      type: 'string',
    },
  ],
  responses: {
    '200': {
      description: 'Lead deleted successfully!',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Lead deleted successfully!',
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

const deleteLeads = {
  tags: ['Leads'],
  description: 'Delete one or more leads',
  operationId: 'deleteLeads',
  security: [
    {
      BearerAuth: [], // Adjust this based on your security setup
    },
  ],
  parameters: [
    {
      name: 'ids',
      in: 'query',
      description: 'Comma-separated list of lead IDs to be deleted',
      required: true,
      type: 'string',
    },
  ],
  responses: {
    '200': {
      description: 'Leads deleted successfully!',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Leads deleted successfully',
              },
            },
          },
        },
      },
    },
    '401':unauthorizedResponse,
    '404': {
      description: 'Not Found',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Leads not found',
              },
            },
          },
        },
      },
    },
    '500': internalServerError
  },
};

const getLeadStatistics = {
  tags: ['Leads'],
  description: 'Retrieve lead statistics including counts by status, course, and hourly distribution',
  operationId: 'getLeadStatistics',
  security: security,
  responses: {
    '200': {
      description: 'Lead statistics retrieved successfully!',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: leadStatisticsBody
          },
        },
      },
    },
    '401': unauthorizedResponse,
    '500': internalServerError
  },
};


export {
  leads,
  getLead,
  getLeads,
  createLead,
  createLeadBody,
  updateLeadBody,
  updateLead,
  deleteLead,
  deleteLeads,
  getLeadStatistics
};