import { Request, Response } from 'express';
import Lead from '../models/lead.model';

export const handleSlackInteraction = async (req: Request, res: Response) => {
    try {
        const payload = JSON.parse(req.body.payload);
        
        // Extracting lead details from the original message
        const originalMessage = payload.original_message;
        const leadName = originalMessage.attachments[0].fields.find((field: any) => field.title === 'Name').value;
        const leadEmail = originalMessage.attachments[0].fields.find((field: any) => field.title === 'Email').value;
        const leadMobile = originalMessage.attachments[0].fields.find((field: any) => field.title === 'Mobile Number').value;

        // Extracting the selected lead status
        const selectedLeadStatus = payload.actions[0].selected_options[0].value;

        await Lead.update(
            { leadStatus: selectedLeadStatus },
            { where: { phone: leadMobile } }
        );
        return res.json({
            text: `Lead status updated to: ${selectedLeadStatus}`,
            replace_original: false,
            response_type: 'in_channel'
        });
    } catch(error: any) {
        console.error('Error handling slack interaction:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
};