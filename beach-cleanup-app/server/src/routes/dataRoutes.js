import express from 'express';
import { getTides, getWaterQuality, getDebrisHotspots } from '../controllers/dataController.js';

const router = express.Router();

// GET /api/v1/data/tides
router.get('/tides', getTides);

// GET /api/v1/data/water-quality
router.get('/water-quality', getWaterQuality);

// GET /api/v1/data/debris-hotspots
router.get('/debris-hotspots', getDebrisHotspots);

export default router;
