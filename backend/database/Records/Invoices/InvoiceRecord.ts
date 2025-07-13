import { pool } from "../../pool";
import { v4 as uuidv4 } from "uuid";

export interface Invoice {
  id: string;
  order_id: string;
  invoice_number: string;
  pdf: Buffer;
  created_at?: Date;
  payment_status: string;
  payment_date?: Date | null;
}


class InvoiceRecord {
  id: string;
  order_id: string;
  invoice_number: string;
  pdf: Buffer;
  created_at?: Date;
  payment_status: string;
  payment_date?: Date | null;

  constructor(obj: Invoice) {
    this.id = obj.id;
    this.order_id = obj.order_id;
    this.invoice_number = obj.invoice_number;
    this.pdf = obj.pdf;
    this.created_at = obj.created_at;
    this.payment_status = obj.payment_status;
    this.payment_date = obj.payment_date ?? null;
  }


  static async insert(orderId: string, invoiceNumber: string, pdfBuffer: Buffer) {
    const id = uuidv4();
    const query = `
      INSERT INTO invoices (id, order_id, invoice_number, pdf)
      VALUES (?, ?, ?, ?)
    `;
    await pool.execute(query, [id, orderId, invoiceNumber, pdfBuffer]);
  }

static async getPaymentHistory(): Promise<any[]> {
  const query = `
    SELECT 
      i.invoice_number,
      i.created_at AS invoice_date,
      i.payment_date,
      i.payment_status,
      c.company_name,
      SUM(od.quantity * p.price) AS total
    FROM invoices i
    JOIN orders o ON i.order_id = o.id
    JOIN clients c ON o.client_id = c.id
    JOIN order_details od ON o.id = od.order_id
    JOIN products p ON od.product_id = p.id
    WHERE i.payment_status = 'paid'
    GROUP BY i.id
    ORDER BY i.created_at DESC;
  `;

  const [rows] = await pool.execute(query);
  return rows as any[];
}


static async getInvoicesList() {
  try {
    const [results] = await pool.execute(`SELECT id, invoice_number, created_at, order_id, payment_status, payment_date FROM invoices`) as any;
    return results;
  } catch (error) {
    console.error("Error in getInvoicesList:", error);
    throw error;
  }
}


  static async getOneById(id: string): Promise<InvoiceRecord | null> {
    const [results] = await pool.execute(
      "SELECT * FROM invoices WHERE id = ?",
      [id]
    ) as any;

    if (results.length === 0) return null;
    return new InvoiceRecord(results[0]);
  }

static async updatePaymentStatus(id: string, newStatus: string): Promise<void> {
  if (newStatus === "paid") {
    await pool.execute(
      "UPDATE invoices SET payment_status = ?, payment_date = NOW() WHERE id = ?",
      [newStatus, id]
    );
  } else {
    await pool.execute(
      "UPDATE invoices SET payment_status = ?, payment_date = NULL WHERE id = ?",
      [newStatus, id]
    );
  }
}


}
export { InvoiceRecord };
