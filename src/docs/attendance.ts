const security = [
    {
      bearerAuth: [],
    },
];

const createAttendanceRequestBody = {
    type: 'object',
    properties: {
        userId: {
            type: 'integer',
            example: 1,
        },
        clockIn: {
            type: 'string',
            format: 'date-time',
            example: '2024-03-30T06:34:27.964Z',
        }
    },
};

const updateAttendanceRequestBody = {
    type: 'object',
    properties: {
        userId: {
            type: 'integer',
            example: 1,
        },
        clockIn: {
            type: 'string',
            format: 'date-time',
            example: '2024-03-30T06:34:27.964Z',
        },
        clockOut: {
            type: 'string',
            format: 'date-time',
            example: '2024-03-30T06:34:27.964Z',
        },
    },
};

const attendanceResponse =  {
    userId: {
        type: 'integer',
        example: 1,
    },
    clockIn: {
        type: 'string',
        format: 'date-time',
        example: '2024-03-30T06:34:27.964Z',
    },
    clockOut: {
        type: 'string',
        format: 'date-time',
        example: '2024-03-30T06:34:27.964Z',
    },
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

const attendanceNotFound = {
    description: 'Resource not found',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                        example: 'Attendance record not found',
                    },
                },
            },
        },
    },
};
  
const createAttendance = {
    tags: ['Attendance'],
    description: 'Record attendance for a user',
    operationId: 'createAttendance',
    security: security, // Include security here
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/createAttendanceRequestBody',
                },
            },
        },
        required: true,
    },
    responses: {
        '201': {
            description: 'Attendance recorded successfully!',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/attendanceResponse',
                    },
                },
            },
        },
        '401': unauthorizedResponse,
        '500': internalServerError,
    },
};

const getAllAttendance = {
    tags: ['Attendance'],
    description: 'Retrieve all attendance records',
    operationId: 'getAllAttendance',
    security: security, // Include security here
    responses: {
        '200': {
            description: 'Attendance records retrieved successfully!',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            attendance: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: attendanceResponse,
                                },
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

const getAttendanceById = {
    tags: ['Attendance'],
    description: 'Retrieve attendance record by ID',
    operationId: 'getAttendanceById',
    security: security, // Include security here
    parameters: [
        {
            name: 'id',
            in: 'path',
            description: 'Attendance ID',
            required: true,
            type: 'integer',
        },
    ],
    responses: {
        '200': {
            description: 'Attendance record retrieved successfully!',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            attendance: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: attendanceResponse,
                                },
                            },
                        },
                    },
                },
            },
        },
        '401': unauthorizedResponse,
        '404': attendanceNotFound,
        '500': internalServerError,
    },
};

const getAttendanceByUserId = {
    tags: ['Attendance'],
    description: 'Retrieve attendance records for a user',
    operationId: 'getAttendanceByUserId',
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
            description: 'Attendance records retrieved successfully!',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            attendance: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: attendanceResponse,
                                },
                            },
                        },
                    },
                },
            },
        },
        '401': unauthorizedResponse,
        '404': attendanceNotFound,
        '500': internalServerError,
    },
};

const updateAttendance = {
    tags: ['Attendance'],
    description: 'Update attendance record',
    operationId: 'updateAttendance',
    security: security, // Include security here
    parameters: [
        {
            name: 'id',
            in: 'path',
            description: 'Attendance ID',
            required: true,
            type: 'integer',
        },
    ],
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/updateAttendanceRequestBody',
                },
            },
        },
        required: true,
    },
    responses: {
        '200': {
            description: 'Attendance record updated successfully!',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            attendance: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: attendanceResponse,
                                },
                            },
                        },
                    },
                },
            },
        },
        '401': unauthorizedResponse,
        '404': attendanceNotFound,
        '500': internalServerError,
    },
};

const deleteAttendance = {
    tags: ['Attendance'],
    description: 'Delete attendance record',
    operationId: 'deleteAttendance',
    security: security, // Include security here
    parameters: [
        {
            name: 'id',
            in: 'path',
            description: 'Attendance ID',
            required: true,
            type: 'integer',
        },
    ],
    responses: {
        '200': {
            description: 'Attendance record deleted successfully!',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            message: {
                                type: 'string',
                                example: 'Attendance record deleted successfully!',
                            },
                        },
                    },
                },
            },
        },
        '401': unauthorizedResponse,
        '404': attendanceNotFound,
        '500': internalServerError,
    },
};

const deleteAttendances = {
    tags: ['Attendance'],
    description: 'Delete all attendance records',
    operationId: 'deleteAttendances',
    security: security, // Include security here
    responses: {
        '200': {
            description: 'All attendance records deleted successfully!',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            message: {
                                type: 'string',
                                example: 'All attendance records deleted successfully!',
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
    createAttendance,
    getAllAttendance,
    getAttendanceById,
    getAttendanceByUserId,
    updateAttendance,
    deleteAttendance,
    deleteAttendances,
    createAttendanceRequestBody,
    updateAttendanceRequestBody
};