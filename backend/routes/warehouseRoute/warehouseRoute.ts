import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { limiter } from "../../config/config";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";
import { verifyToken } from "../../config/config";
import {ClientRecord} from "../../database/Records/Client/ClientRecord";
import { OrdersRecord } from "../../database/Records/Orders/OrdersRecord";

const router = express.Router();
router.use(middleware, limiter);


router.get('/', async (req: Request, res: Response) => {
    const status = 'shipped';
        try {
        const orders = await OrdersRecord.getOrdersByStatus(status);
        res.status(200).json(orders);
        } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Błąd podczas pobierania zamówień.' });
        }
  });
  
  router.get('/:orderId', async (req: Request, res: Response) => {
    const orderId = req.params.orderId;

        try {
        const orderData = await OrdersRecord.quantityAndItems(orderId);
        res.status(200).json(orderData);
        } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Błąd podczas pobierania szczegółów zamówienia.' });
        }
  });

  router.get('/client_data/:client_id', async (req: Request, res: Response) => {
    const client_id = req.params.client_id;

        try {
            const clientData = await ClientRecord.getClientDataById([client_id])
            console.log(clientData);
            res.status(200).json(clientData);
        } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Błąd podczas pobierania szczegółów zamówienia.' });
        }
  });

  router.get('/address/:client_address_id', async (req: Request, res: Response) => {
    const client_address_id = req.params.client_address_id;

        try {
            const clientAddress = await ClientRecord.getAddress([client_address_id]);
            console.log(clientAddress);
            res.status(200).json(clientAddress);
        } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Błąd podczas pobierania szczegółów zamówienia.' });
        }
  });
  

  export default router;