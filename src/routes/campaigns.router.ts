import { Router } from 'express';
import {
    createCampaign,
    getAllCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaigns,
} from '../controllers/campaigns.controller';

const router = Router();

// Create a new campaign
router.post('/', createCampaign);

// Get all campaigns
router.get('/', getAllCampaigns);

// Get campaign by ID
router.get('/:id', getCampaignById);

// Update a campaign
router.put('/:id', updateCampaign);

// Delete a campaign
router.delete('/:id', deleteCampaigns);

export default router;