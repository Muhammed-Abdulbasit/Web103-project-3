import express from 'express';
import { getAllEvents } from '../controllers/eventsController.js';

const router = express.Router();

// Route to get all events
router.get('/', getAllEvents);

export default router;
