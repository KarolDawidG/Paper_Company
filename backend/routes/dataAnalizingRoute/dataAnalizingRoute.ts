import express, { Request, Response } from "express";
import middleware from "../../config/middleware";
import { limiter, errorHandler } from "../../config/config";
import logger from "../../logs/logger";
import STATUS_CODES from "../../config/status-codes";
import MESSAGES from "../../config/messages";
import { DataRecord } from "../../database/Records/DataAnalizing/DataRecord";

const router = express.Router();
router.use(middleware, limiter, errorHandler);
router.use(express.json({ limit: "10mb" }));

router.get("/top-product", async (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || 'pl';

  try {
    const topProducts = await DataRecord.getTopProducts(lang);
    return res.status(200).json(topProducts);
  } catch (error) {
    logger.error("Error fetching top products:", error);
    return res.status(500).json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
});

router.get("/top-sellers", async (req: Request, res: Response) => {
  try {
    const sellers = await DataRecord.getTopSellers();
    return res.status(STATUS_CODES.SUCCESS).json(sellers);
  } catch (error) {
    logger.error("Error fetching top sellers:", error);
    return res.status(STATUS_CODES.SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
  }
});

router.get("/top-clients", async (req: Request, res: Response) => {
  try {
    const clients = await DataRecord.getTopClients();
    return res.status(STATUS_CODES.SUCCESS).json(clients);
  } catch (error) {
    logger.error("Error fetching top sellers:", error);
    return res.status(STATUS_CODES.SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
  }
});

router.get("/monthly-profit", async (req: Request, res: Response) => {
  try {
    const monthlyProfit = await DataRecord.getMonthlyProfit();
    return res.status(STATUS_CODES.SUCCESS).json(monthlyProfit);
  } catch (error) {
    logger.error("Error fetching monthly profit:", error);
    return res.status(STATUS_CODES.SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
  }
});

router.get("/monthly-summary", async (req: Request, res: Response) => {
  const month = req.query.month as string;
  const lang = (req.query.lang as string) || 'pl';

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Nieprawidłowy format miesiąca. Użyj 'YYYY-MM'." });
  }

  try {
    const summary = await DataRecord.getMonthlySummaryData(month, lang);
    return res.status(STATUS_CODES.SUCCESS).json(summary);
  } catch (error) {
    logger.error("Error fetching monthly summary:", error);
    return res.status(STATUS_CODES.SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
  }
});

router.get('/monthly-report', async (req: Request, res: Response) => {
  const month = (req.query.month as string) || '';
  if (!/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ message: 'Nieprawidłowy format miesiąca (YYYY-MM).' });
  }

  try {
    const report = await DataRecord.getMonthlyReport(month);
    return res.status(200).json(report);
  } catch (error) {
    logger.error('Błąd generowania raportu miesięcznego:', error);
    return res.status(500).json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
});


export default router;