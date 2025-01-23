import { createUser, createUserBody, deleteUser, getUser, getUsers , updateUser, updateUserBody } from './users';
import { createLead, deleteLead, deleteLeads, getLeads, getLead, getLeadStatistics , updateLead, createLeadBody, updateLeadBody } from './leads';
import {
  getAllTasks,
  getTaskById,
  getTasksByLeadId,
  getTasksByUserId,
  createTask,
  updateTask,
  deleteTask,
  createTaskBody,
  updateTaskBody,
} from './tasks';

import {
  createAttendance,
  getAllAttendance,
  getAttendanceById,
  getAttendanceByUserId,
  updateAttendance,
  deleteAttendance,
  deleteAttendances,
  createAttendanceRequestBody,
  updateAttendanceRequestBody
} from './attendance';

import {
  createLearner , getLearner, getLearners, updateLearner,
  updateLearnerBody
} from './learner'
import { campaigns, createCampaign, createCampaignBody, deleteCampaign, getCampaign, updateCampaign, updateCampaignsBody } from './campaigns';
import { createEmailTemplate, createEmailTemplateBody, deleteEmailTemplate, emailTemplates, getEmailTemplate, updateEmailTemplate, updateEmailTemplatebody } from './email-templates';

const apiDocumentation = {
  openapi: '3.0.1',
  info: {
    version: '1.3.0',
    title: 'Digital Edify CRM - Documentation',
    description: 'Digital Edify CRM Swaggers',
    termsOfService: 'https://digital-lync.com/terms',
    contact: {
      name: 'Digital Edify CRM',
      email: 'support@digital-lync.com',
      url: 'https://digital-lync.com',
    },
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Local Server',
    },
    {
      url: 'https://api.dev.crm.digitallync.ai/api/v1',
      description: 'Dev Server',
    },
    {
      url: 'https://api.qa.crm.digitallync.ai/api/v1',
      description: 'QA Server',
    },
    {
      url: 'https://api.crm.digitallync.ai/api/v1',
      description: 'Production Server',
    },
  ],
  tags: [
    {
      name: 'Users',
    },
  ],
  paths: {
    '/users': {
      post: createUser,
      get: getUsers,
    },
    '/users/{id}': {
      delete: deleteUser,
      get: getUser,
      put: updateUser,
    },
    '/leads': {
      post: createLead,
      get: getLeads,
      delete : deleteLeads
    },
    '/leads/statistics': {
      get: getLeadStatistics,
    },
    '/leads/{id}': {
      delete: deleteLead,
      get: getLead,
      put: updateLead,
    },
    '/tasks': {
      get: getAllTasks,
      post: createTask
    },
    '/tasks/{id}': {
      delete: deleteTask,
      get: getTaskById,
      put: updateTask
    },
    '/tasks/lead/{leadId}': {
      get: getTasksByLeadId
    },
    '/tasks/user/{userId}': {
      get: getTasksByUserId
    },
    '/learners': {
      post: createLearner,
      get : getLearners
    },
    '/learners/{id}': {
      put: updateLearner,
      get: getLearner
    },
    '/campaigns': {
      post: createCampaign,
      get: campaigns
    },
    '/campaigns/{id}': {
      put: updateCampaign,
      get: getCampaign,
      delete: deleteCampaign
    },
    '/email-templates': {
      post: createEmailTemplate ,
      get: emailTemplates
    },
    '/email-templates/{id}': {
      put: updateEmailTemplate,
      get: getEmailTemplate,
      delete: deleteEmailTemplate
    },
    // '/attendance': {
    //   get: getAllAttendance,
    //   post: createAttendance,
    //   delete: deleteAttendances,
    // },
    // '/attendance/{id}': {
    //   delete: deleteAttendance,
    //   get: getAttendanceById,
    //   put: updateAttendance
    // },
    // '/attendance/user/{userId}': {
    //   get: getAttendanceByUserId
    // },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      createUserBody,
      updateUserBody,
      createLeadBody,
      updateLeadBody,
      createTaskBody,
      updateTaskBody,
      createLearner,
      updateLearnerBody,
      createCampaignBody,
      updateCampaignsBody,
      createEmailTemplateBody,
      updateEmailTemplatebody

      // createAttendanceRequestBody,
      // updateAttendanceRequestBody
    },
  },
};

export { apiDocumentation };