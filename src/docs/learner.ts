const learnerResponse = {
    id: {
      type: 'integer',
      example: 3,  // this changes with different learners
    },
    firstName: {
      type: 'string',
      example: 'John',  // also varies depending on the learner
    },
    lastName: {
      type: 'string',
      example: 'Doe',  // can be null, updated for test example
      nullable: true,
    },
    phone: {
      type: 'string',
      example: '+1234567890',  // from response, might be null
    },
    alternatePhone: {
      type: 'string',
      example: '+0987654321',
      nullable: true,
    },
    email: {
      type: 'string',
      format: 'email',
      example: 'john.doe@example.com',
    },
    location: {
      type: 'string',
      example: 'New York',
      nullable: true,
    },
    source: {
      type: 'string',
      example: 'Referral',
      nullable: true,
    },
    attendedDemo: {
      type: 'string',
      example: 'Yes',
      nullable: true,
    },
    leadCreatedTime: {
      type: 'string',
      format: 'date-time',
      example: '2024-09-01T12:00:00.000Z',
      nullable: true,
    },
    counselingDoneBy: {
      type: 'integer',
      example: 1,
      nullable: true,
    },
    idProof: {
      type: 'string',
      example: 'ID123456',
      nullable: true,
    },
    dateOfBirth: {
      type: 'string',
      format: 'date-time',
      example: '1990-01-01T00:00:00.000Z',
      nullable: true,
    },
    registeredDate: {
      type: 'string',
      format: 'date-time',
      example: '2024-09-01T00:00:00.000Z',
      nullable: true,
    },
    description: {
      type: 'string',
      example: 'A new learner',
      nullable: true,
    },
    exchangeRate: {
      type: 'string',
      example: '1.2',
      nullable: true,
    },
    learnerOwner: {
      type: 'integer',
      example: 2,
      nullable: true,
    },
    currency: {
      type: 'string',
      example: 'USD',
      nullable: true,
    },
    learnerStage: {
      type: 'string',
      example: 'Upcoming',
      nullable: true,
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      example: '2024-09-14T08:45:41.046Z',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      example: '2024-09-14T08:45:41.046Z',
    },
    counselor: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Bala',
        }
      },
      nullable: true
    },
    owner: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Admin',
        }
      },
      nullable: true
    }
  }


const createLearnerBody ={
  type:'object',
  properties:{
    firstName: {
      type: 'string',
      example: 'John',
    },
    lastName: {
      type: 'string',
      example: 'Doe',
    },
    phone: {
      type: 'string',
      example: '+1234567890',
    },
    alternatePhone: {
      type: 'string',
      example: '+0987654321',
    },
    email: {
      type: 'string',
      format: 'email',
      example: 'john.doe@example.com',
    },
    location: {
      type: 'string',
      example: 'New York',
    },
    source: {
      type: 'string',
      example: 'Referral',
    },
    attendedDemo: {
      type: 'string',
      example: 'Yes',
    },
    leadCreatedTime: {
      type: 'string',
      format: 'date-time',
      example: '2024-09-01T12:00:00Z',
    },
    counselingDoneBy: {
      type: 'integer',
      example: 1,
    },
    idProof: {
      type: 'string',
      example: 'ID123456',
    },
    dateOfBirth: {
      type: 'string',
      format: 'date',
      example: '1990-01-01',
    },
    registeredDate: {
      type: 'string',
      format: 'date',
      example: '2024-09-01',
    },
    description: {
      type: 'string',
      example: 'A new learner',
    },
    exchangeRate: {
      type: 'string',
      example: '1.2',
    },
    learnerOwner: {
      type: 'integer',
      example: 2,
    },
    currency: {
      type: 'string',
      example: 'USD',
    },
    learnerStage: {
      type: 'string',
      example: 'Upcoming',
    },
    batchIds: {
      type: 'array',
      items: {
        type: 'integer',
        example: 4,
      },
    },
    courses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          courseId: {
            type: 'integer',
            example: 33,
          },
          techStack: {
            type: 'string',
            example: 'JavaScript',
          },
          courseComments: {
            type: 'string',
            example: 'Needs advanced topics',
          },
          slackAccess: {
            type: 'string',
            example: 'Yes',
          },
          lmsAccess: {
            type: 'string',
            example: 'Yes',
          },
          preferableTime: {
            type: 'string',
            example: 'Evening',
          },
          batchTiming: {
            type: 'string',
            example: '9-11 PM',
          },
          modeOfClass: {
            type: 'string',
            example: 'Online',
          },
          comment: {
            type: 'string',
            example: 'Prefers interactive sessions',
          },
        },
      },
    },
  }
  
}

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

const learnerNotFound = {
  description: 'Resource not found',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Learner not found',
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


const updateLearnerBody = createLearnerBody

const createLearner = {
  tags: ['Learner'],
  description: 'Create a new learner with detailed information',
  operationId: 'createLearner',
  security: security,
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: createLearnerBody
        },
      },
    },
  },
  responses: {
    '201': {
      description: 'Learner created successfully!',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Learner created successfully',
              },
            },
          },
        },
      },
    },
    '400': {
      description: 'Bad Request',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Invalid input data',
              },
            },
          },
        },
      },
    },
    '401': unauthorizedResponse,
    '500': internalServerError
  },
};

const updateLearner = {
  tags: ['Learner'],
  description: 'Update a Learner',
  operationId: 'updateLearner',
  security: security, // Include security here
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'Learner ID',
      required: true,
      type: 'integer',
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/updateLearnerBody',
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'Learner updated successfully!',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: learnerResponse,
          },
        },
      },
    },
    '401': unauthorizedResponse,
    '404': learnerNotFound,
    '500': internalServerError,
  },
};

const getLearner = {
  tags: ['Learner'],
  description: 'Retrieve one learner',
  operationId: 'getLearner',
  security: security, // Include security here
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'Learner ID',
      required: true,
      type: 'integer',
    },
  ],
  responses: {
    '200': {
      description: 'Learner retrieved successfully!',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: learnerResponse,
          },
        },
      },
    },
    '401': unauthorizedResponse,
    '404': learnerNotFound,
    '500': internalServerError,
  },
};

const getLearners = {
  tags: ["Learner"],
  description: "Retrieve all the learners",
  operationId: "getLearners",
  security: security, // Include security here
  responses: {
    "200": {
      description: "Learners retrieved successfully!",
      content: {
        "application/json": {
          schema: {
            type: "array",
            Campaigns: {
              type: "object",
              properties: learnerResponse,
            },
          },
        },
      },
    },
    "401": unauthorizedResponse,
    "500": internalServerError,
  },
};


export {
  createLearner,
  createLearnerBody,
  updateLearner,
  updateLearnerBody,
  getLearner,
  getLearners
}
