import Joi from 'joi';

export const leadSchema = Joi.object({
    name: Joi.string().required(),
    leadSource: Joi.string().required(),
    countryCode: Joi.string().required(),
    techStack: Joi.string().required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    courseId: Joi.number().integer().required(),
    email: Joi.string().email().required(),
    classMode: Joi.string().required(),
    feeQuoted: Joi.number().required(),
    batchTiming: Joi.string().required().allow(null),
    userId: Joi.number().integer(),
    description: Joi.string().allow(''),
    nextFollowUp: Joi.date().allow(null),
    leadStatus: Joi.string()
});