import express, { Request, Response } from "express";
import { handleError, handleWarning, requireRoles, verifyToken } from "../../config/config";
import logger from "../../logs/logger";
import STATUS_CODES from "../../config/status-codes";
import MESSAGES from "../../config/messages";
import { DataRecord } from "../../database/Records/DataAnalizing/DataRecord";

const router = express.Router();
// 27.10.6.2: Router analityki nie dubluje już globalnych middleware, limitera ani error handlera.
router.use(express.json({ limit: "10mb" }));

// 27.8.6: Raporty analityczne dostają własną bramkę roli analize/admin zamiast być publiczne.
router.get("/top-product", verifyToken, requireRoles("analize", "admin"), async (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || 'pl';

  try {
    const topProducts = await DataRecord.getTopProducts(lang);
    return res.status(STATUS_CODES.SUCCESS).json(topProducts);
  } catch (error: any) {
    // 27.10.5.13: Analiza top produktów używa wspólnego handleError zamiast ręcznego 500.
    logger.error("Error fetching top products:", error);
    return handleError(res, error, "Data Analizing Route /top-product: GET", MESSAGES.SERVER_ERROR);
  }
});

router.get("/top-sellers", verifyToken, requireRoles("analize", "admin"), async (req: Request, res: Response) => {
  try {
    const sellers = await DataRecord.getTopSellers();
    return res.status(STATUS_CODES.SUCCESS).json(sellers);
  } catch (error: any) {
    logger.error("Error fetching top sellers:", error);
    return handleError(res, error, "Data Analizing Route /top-sellers: GET", MESSAGES.SERVER_ERROR);
  }
});

router.get("/top-clients", verifyToken, requireRoles("analize", "admin"), async (req: Request, res: Response) => {
  try {
    const clients = await DataRecord.getTopClients();
    return res.status(STATUS_CODES.SUCCESS).json(clients);
  } catch (error: any) {
    logger.error("Error fetching top sellers:", error);
    return handleError(res, error, "Data Analizing Route /top-clients: GET", MESSAGES.SERVER_ERROR);
  }
});

router.get("/monthly-profit", verifyToken, requireRoles("analize", "admin"), async (req: Request, res: Response) => {
  try {
    const monthlyProfit = await DataRecord.getMonthlyProfit();
    return res.status(STATUS_CODES.SUCCESS).json(monthlyProfit);
  } catch (error: any) {
    logger.error("Error fetching monthly profit:", error);
    return handleError(res, error, "Data Analizing Route /monthly-profit: GET", MESSAGES.SERVER_ERROR);
  }
});

router.get("/monthly-summary", verifyToken, requireRoles("analize", "admin"), async (req: Request, res: Response) => {
  const month = req.query.month as string;
  const lang = (req.query.lang as string) || 'pl';

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    // 27.10.5.14: Błędny format miesiąca przechodzi przez handleWarning, żeby 400 było spójne z innymi routerami.
    return handleWarning(res, "Data Analizing Route /monthly-summary: GET", MESSAGES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST);
  }

  try {
    const summary = await DataRecord.getMonthlySummaryData(month, lang);
    return res.status(STATUS_CODES.SUCCESS).json(summary);
  } catch (error: any) {
    logger.error("Error fetching monthly summary:", error);
    return handleError(res, error, "Data Analizing Route /monthly-summary: GET", MESSAGES.SERVER_ERROR);
  }
});

router.get('/monthly-report', verifyToken, requireRoles("analize", "admin"), async (req: Request, res: Response) => {
  const month = (req.query.month as string) || '';
  if (!/^\d{4}-\d{2}$/.test(month)) {
    // 27.10.5.15: Raport miesięczny używa tej samej ścieżki walidacji 400 co monthly-summary.
    return handleWarning(res, "Data Analizing Route /monthly-report: GET", MESSAGES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST);
  }

  try {
    const report = await DataRecord.getMonthlyReport(month);
    return res.status(STATUS_CODES.SUCCESS).json(report);
  } catch (error: any) {
    logger.error('Błąd generowania raportu miesięcznego:', error);
    return handleError(res, error, "Data Analizing Route /monthly-report: GET", MESSAGES.SERVER_ERROR);
  }
});


export default router;
