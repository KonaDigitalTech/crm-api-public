const taskResponse = {
    id: {
        type: 'integer',
        example: 1,
    },
    subject: {
        type: 'string',
        example: 'Meeting Chennai Traders today',
    },
    dueDate: {
        type: 'string',
        format: 'date-time',
        example: '2024-04-01T04:30:00.000Z',
    },
    priority: {
        type: 'string',
        example: 'active',
    },
    userId: {
        type: 'integer',
        example: 1,
    },
    leadId: {
        type: 'integer',
        example: 1,
    },
    createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-04-14T10:22:14.191Z',
    },
    updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-04-14T10:22:14.191Z',
    },
    user: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                example: 'Manideep',
            },
            email: {
                type: 'string',
                example: 'manideep@gmail.com',
            },
            mobile: {
                type: 'string',
                example: '8686897802',
            },
        },
    },
    lead: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                example: 'Venkatesh',
            },
            techStack: {
                type: 'string',
                example: 'Full Stack',
            },
            phone: {
                type: 'string',
                example: '8686897800',
            },
            courseId: {
                type: 'integer',
                example: 1,
            },
            email: {
                type: 'string',
                example: 'test@yopmail.com',
            },
            courseDetails: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        example: 'Full Stack',
                    },
                },
            },
        },
    },
}

const createTaskBody = {
    type: 'object',
    properties: {
        subject: {
            type: 'string',
            example: 'Meeting Chennai Traders today',
        },
        dueDate: {
            type: 'string',
            format: 'date-time',
            example: '2024-04-01T04:30:00.000Z',
        },
        priority: {
            type: 'string',
            example: 'active',
        },
        userId: {
            type: 'integer',
            example: 1,
        },
        leadId: {
            type: 'integer',
            example: 1,
        },
    },
};

const updateTaskBody = createTaskBody;

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

const taskNotFound = {
    description: 'Resource not found',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                        example: 'Task not found',
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

const getAllTasks = {
    tags: ['Tasks'],
    description: 'Retrieve all the tasks',
    operationId: 'getLeads',
    security: security,
    responses: {
        '200': {
            description: 'Tasks retrieved successfully!',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            tasks: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: taskResponse,
                                },
                            },
                        },
                    },
                }
            },
        },
        '401': unauthorizedResponse,
        '500': internalServerError
    }
};

const getTaskById = {
    tags: ['Tasks'],
    description: 'Retrieve a task by ID',
    operationId: 'getTaskById',
    security: security,
    parameters: [
        {
            name: 'id',
            in: 'path',
            description: 'Task ID',
            required: true,
            type: 'integer',
        },
    ],
    responses: {
        '200': {
            description: 'Task retrieved successfully!',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            task: {
                                type: 'object',
                                properties: taskResponse
                            },
                        },
                    },
                },
            },
        },
        '401': unauthorizedResponse,
        '404': taskNotFound,
        '500': internalServerError,
    },
};

const getTasksByLeadId = {
    tags: ['Tasks'],
    description: 'Retrieve tasks by lead ID',
    operationId: 'getTasksByLeadId',
    security: security, // Include security here
    parameters: [
        {
            name: 'leadId',
            in: 'path',
            description: 'Lead ID',
            required: true,
            type: 'integer',
        },
    ],
    responses: {
        '200': {
            description: 'Tasks retrieved successfully!',
            content: {
                'application/json': {
                    schema: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: taskResponse,
                        },
                    },
                },
            },
        },
        '401': unauthorizedResponse,
        '500': internalServerError,
    },
};

const getTasksByUserId = {
    tags: ['Tasks'],
    description: 'Retrieve tasks by user ID',
    operationId: 'getTasksByUserId',
    security: security, // Include security here
    parameters: [
        {
            name: 'userId',
            in: 'path',
            description: 'User ID',
            required: true,
            type: 'integer',
        },
    ],
    responses: {
        '200': {
            description: 'Tasks retrieved successfully!',
            content: {
                'application/json': {
                    schema: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: taskResponse,
                        },
                    },
                },
            },
        },
        '401': unauthorizedResponse,
        '500': internalServerError,
    },
};

const createTask = {
    tags: ['Tasks'],
    description: 'Create a new task',
    operationId: 'createTask',
    security: security, // Include security here
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/createTaskBody',
                },
            },
        },
        required: true,
    },
    responses: {
        '201': {
            description: 'Task created successfully!',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: taskResponse,
                    },
                },
            },
        },
        '401': unauthorizedResponse,
        '500': internalServerError,
    },
};

const updateTask = {
    tags: ['Tasks'],
    description: 'Update a task',
    operationId: 'updateTask',
    security: security, // Include security here
    parameters: [
        {
            name: 'id',
            in: 'path',
            description: 'Task ID',
            required: true,
            type: 'integer',
        },
    ],
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/updateTaskBody',
                },
            },
        },
        required: true,
    },
    responses: {
        '200': {
            description: 'Task updated successfully!',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: taskResponse,
                    },
                },
            },
        },
        '401': unauthorizedResponse,
        '404': taskNotFound,
        '500': internalServerError,
    },
};

const deleteTask = {
    tags: ['Tasks'],
    description: 'Delete a task',
    operationId: 'deleteTask',
    security: security, // Include security here
    parameters: [
        {
            name: 'id',
            in: 'path',
            description: 'Task ID',
            required: true,
            type: 'integer',
        },
    ],
    responses: {
        '200': {
            description: 'Task deleted successfully!',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            message: {
                                type: 'string',
                                example: 'Task deleted successfully!',
                            },
                        },
                    },
                },
            },
        },
        '401': unauthorizedResponse,
        '404': taskNotFound,
        '500': internalServerError,
    },
};

export {
    getAllTasks,
    getTaskById,
    getTasksByLeadId,
    getTasksByUserId,
    createTask,
    updateTask,
    deleteTask,
    createTaskBody,
    updateTaskBody,
};  
