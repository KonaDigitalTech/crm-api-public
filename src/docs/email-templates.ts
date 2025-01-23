const emailTemplateResponse = {
  id: {
    type: "integer",
    example: 1,
  },
  name: {
    type: "string",
    example: "Template 2",
  },
  subject: {
    type: "string",
    example: "Course Enquiry",
  },
  htmlContent: {
    type: "string",
    example: `Greetings of the day!\n\nSubject: Follow-Up on [Conversation/Meeting/Call]\n\nHi [Recipient's Name],\n\nI hope this email finds you well. I wanted to follow-up on our recent [conversation/meeting/call] and touch base on the key points we discussed. It was a pleasure discussing [topic] with you, and I believe we made some important progress during our interaction.\n\nI wanted to reiterate my understanding of the action items we identified during our [conversation/meeting/call]:\n\n1. [Action Item 1]\n2. [Action Item 2]\n3. [Action Item 3]\n\nPlease let me know if there are any additional details or clarifications needed on these action items. I am looking forward to working together to achieve our shared goals and objectives.\n\nIf you have any further questions or need any assistance, please feel free to reach out to me. Thank you for your time and attention.\n\nBest regards,\n\n[Your Name]\n[Your Position]\n[Your Contact Information]`,
  },
  userId: {
    type: "integer",
    example: 1,
  },
  createdAt: {
    type: "string",
    format: "date-time",
    example: "2024-09-16T07:52:01.038Z",
  },
  updatedAt: {
    type: "string",
    format: "date-time",
    example: "2024-09-16T07:52:01.038Z",
  },
  createdBy: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      empCode: {
        type: "string",
        example: "DL0002",
      },
      name: {
        type: "string",
        example: "Bala",
      },
      username: {
        type: "string",
        example: "bala",
      },
      mobile: {
        type: "string",
        example: "8686897802",
      },
      email: {
        type: "string",
        example: "testuser@yopmail.com",
      },
      password: {
        type: "string",
        example: "$2b$10$GWwBYs/dvTUdIGBRC3xGCeURqc0m8Kr1qIK56dgYkvlODxTHsZ6/.",
      },
      role: {
        type: "string",
        example: "admin",
      },
      teleCMIAgentId: {
        type: "string",
        nullable: true,
        example: null,
      },
      teleCMIPassword: {
        type: "string",
        nullable: true,
        example: null,
      },
      createdAt: {
        type: "string",
        format: "date-time",
        example: "2024-04-17T05:57:36.280Z",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        example: "2024-04-17T05:57:36.280Z",
      },
    },
  },
};

const createEmailTemplateBody = {
  type: "object",
  properties: {
    name: {
      type: "string",
      example: "Template 2",
    },
    subject: {
      type: "string",
      example: "Course Enquiry",
    },
    htmlContent: {
      type: "string",
      example:
        "Greetings of the day!\n\nSubject: Follow-Up on [Conversation/Meeting/Call]...\n[Full content as per your request body]",
    },
    userId: {
      type: "integer",
      example: 1,
    },
  },
};

const updateEmailTemplatebody = createEmailTemplateBody;

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

const templateNotFound = {
  description: "Resource not found",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Email template not found",
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

const emailTemplates = {
  tags: ["emailTemplates"],
  description: "Retrieve all the emailTemplates",
  operationId: "getEmailTemplates",
  security: security, // Include security here
  responses: {
    "200": {
      description: "emailTemplates retrieved successfully!",
      content: {
        "application/json": {
          schema: {
            type: "object",
            templates: {
              type: "array",
              properties: emailTemplateResponse,
            },
          },
        },
      },
    },
    "401": unauthorizedResponse,
    "500": internalServerError,
  },
};

const getEmailTemplate = {
  tags: ["emailTemplates"],
  description: "Retrieve emailTemplate with query parameters ID",
  operationId: "getEmailTemplate",
  security: security, // Include security here
  parameters: [
    {
      name: "id",
      in: "path",
      description: "emailTemplate ID",
      required: false,
      type: "integer",
    },
  ],
  responses: {
    "200": {
      description: "emailTemplate retrieved successfully!",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: emailTemplateResponse,
          },
        },
      },
    },
    "401": unauthorizedResponse,
    "404": templateNotFound,
    "500": internalServerError,
  },
};

const createEmailTemplate = {
  tags: ["emailTemplates"],
  description: "Create a new emailTemplate in the system",
  operationId: "createEmailTemplate",
  security: security, // Include security here
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/createEmailTemplateBody",
        },
      },
    },
    required: true,
  },
  responses: {
    "201": {
      description: "emailTemplate created successfully!",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: emailTemplateResponse,
          },
        },
      },
    },
    "401": unauthorizedResponse,
    "500": internalServerError,
  },
};

const updateEmailTemplate = {
  tags: ["emailTemplates"],
  description: "Update a emailTemplates",
  operationId: "updateEmailTemplates",
  security: security, // Include security here
  parameters: [
    {
      name: "id",
      in: "path",
      description: "emailTemplates ID",
      required: true,
      type: "string",
    },
  ],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/updateCampaignsBody",
        },
      },
    },
    required: true,
  },
  responses: {
    "200": {
      description: "emailTemplates updated successfully!",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: emailTemplateResponse,
          },
        },
      },
    },
    "401": unauthorizedResponse,
    "404": templateNotFound,
    "500": internalServerError,
  },
};

const deleteEmailTemplate = {
  tags: ["emailTemplates"],
  description: "Delete a emailTemplate",
  operationId: "deleteemailTemplate",
  security: security, // Include security here
  parameters: [
    {
      name: "id",
      in: "path",
      description: "emailTemplate ID",
      required: true,
      type: "integer",
    },
  ],
  responses: {
    "200": {
      description: "emailTemplate deleted successfully!",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "emailTemplate deleted successfully!",
              },
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
  createEmailTemplate,
  createEmailTemplateBody,
  emailTemplates,
  getEmailTemplate,
  updateEmailTemplate,
  updateEmailTemplatebody,
  deleteEmailTemplate,
};
