// Import necessary modules and types
import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import './config';
import { checkDatabaseAvailability } from './database';

import { apiDocumentation } from './docs/api-doc';

import userRouter from './routes/users.router';
import courseRouter from './routes/courses.router';
import leadRouter from './routes/leads.router';
import attendanceRouter from './routes/attendances.router';
import taskRouter from './routes/tasks.router';
import meetingRouter from './routes/meetings.router';
import emailRouter from './routes/emails.router';
import messageRouter from './routes/messages.router';
import callRouter from './routes/calls.router';
import messageTemplateRouter from './routes/message-templates.router';
import emailTemplateRouter from './routes/email-templates.router';
import askAiRouter from './routes/ask-ai.router';
import batchRouter from './routes/batches.router';

import { downloadAndUploadRecordings } from './controllers/zoom-compress-vimeo.controller';
import notesRouter from './routes/notes.router';
import slackRouter from './routes/slack.router';
import batchTopicsRouter from './routes/batch-topics.router';
import trainerRouter from './routes/trainers.router';
import campaignRouter from './routes/campaigns.router';
import learnerRouter from './routes/learners.router';
import mainTaskRouter from './routes/mainTask.router';

const app = express();

// Configure middleware for parsing JSON and URL-encoded data
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.options('*', cors());

app.use((req, res, next) => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-type, Accept, Authorization');
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocumentation));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/leads', leadRouter);
app.use('/api/v1/attendance', attendanceRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/meetings', meetingRouter);
app.use('/api/v1/emails', emailRouter);
app.use('/api/v1/messages', messageRouter);
app.use('/api/v1/calls', callRouter);
app.use('/api/v1/message-templates', messageTemplateRouter);
app.use('/api/v1/email-templates', emailTemplateRouter);
app.use('/api/v1/ask-ai', askAiRouter);
app.use('/api/v1/notes', notesRouter);
app.use('/api/v1/slack', slackRouter);
app.use('/api/v1/batches', batchRouter);
app.use('/api/v1/batch-topics', batchTopicsRouter);
app.use('/api/v1/trainers', trainerRouter);
app.use('/api/v1/campaigns', campaignRouter);
app.use('/api/v1/learners', learnerRouter);
app.use('/api/v1/mainTask', mainTaskRouter);

app.get('/api/v1/process-recordings', async (req: Request, res: Response) => {
  try {
      // Call your downloadAndUploadRecordings function here
      await downloadAndUploadRecordings(req, res);

    } catch (error) {
    }
});

app.get('/', function(req, res) {
  res.status(200);
  res.send({message: 'Digital Edify crm services is up and running.'});
});

import { sequelize } from './database';
import Learner from './models/learner.model';
app.get('/api/v1/sync-db', async (req: Request, res: Response) => {
  // Sync the models with the database
  sequelize.sync({ alter: true })
    .then(() => {
      console.log('Database synchronized');
      res.json({
        message: 'Database synchronized'
      });
    })
    .catch((error) => {
      console.error('Error synchronizing database:', error);
      res.json({
        message: 'Error synchronizing database'
      });
    });
});

async function startServer() {
  try {
      const isDatabaseAvailable = await checkDatabaseAvailability();
      if (isDatabaseAvailable) {
        // Start the server only if the database is available
        console.log('Started database server');
      } else {
        console.log('Server cannot start due to database unavailability.');
      }
  } catch (err) {
      console.error('Error starting server:', err);
  }
}

// Set up the Express application to listen on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("DB Name: ", process.env.DB_DATABASE);
  startServer();
});
