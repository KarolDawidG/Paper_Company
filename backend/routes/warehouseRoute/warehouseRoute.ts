import express, { Request, Response, NextFunction } from "express";
import { handleError, handleWarning, requireRoles, verifyToken } from "../../config/config";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";
import {ClientRecord} from "../../database/Records/Client/ClientRecord";
import { OrdersRecord } from "../../database/Records/Orders/OrdersRecord";
import { ProductsRecord } from "../../database/Records/Products/ProductsRecord";

const router = express.Router();
// 27.10.6.4: Magazyn opiera się na globalnych middleware, zamiast rejestrować je drugi raz w routerze.


// 27.8.4: Moduł magazynu pozostaje zamknięty dla roli warehouse/admin, bo nie zasila widoków pomocniczych.
router.get('/', verifyToken, requireRoles("warehouse", "admin"), async (req: Request, res: Response) => {
    const status = 'shipped';
        try {
        const orders = await OrdersRecord.getOrdersByStatus(status);

        return res.status(STATUS_CODES.SUCCESS).json({ orders });
        } catch (error: any) {
        // 27.10.5.1: Magazyn przechodzi na handleError, żeby statusy i komunikaty błędów były spójne z resztą backendu.
        return handleError(res, error, "Warehouse Route: GET", MESSAGES.UNKNOW_ERROR);
        }
  });

  router.get("/products", verifyToken, requireRoles("warehouse", "admin"), async (req: Request, res: Response) => {
  const locale = req.headers['accept-language'] || 'en';
    try {
      const productsData = await ProductsRecord.getAll2(locale);
        if (!productsData || productsData.length === 0) {
          return handleWarning(res, `Products Route: GET: No products found for locale: ${locale}`, MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
        }
        
      return res.status(STATUS_CODES.SUCCESS).json(productsData );
    } catch (error: any) {
      return handleError(res, error, "Products Route: GET", MESSAGES.UNKNOW_ERROR);
  }
});
  
  router.get('/:orderId', verifyToken, requireRoles("warehouse", "admin"), async (req: Request, res: Response) => {
    const orderId = req.params.orderId;

        try {
        const orderData = await OrdersRecord.quantityAndItems(orderId);
        return res.status(STATUS_CODES.SUCCESS).json(orderData);
        } catch (error: any) {
        // 27.10.5.2: Szczegóły zamówienia w magazynie zwracają teraz błędy przez wspólny helper zamiast ręcznego 500.
        return handleError(res, error, "Warehouse Route /:orderId: GET", MESSAGES.UNKNOW_ERROR, STATUS_CODES.SERVER_ERROR, orderId);
        }
  });

  router.get('/client_data/:client_id', verifyToken, requireRoles("warehouse", "admin"), async (req: Request, res: Response) => {
    const client_id = req.params.client_id;

        try {
            const clientData = await ClientRecord.getClientDataById([client_id])
            return res.status(STATUS_CODES.SUCCESS).json(clientData);
        } catch (error: any) {
        // 27.10.5.3: Dane klienta dla magazynu korzystają z tej samej ścieżki błędów co pozostałe endpointy.
        return handleError(res, error, "Warehouse Route /client_data/:client_id: GET", MESSAGES.UNKNOW_ERROR, STATUS_CODES.SERVER_ERROR, client_id);
        }
  });

  router.get('/address/:client_address_id', verifyToken, requireRoles("warehouse", "admin"), async (req: Request, res: Response) => {
    const client_address_id = req.params.client_address_id;

        try {
            const clientAddress = await ClientRecord.getAddress([client_address_id]);
            return res.status(STATUS_CODES.SUCCESS).json(clientAddress);
        } catch (error: any) {
        // 27.10.5.4: Adresy dostaw w magazynie raportują błędy jednolicie przez handleError.
        return handleError(res, error, "Warehouse Route /address/:client_address_id: GET", MESSAGES.UNKNOW_ERROR, STATUS_CODES.SERVER_ERROR, client_address_id);
        }
  });
  

  export default router;
