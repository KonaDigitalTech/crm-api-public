import Lead from "../models/lead.model";
import User from "../models/user.model";

export const leadOptions = {
    model: Lead,
    as: 'lead',
    attributes: ['name', 'techStack', 'phone', 'email']
};

export const userOptions = {
    model: User,
    as: 'createdBy',
    attributes: ['id', 'name', 'email', 'mobile']
};