import express from 'express';
import { getAllLocations } from '../controllers/locationsController.js';

const router = express.Router();

// Route to get all locations
router.get('/', getAllLocations);

export default router;
