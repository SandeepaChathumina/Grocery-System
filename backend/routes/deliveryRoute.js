import express from 'express';
import {
  getAllDeliveries,
  getDelivery,
  createDelivery,
  updateDelivery,
  deleteDelivery,
  updateDeliveryStatus,
  getDeliveriesByStatus
} from '../controllers/deliveryController.js';

const router = express.Router();

// GET /api/deliveries - Get all deliveries
router.get('/', getAllDeliveries);

// GET /api/deliveries/status/:status - Get deliveries by status
router.get('/status/:status', getDeliveriesByStatus);

// GET /api/deliveries/:id - Get single delivery
router.get('/:id', getDelivery);

// POST /api/deliveries - Create new delivery
router.post('/', createDelivery);

// PUT /api/deliveries/:id - Update delivery
router.put('/:id', updateDelivery);

// PATCH /api/deliveries/:id/status - Update delivery status
router.patch('/:id/status', updateDeliveryStatus);

// DELETE /api/deliveries/:id - Delete delivery
router.delete('/:id', deleteDelivery);

export default router;