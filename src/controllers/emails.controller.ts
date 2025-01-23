import { Request, Response } from 'express';
import sgMail from '@sendgrid/mail';
import Email from '../models/email.model';
import Lead from '../models/lead.model';
import User from '../models/user.model';
import EmailTemplate from '../models/email-template.model';
import Learner from '../models/learner.model';

const sendGridApiKey = process.env.TWILIO_API_KEY || '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';
sgMail.setApiKey(sendGridApiKey);

// Define the type for the email request body
interface EmailRequest {
    to: string[];
    bcc?: string[];
    from: string;
    subject: string;
    htmlContent: string;
    emailTemplateId?: number; // Updated to optional
    userId: number;
    leadId?: number | null; 
    batchId?: number | null;
    trainerId?: number | null; // Optional
    campaignId?: number | null; // Optional
    learnerId?: number | null; // Added learnerId
    mainTaskId?: number | null; // Optional
}

// Controller function to send emails
export const sendEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { to, bcc, from, emailTemplateId, userId, leadId, batchId, subject, htmlContent, trainerId, campaignId, learnerId,mainTaskId }: EmailRequest = req.body;

        // Validate required fields
        if (!to || !from || !userId) {
            res.status(400).json({ message: 'Required fields missing' });
            return;
        }

        // Fetch user data
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        let processedTemplate: string;
        let processedSubject: string;

        if (emailTemplateId) {
            // Fetch email template
            const emailTemplate = await EmailTemplate.findByPk(emailTemplateId);
            if (!emailTemplate) {
                res.status(404).json({ message: 'Email template not found' });
                return;
            }

            // Fetch lead data if leadId is provided
            if (leadId) {
                const lead = await Lead.findByPk(leadId);
                if (!lead) {
                    res.status(404).json({ message: 'Lead not found' });
                    return;
                }

                processedTemplate = replacePlaceholders(emailTemplate.htmlContent, lead, user);
                processedSubject = replacePlaceholders(emailTemplate.subject, lead, user);
            } else {
                processedTemplate = emailTemplate.htmlContent;
                processedSubject = emailTemplate.subject;
            }
        } else if (subject && htmlContent) {
            processedSubject = subject;
            processedTemplate = htmlContent;
        } else {
            res.status(400).json({ message: 'Subject and body must be provided if no template ID is given' });
            return;
        }

        // Ensure processedTemplate and processedSubject are not empty
        if (!processedTemplate || !processedSubject) {
            res.status(400).json({ message: 'Processed template or subject is missing' });
            return;
        }

        // Create email options
        const msg: sgMail.MailDataRequired = {
            to, // Ensure 'to' is an array of strings
            bcc,
            from,
            subject: processedSubject,
            html: processedTemplate // Changed to 'html' to match SendGrid's expected property
        };

        // Send email using SendGrid
        await sgMail.send(msg);

        await Email.sync({ alter: true });

        // Insert record to the database
        await Email.create({
            to: to,
            bcc: bcc,
            from,
            subject: emailTemplateId ? null : processedSubject,
            body: emailTemplateId ? null : processedTemplate,
            emailTemplateId: emailTemplateId || null,
            leadId: leadId || undefined,
            batchId: batchId || undefined,
            userId,
            trainerId: trainerId || undefined, // Optionally include trainerId
            campaignId: campaignId || undefined, // Optionally include campaignId
            learnerId: learnerId || undefined, // Include learnerId
            mainTaskId: mainTaskId || undefined
        });

        // Respond with success message
        res.status(200).json({ message: 'Email sent successfully and record inserted to the database.', processedSubject, processedTemplate });
    } catch (error: any) {
        // Handle errors
        console.error('Error sending email:', error);
        if (error.response && error.response.body) {
            console.error('Response body:', error.response.body);
        }
        res.status(500).json({ error: 'Error sending email.', message: error.message });
    }
};

export const getAllEmails = async (req: Request, res: Response): Promise<void> => {
    try {
        const { batchId, leadId, trainerId, campaignId, learnerId,mainTaskId } = req.query;

        // Build the filter criteria
        const whereClause: any = {};
        if (batchId) whereClause.batchId = batchId;
        if (leadId) whereClause.leadId = leadId;
        if (trainerId) whereClause.trainerId = trainerId; // Include trainerId filter
        if (campaignId) whereClause.campaignId = campaignId; // Include campaignId filter
        if (learnerId) whereClause.learnerId = learnerId; // Include learnerId filter
        if (mainTaskId) whereClause.mainTaskId = mainTaskId; // Include mainTaskId filter

        // Retrieve all emails with optional filters
        const emails = await Email.findAll({
            where: whereClause,
            include: [
                {
                    model: Lead,
                    as: 'lead',
                    attributes: ['name', 'techStack', 'phone', 'email']
                },
                {
                    model: User,
                    as: 'createdBy',
                    attributes: ['id', 'name', 'email', 'mobile']
                },
                {
                    model: EmailTemplate,
                    as: 'emailTemplate',
                    attributes: ['id', 'subject', 'htmlContent']
                },
                {
                    model: Learner,
                    as: 'learner',
                    attributes: ['id', 'name']
                }
            ]
        });

        // Respond with the list of emails including lead details
        res.status(200).json({ emails });
    } catch (error: any) {
        // Handle errors
        console.error('Error retrieving emails:', error);
        res.status(500).json({ error: 'Error retrieving emails.', message: error.message });
    }
};
export const getEmailsByLeadId = async (req: Request, res: Response): Promise<void> => {
    const leadId = parseInt(req.params.leadId);
    try {
        // Retrieve emails by lead ID with associated lead details from the database
        const emails = await Email.findAll({
            where: { leadId },
            include: [
                // {
                //     model: Lead,
                //     as: 'lead',
                //     attributes: ['name', 'techStack', 'phone', 'email']
                // },
                {
                    model: User,
                    as: 'createdBy',
                    attributes: ['id', 'name', 'email', 'mobile']
                },
                {
                    model: EmailTemplate,
                    as: 'emailTemplate',
                    attributes: ['id', 'subject', 'htmlContent']
                },
                {
                    model: Learner,
                    as: 'learner',
                    attributes: ['id', 'name']
                }
            ]
        });

        // Respond with the list of emails including lead details
        res.status(200).json({ emails });
    } catch (error: any) {
        // Handle errors
        console.error('Error retrieving emails by lead ID:', error);
        res.status(500).json({ error: 'Error retrieving emails by lead ID.', message: error.message });
    }
};

// Function to replace placeholders in the email template with actual values
const replacePlaceholders = (template: string, leadData: Lead, userData: User): string => {
    const placeholders = {
        '[Recipient\'s Name]': leadData.name,
        '[Conversation/Meeting/Call]': '[conversation/meeting/call]',
        '[topic]': '[topic]',
        '[Your Name]': userData.name,
        '[Your Position]': userData.role || '',
        '[Your Contact Information]': userData.mobile || ''
    };

    let processedTemplate = template;
    Object.entries(placeholders).forEach(([placeholder, value]) => {
        processedTemplate = processedTemplate.split(placeholder).join(value);
    });

    return processedTemplate;
};